// ─── VEX Lexer ────────────────────────────────────────────────────────────────

export type TKind =
  | 'INT_LIT' | 'FLOAT_LIT' | 'STRING_LIT'
  | 'IDENT' | 'ATTR'
  | 'KEYWORD'
  | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'PERCENT'
  | 'EQ' | 'PLUSEQ' | 'MINUSEQ' | 'STAREQ' | 'SLASHEQ'
  | 'EQEQ' | 'NEQ' | 'LT' | 'GT' | 'LTE' | 'GTE'
  | 'AND' | 'OR' | 'BANG'
  | 'PLUSPLUS' | 'MINUSMINUS'
  | 'LPAREN' | 'RPAREN' | 'LBRACE' | 'RBRACE' | 'LBRACKET' | 'RBRACKET'
  | 'SEMI' | 'COMMA' | 'DOT' | 'QUESTION' | 'COLON'
  | 'EOF'

export interface Token {
  kind: TKind
  value: string
  line: number
  col: number
}

const KEYWORDS = new Set([
  'int', 'float', 'vector', 'string', 'void',
  'if', 'else', 'for', 'while', 'return',
  'break', 'continue',
])

export class LexError extends Error {
  constructor(msg: string, public line: number, public col: number) {
    super(msg)
    this.name = 'LexError'
  }
}

export function lex(src: string): Token[] {
  const tokens: Token[] = []
  let i = 0, line = 1, col = 1

  function peek(offset = 0) { return src[i + offset] ?? '' }
  function advance() {
    const c = src[i++]
    if (c === '\n') { line++; col = 1 } else { col++ }
    return c
  }
  function tok(kind: TKind, value: string): Token {
    return { kind, value, line, col }
  }

  while (i < src.length) {
    const startLine = line, startCol = col
    const c = peek()

    // Whitespace
    if (/\s/.test(c)) { advance(); continue }

    // Line comment
    if (c === '/' && peek(1) === '/') {
      while (i < src.length && peek() !== '\n') advance()
      continue
    }

    // Block comment
    if (c === '/' && peek(1) === '*') {
      advance(); advance()
      while (i < src.length && !(peek() === '*' && peek(1) === '/')) advance()
      if (i < src.length) { advance(); advance() }
      continue
    }

    // Numbers
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(peek(1)))) {
      let num = ''
      let isFloat = false
      while (i < src.length && /[0-9]/.test(peek())) num += advance()
      if (peek() === '.' && /[0-9]/.test(peek(1))) {
        isFloat = true
        num += advance()
        while (i < src.length && /[0-9]/.test(peek())) num += advance()
      }
      // optional f suffix
      if (peek() === 'f' || peek() === 'F') { advance(); isFloat = true }
      tokens.push({ kind: isFloat ? 'FLOAT_LIT' : 'INT_LIT', value: num, line: startLine, col: startCol })
      continue
    }

    // Strings
    if (c === '"') {
      advance()
      let str = ''
      while (i < src.length && peek() !== '"') {
        if (peek() === '\\') { advance(); str += advance() }
        else str += advance()
      }
      if (peek() === '"') advance()
      tokens.push({ kind: 'STRING_LIT', value: str, line: startLine, col: startCol })
      continue
    }

    // Attribute @name
    if (c === '@') {
      advance()
      let name = ''
      while (i < src.length && /[a-zA-Z_0-9]/.test(peek())) name += advance()
      tokens.push({ kind: 'ATTR', value: name, line: startLine, col: startCol })
      continue
    }

    // Identifiers / keywords
    if (/[a-zA-Z_]/.test(c)) {
      let name = ''
      while (i < src.length && /[a-zA-Z_0-9]/.test(peek())) name += advance()
      tokens.push({ kind: KEYWORDS.has(name) ? 'KEYWORD' : 'IDENT', value: name, line: startLine, col: startCol })
      continue
    }

    // Operators
    advance()
    switch (c) {
      case '+':
        if (peek() === '+') { advance(); tokens.push(tok('PLUSPLUS', '++')); break }
        if (peek() === '=') { advance(); tokens.push(tok('PLUSEQ', '+=')); break }
        tokens.push(tok('PLUS', '+')); break
      case '-':
        if (peek() === '-') { advance(); tokens.push(tok('MINUSMINUS', '--')); break }
        if (peek() === '=') { advance(); tokens.push(tok('MINUSEQ', '-=')); break }
        tokens.push(tok('MINUS', '-')); break
      case '*':
        if (peek() === '=') { advance(); tokens.push(tok('STAREQ', '*=')); break }
        tokens.push(tok('STAR', '*')); break
      case '/':
        if (peek() === '=') { advance(); tokens.push(tok('SLASHEQ', '/=')); break }
        tokens.push(tok('SLASH', '/')); break
      case '%': tokens.push(tok('PERCENT', '%')); break
      case '=':
        if (peek() === '=') { advance(); tokens.push(tok('EQEQ', '==')); break }
        tokens.push(tok('EQ', '=')); break
      case '!':
        if (peek() === '=') { advance(); tokens.push(tok('NEQ', '!=')); break }
        tokens.push(tok('BANG', '!')); break
      case '<':
        if (peek() === '=') { advance(); tokens.push(tok('LTE', '<=')); break }
        tokens.push(tok('LT', '<')); break
      case '>':
        if (peek() === '=') { advance(); tokens.push(tok('GTE', '>=')); break }
        tokens.push(tok('GT', '>')); break
      case '&':
        if (peek() === '&') { advance(); tokens.push(tok('AND', '&&')); break }
        throw new LexError(`Unexpected '&', did you mean '&&'?`, startLine, startCol)
      case '|':
        if (peek() === '|') { advance(); tokens.push(tok('OR', '||')); break }
        throw new LexError(`Unexpected '|', did you mean '||'?`, startLine, startCol)
      case '(': tokens.push(tok('LPAREN', '(')); break
      case ')': tokens.push(tok('RPAREN', ')')); break
      case '{': tokens.push(tok('LBRACE', '{')); break
      case '}': tokens.push(tok('RBRACE', '}')); break
      case '[': tokens.push(tok('LBRACKET', '[')); break
      case ']': tokens.push(tok('RBRACKET', ']')); break
      case ';': tokens.push(tok('SEMI', ';')); break
      case ',': tokens.push(tok('COMMA', ',')); break
      case '.': tokens.push(tok('DOT', '.')); break
      case '?': tokens.push(tok('QUESTION', '?')); break
      case ':': tokens.push(tok('COLON', ':')); break
      default:
        throw new LexError(`Unexpected character '${c}'`, startLine, startCol)
    }
  }

  tokens.push({ kind: 'EOF', value: '', line, col })
  return tokens
}
