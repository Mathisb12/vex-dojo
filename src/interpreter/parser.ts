// ─── VEX Parser (recursive descent) ─────────────────────────────────────────

import { lex, Token, TKind } from './lexer'
import type {
  ASTNode, Expr, Program, Block, VarDecl, AssignStmt, ExprStmt,
  IfStmt, ForStmt, WhileStmt, ReturnStmt,
  Literal, Identifier, AttrAccess, VectorLiteral,
  BinaryExpr, UnaryExpr, CallExpr, MemberExpr, IndexExpr, AssignExpr,
  AssignTarget, AssignOp, BinaryOp, TypeName,
} from './types'

export class ParseError extends Error {
  constructor(msg: string, public line: number, public col: number) {
    super(msg)
    this.name = 'ParseError'
  }
}

const TYPE_NAMES = new Set(['int', 'float', 'vector', 'string', 'void'])

class Parser {
  private tokens: Token[]
  private pos = 0

  constructor(src: string) {
    this.tokens = lex(src)
  }

  private peek(offset = 0): Token { return this.tokens[this.pos + offset] ?? { kind: 'EOF', value: '', line: 0, col: 0 } }
  private advance(): Token { return this.tokens[this.pos++] ?? { kind: 'EOF', value: '', line: 0, col: 0 } }
  private check(kind: TKind, value?: string): boolean {
    const t = this.peek()
    return t.kind === kind && (value === undefined || t.value === value)
  }
  private match(kind: TKind, value?: string): boolean {
    if (this.check(kind, value)) { this.advance(); return true }
    return false
  }
  private expect(kind: TKind, value?: string): Token {
    if (this.check(kind, value)) return this.advance()
    const t = this.peek()
    throw new ParseError(
      `Expected ${value ?? kind} but got '${t.value || t.kind}' at line ${t.line}`,
      t.line, t.col
    )
  }

  private isType(): boolean {
    return this.peek().kind === 'KEYWORD' && TYPE_NAMES.has(this.peek().value)
  }

  parse(): Program {
    const body: ASTNode[] = []
    while (!this.check('EOF')) {
      body.push(this.parseStatement())
    }
    return { kind: 'Program', body }
  }

  private parseStatement(): ASTNode {
    const t = this.peek()

    // type declarations: int x = ...; float y; vector v;
    if (this.isType() && this.peek(1).kind === 'IDENT') {
      return this.parseVarDecl()
    }

    if (t.kind === 'KEYWORD') {
      switch (t.value) {
        case 'if': return this.parseIf()
        case 'for': return this.parseFor()
        case 'while': return this.parseWhile()
        case 'return': return this.parseReturn()
      }
    }

    if (t.kind === 'LBRACE') return this.parseBlock()

    // Expression statement (assignment, call, increment, etc.)
    const expr = this.parseExpr()
    this.expect('SEMI')
    return { kind: 'ExprStmt', expr } as ExprStmt
  }

  private parseVarDecl(): VarDecl {
    const typeTok = this.advance()
    const type = typeTok.value as TypeName
    const name = this.expect('IDENT').value
    let init: Expr | null = null
    if (this.match('EQ')) {
      init = this.parseExpr()
    }
    this.expect('SEMI')
    return { kind: 'VarDecl', type, name, init }
  }

  private parseIf(): IfStmt {
    this.advance() // 'if'
    this.expect('LPAREN')
    const cond = this.parseExpr()
    this.expect('RPAREN')
    const then = this.parseBlock()
    let elseBranch: Block | null = null
    if (this.check('KEYWORD', 'else')) {
      this.advance()
      if (this.check('KEYWORD', 'if')) {
        // else if → wrap as block with one if statement
        const nested = this.parseIf()
        elseBranch = { kind: 'Block', body: [nested] }
      } else {
        elseBranch = this.parseBlock()
      }
    }
    return { kind: 'IfStmt', cond, then, else: elseBranch }
  }

  private parseFor(): ForStmt {
    this.advance() // 'for'
    this.expect('LPAREN')

    let init: VarDecl | AssignStmt | ExprStmt | null = null
    if (!this.check('SEMI')) {
      if (this.isType() && this.peek(1).kind === 'IDENT') {
        // parse var decl without consuming trailing ;
        const typeTok = this.advance()
        const type = typeTok.value as TypeName
        const name = this.expect('IDENT').value
        let initExpr: Expr | null = null
        if (this.match('EQ')) initExpr = this.parseExpr()
        this.expect('SEMI')
        init = { kind: 'VarDecl', type, name, init: initExpr }
      } else {
        const expr = this.parseExpr()
        this.expect('SEMI')
        init = { kind: 'ExprStmt', expr }
      }
    } else {
      this.advance() // consume ;
    }

    let cond: Expr | null = null
    if (!this.check('SEMI')) cond = this.parseExpr()
    this.expect('SEMI')

    let update: Expr | null = null
    if (!this.check('RPAREN')) update = this.parseExpr()
    this.expect('RPAREN')

    const body = this.parseBlock()
    return { kind: 'ForStmt', init, cond, update, body }
  }

  private parseWhile(): WhileStmt {
    this.advance()
    this.expect('LPAREN')
    const cond = this.parseExpr()
    this.expect('RPAREN')
    const body = this.parseBlock()
    return { kind: 'WhileStmt', cond, body }
  }

  private parseReturn(): ReturnStmt {
    this.advance()
    let value: Expr | null = null
    if (!this.check('SEMI')) value = this.parseExpr()
    this.expect('SEMI')
    return { kind: 'ReturnStmt', value }
  }

  private parseBlock(): Block {
    this.expect('LBRACE')
    const body: ASTNode[] = []
    while (!this.check('RBRACE') && !this.check('EOF')) {
      body.push(this.parseStatement())
    }
    this.expect('RBRACE')
    return { kind: 'Block', body }
  }

  // ─── Expressions (precedence climbing) ──────────────────────────────────────

  private parseExpr(): Expr { return this.parseAssign() }

  private parseAssign(): Expr {
    const left = this.parseOr()

    const opMap: Record<string, AssignOp> = {
      '=': '=', '+=': '+=', '-=': '-=', '*=': '*=', '/=': '/=',
    }
    const opTokMap: Record<string, TKind> = {
      '=': 'EQ', '+=': 'PLUSEQ', '-=': 'MINUSEQ', '*=': 'STAREQ', '/=': 'SLASHEQ',
    }

    for (const [opStr, op] of Object.entries(opMap)) {
      if (this.check(opTokMap[opStr] as TKind)) {
        this.advance()
        const value = this.parseAssign()
        const target = exprToTarget(left)
        if (target) return { kind: 'AssignExpr', target, op, value } as AssignExpr
        throw new ParseError('Invalid assignment target', 0, 0)
      }
    }
    return left
  }

  private parseOr(): Expr {
    let left = this.parseAnd()
    while (this.check('OR')) {
      this.advance()
      left = { kind: 'BinaryExpr', op: '||', left, right: this.parseAnd() } as BinaryExpr
    }
    return left
  }

  private parseAnd(): Expr {
    let left = this.parseEq()
    while (this.check('AND')) {
      this.advance()
      left = { kind: 'BinaryExpr', op: '&&', left, right: this.parseEq() } as BinaryExpr
    }
    return left
  }

  private parseEq(): Expr {
    let left = this.parseCompare()
    while (this.check('EQEQ') || this.check('NEQ')) {
      const op = this.advance().value as BinaryOp
      left = { kind: 'BinaryExpr', op, left, right: this.parseCompare() } as BinaryExpr
    }
    return left
  }

  private parseCompare(): Expr {
    let left = this.parseAdd()
    while (this.check('LT') || this.check('GT') || this.check('LTE') || this.check('GTE')) {
      const op = this.advance().value as BinaryOp
      left = { kind: 'BinaryExpr', op, left, right: this.parseAdd() } as BinaryExpr
    }
    return left
  }

  private parseAdd(): Expr {
    let left = this.parseMul()
    while (this.check('PLUS') || this.check('MINUS')) {
      const op = this.advance().value as BinaryOp
      left = { kind: 'BinaryExpr', op, left, right: this.parseMul() } as BinaryExpr
    }
    return left
  }

  private parseMul(): Expr {
    let left = this.parseUnary()
    while (this.check('STAR') || this.check('SLASH') || this.check('PERCENT')) {
      const op = this.advance().value as BinaryOp
      left = { kind: 'BinaryExpr', op, left, right: this.parseUnary() } as BinaryExpr
    }
    return left
  }

  private parseUnary(): Expr {
    if (this.check('MINUS')) {
      this.advance()
      return { kind: 'UnaryExpr', op: '-', operand: this.parseUnary() } as UnaryExpr
    }
    if (this.check('BANG')) {
      this.advance()
      return { kind: 'UnaryExpr', op: '!', operand: this.parseUnary() } as UnaryExpr
    }
    return this.parsePostfix()
  }

  private parsePostfix(): Expr {
    let expr = this.parsePrimary()

    while (true) {
      if (this.check('DOT') && this.peek(1).kind === 'IDENT') {
        this.advance()
        const prop = this.advance().value
        expr = { kind: 'MemberExpr', object: expr, prop } as MemberExpr
      } else if (this.check('LBRACKET')) {
        this.advance()
        const index = this.parseExpr()
        this.expect('RBRACKET')
        expr = { kind: 'IndexExpr', object: expr, index } as IndexExpr
      } else if (this.check('PLUSPLUS')) {
        // i++ → i += 1 (sugar)
        this.advance()
        const target = exprToTarget(expr)
        if (target) return { kind: 'AssignExpr', target, op: '+=', value: { kind: 'Literal', value: 1, type: 'int' } as Literal } as AssignExpr
        break
      } else if (this.check('MINUSMINUS')) {
        this.advance()
        const target = exprToTarget(expr)
        if (target) return { kind: 'AssignExpr', target, op: '-=', value: { kind: 'Literal', value: 1, type: 'int' } as Literal } as AssignExpr
        break
      } else {
        break
      }
    }
    return expr
  }

  private parsePrimary(): Expr {
    const t = this.peek()

    // Parenthesized
    if (t.kind === 'LPAREN') {
      this.advance()
      const e = this.parseExpr()
      this.expect('RPAREN')
      return e
    }

    // Vector literal {x, y, z}
    if (t.kind === 'LBRACE') {
      this.advance()
      const x = this.parseExpr(); this.expect('COMMA')
      const y = this.parseExpr(); this.expect('COMMA')
      const z = this.parseExpr()
      this.expect('RBRACE')
      return { kind: 'VectorLiteral', x, y, z } as VectorLiteral
    }

    // Number literals
    if (t.kind === 'INT_LIT') {
      this.advance()
      return { kind: 'Literal', value: parseInt(t.value, 10), type: 'int' } as Literal
    }
    if (t.kind === 'FLOAT_LIT') {
      this.advance()
      return { kind: 'Literal', value: parseFloat(t.value), type: 'float' } as Literal
    }
    if (t.kind === 'STRING_LIT') {
      this.advance()
      return { kind: 'Literal', value: t.value, type: 'string' } as Literal
    }

    // Attribute @name or @name.x/y/z
    if (t.kind === 'ATTR') {
      this.advance()
      const attr = t.value
      let comp: 'x' | 'y' | 'z' | null = null
      if (this.check('DOT')) {
        const next = this.peek(1)
        if (next.kind === 'IDENT' && (next.value === 'x' || next.value === 'y' || next.value === 'z')) {
          this.advance(); comp = this.advance().value as 'x' | 'y' | 'z'
        }
      }
      return { kind: 'AttrAccess', attr, comp } as AttrAccess
    }

    // Identifier or function call — also covers type-cast calls like int(x), float(x), vector(x),
    // since VEX lets you call a type name as a cast and the lexer tags those as KEYWORD, not IDENT.
    if (t.kind === 'IDENT' || (t.kind === 'KEYWORD' && TYPE_NAMES.has(t.value) && this.peek(1).kind === 'LPAREN')) {
      this.advance()
      if (this.check('LPAREN')) {
        // function call
        this.advance()
        const args: Expr[] = []
        if (!this.check('RPAREN')) {
          args.push(this.parseExpr())
          while (this.match('COMMA')) args.push(this.parseExpr())
        }
        this.expect('RPAREN')
        return { kind: 'CallExpr', name: t.value, args } as CallExpr
      }
      return { kind: 'Identifier', name: t.value } as Identifier
    }

    throw new ParseError(`Unexpected token '${t.value || t.kind}' at line ${t.line}`, t.line, t.col)
  }
}

function exprToTarget(e: Expr): AssignTarget | null {
  if (e.kind === 'Identifier') return { kind: 'IdentTarget', name: e.name }
  if (e.kind === 'AttrAccess') return { kind: 'AttrTarget', attr: e.attr, comp: e.comp }
  if (e.kind === 'MemberExpr') return { kind: 'MemberTarget', object: e.object, prop: e.prop }
  if (e.kind === 'IndexExpr') return { kind: 'IndexTarget', object: e.object, index: e.index }
  return null
}

export function parse(src: string): Program {
  return new Parser(src).parse()
}
