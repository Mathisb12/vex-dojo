// ─── VEX Evaluator ───────────────────────────────────────────────────────────

import { parse } from './parser'
import { BUILTINS } from './builtins'
import type {
  ASTNode, Expr, Program, Block, VarDecl, ExprStmt, AssignStmt,
  IfStmt, ForStmt, WhileStmt, ReturnStmt,
  Literal, Identifier, AttrAccess, VectorLiteral,
  BinaryExpr, UnaryExpr, CallExpr, MemberExpr, IndexExpr, AssignExpr,
  AssignTarget, AssignOp,
} from './types'
import {
  VexValue, VexVector,
  mkInt, mkFloat, mkVec, mkStr, mkVoid,
  toFloat, toVec, isTruthy,
  vexAdd, vexSub, vexMul, vexDiv, vexMod,
} from './types'

// ─── Point state ─────────────────────────────────────────────────────────────

export interface PointAttrs {
  P: { x: number; y: number; z: number }
  Cd: { x: number; y: number; z: number }
  N: { x: number; y: number; z: number }
  ptnum: number
  numpt: number
  [key: string]: unknown
}

export interface RunResult {
  points: PointAttrs[]
  output: string
  error: string | null
}

const MAX_ITERATIONS = 10_000

class BreakSignal { }
class ContinueSignal { }
class ReturnSignal { constructor(public value: VexValue) { } }

class Environment {
  private vars = new Map<string, VexValue>()
  constructor(private parent: Environment | null = null) { }

  get(name: string): VexValue {
    if (this.vars.has(name)) return this.vars.get(name)!
    if (this.parent) return this.parent.get(name)
    throw new Error(`Undefined variable '${name}'`)
  }

  set(name: string, value: VexValue): void {
    if (this.vars.has(name)) { this.vars.set(name, value); return }
    if (this.parent && this.parent.has(name)) { this.parent.set(name, value); return }
    this.vars.set(name, value)
  }

  define(name: string, value: VexValue): void {
    this.vars.set(name, value)
  }

  has(name: string): boolean {
    return this.vars.has(name) || (this.parent?.has(name) ?? false)
  }
}

class Evaluator {
  private attrs!: PointAttrs

  runForPoint(ast: Program, point: PointAttrs): void {
    this.attrs = point
    const env = new Environment()
    this.execBlock(ast.body, env)
  }

  private exec(node: ASTNode, env: Environment): unknown {
    switch (node.kind) {
      case 'Program': this.execBlock(node.body, env); return mkVoid
      case 'Block': this.execBlock(node.body, env); return mkVoid
      case 'VarDecl': return this.execVarDecl(node as VarDecl, env)
      case 'ExprStmt': return this.evalExpr((node as ExprStmt).expr, env)
      case 'AssignStmt': return this.execAssignStmt(node as AssignStmt, env)
      case 'IfStmt': return this.execIf(node as IfStmt, env)
      case 'ForStmt': return this.execFor(node as ForStmt, env)
      case 'WhileStmt': return this.execWhile(node as WhileStmt, env)
      case 'ReturnStmt': {
        const n = node as ReturnStmt
        const val = n.value ? this.evalExpr(n.value, env) : mkVoid
        throw new ReturnSignal(val)
      }
      default: return mkVoid
    }
  }

  private execBlock(stmts: ASTNode[], parentEnv: Environment): void {
    const env = new Environment(parentEnv)
    for (const stmt of stmts) this.exec(stmt, env)
  }

  private execVarDecl(node: VarDecl, env: Environment): VexValue {
    const init = node.init ? this.evalExpr(node.init, env) : coerceDefault(node.type)
    env.define(node.name, init)
    return init
  }

  private execAssignStmt(node: AssignStmt, env: Environment): VexValue {
    return this.doAssign(node.target, node.op, this.evalExpr(node.value, env), env)
  }

  private execIf(node: IfStmt, env: Environment): void {
    if (isTruthy(this.evalExpr(node.cond, env))) {
      this.execBlock(node.then.body, env)
    } else if (node.else) {
      this.execBlock(node.else.body, env)
    }
  }

  private execFor(node: ForStmt, env: Environment): void {
    const loopEnv = new Environment(env)
    if (node.init) this.exec(node.init, loopEnv)
    let iterations = 0
    while (true) {
      if (++iterations > MAX_ITERATIONS) throw new Error('Max iterations exceeded (infinite loop?)')
      if (node.cond && !isTruthy(this.evalExpr(node.cond, loopEnv))) break
      try {
        this.execBlock(node.body.body, loopEnv)
      } catch (e) {
        if (e instanceof BreakSignal) break
        if (e instanceof ContinueSignal) { /* continue */ }
        else throw e
      }
      if (node.update) this.evalExpr(node.update, loopEnv)
    }
  }

  private execWhile(node: WhileStmt, env: Environment): void {
    let iterations = 0
    while (isTruthy(this.evalExpr(node.cond, env))) {
      if (++iterations > MAX_ITERATIONS) throw new Error('Max iterations exceeded (infinite loop?)')
      try {
        this.execBlock(node.body.body, env)
      } catch (e) {
        if (e instanceof BreakSignal) break
        if (e instanceof ContinueSignal) { /* continue */ }
        else throw e
      }
    }
  }

  // ─── Expression evaluator ──────────────────────────────────────────────────

  evalExpr(expr: Expr, env: Environment): VexValue {
    switch (expr.kind) {
      case 'Literal': return evalLiteral(expr as Literal)
      case 'Identifier': return env.get((expr as Identifier).name)
      case 'AttrAccess': return this.evalAttr(expr as AttrAccess)
      case 'VectorLiteral': return this.evalVecLit(expr as VectorLiteral, env)
      case 'BinaryExpr': return this.evalBinary(expr as BinaryExpr, env)
      case 'UnaryExpr': return this.evalUnary(expr as UnaryExpr, env)
      case 'CallExpr': return this.evalCall(expr as CallExpr, env)
      case 'MemberExpr': return this.evalMember(expr as MemberExpr, env)
      case 'IndexExpr': return this.evalIndex(expr as IndexExpr, env)
      case 'AssignExpr': return this.evalAssignExpr(expr as AssignExpr, env)
      default: return mkVoid
    }
  }

  private evalLit(expr: Expr, env: Environment): VexValue { return this.evalExpr(expr, env) }

  private evalAttr(node: AttrAccess): VexValue {
    const a = this.attrs
    switch (node.attr) {
      case 'P': {
        if (node.comp === 'x') return mkFloat(a.P.x)
        if (node.comp === 'y') return mkFloat(a.P.y)
        if (node.comp === 'z') return mkFloat(a.P.z)
        return mkVec(a.P.x, a.P.y, a.P.z)
      }
      case 'Cd': {
        if (node.comp === 'x') return mkFloat(a.Cd.x)
        if (node.comp === 'y') return mkFloat(a.Cd.y)
        if (node.comp === 'z') return mkFloat(a.Cd.z)
        return mkVec(a.Cd.x, a.Cd.y, a.Cd.z)
      }
      case 'N': {
        if (node.comp === 'x') return mkFloat(a.N.x)
        if (node.comp === 'y') return mkFloat(a.N.y)
        if (node.comp === 'z') return mkFloat(a.N.z)
        return mkVec(a.N.x, a.N.y, a.N.z)
      }
      case 'ptnum': return mkInt(a.ptnum)
      case 'numpt': return mkInt(a.numpt)
      default: {
        // dynamic user attributes
        const val = (a as any)[node.attr]
        if (val !== undefined) {
          if (typeof val === 'number') return mkFloat(val)
          if (val?.x !== undefined) {
            if (node.comp === 'x') return mkFloat(val.x)
            if (node.comp === 'y') return mkFloat(val.y)
            if (node.comp === 'z') return mkFloat(val.z)
            return mkVec(val.x, val.y, val.z)
          }
        }
        return mkFloat(0)
      }
    }
  }

  private evalVecLit(node: VectorLiteral, env: Environment): VexValue {
    return mkVec(
      toFloat(this.evalExpr(node.x, env)),
      toFloat(this.evalExpr(node.y, env)),
      toFloat(this.evalExpr(node.z, env)),
    )
  }

  private evalBinary(node: BinaryExpr, env: Environment): VexValue {
    const l = this.evalExpr(node.left, env)
    // Short-circuit
    if (node.op === '&&') return isTruthy(l) ? this.evalExpr(node.right, env) : mkInt(0)
    if (node.op === '||') return isTruthy(l) ? l : this.evalExpr(node.right, env)
    const r = this.evalExpr(node.right, env)
    switch (node.op) {
      case '+': return vexAdd(l, r)
      case '-': return vexSub(l, r)
      case '*': return vexMul(l, r)
      case '/': return vexDiv(l, r)
      case '%': return vexMod(l, r)
      case '==': return mkInt(vexEq(l, r) ? 1 : 0)
      case '!=': return mkInt(vexEq(l, r) ? 0 : 1)
      case '<':  return mkInt(toFloat(l) < toFloat(r) ? 1 : 0)
      case '>':  return mkInt(toFloat(l) > toFloat(r) ? 1 : 0)
      case '<=': return mkInt(toFloat(l) <= toFloat(r) ? 1 : 0)
      case '>=': return mkInt(toFloat(l) >= toFloat(r) ? 1 : 0)
      default: return mkVoid
    }
  }

  private evalUnary(node: UnaryExpr, env: Environment): VexValue {
    const v = this.evalExpr(node.operand, env)
    if (node.op === '-') {
      if (v.kind === 'vector') return mkVec(-v.x, -v.y, -v.z)
      return mkFloat(-toFloat(v))
    }
    return mkInt(isTruthy(v) ? 0 : 1)
  }

  private evalCall(node: CallExpr, env: Environment): VexValue {
    const fn = BUILTINS[node.name]
    if (!fn) throw new Error(`Unknown function '${node.name}'`)
    const args = node.args.map(a => this.evalExpr(a, env))
    return fn(args)
  }

  private evalMember(node: MemberExpr, env: Environment): VexValue {
    const obj = this.evalExpr(node.object, env)
    if (obj.kind === 'vector') {
      if (node.prop === 'x' || node.prop === 'r') return mkFloat(obj.x)
      if (node.prop === 'y' || node.prop === 'g') return mkFloat(obj.y)
      if (node.prop === 'z' || node.prop === 'b') return mkFloat(obj.z)
    }
    return mkVoid
  }

  private evalIndex(node: IndexExpr, env: Environment): VexValue {
    const obj = this.evalExpr(node.object, env)
    const idx = Math.trunc(toFloat(this.evalExpr(node.index, env)))
    if (obj.kind === 'vector') {
      if (idx === 0) return mkFloat(obj.x)
      if (idx === 1) return mkFloat(obj.y)
      if (idx === 2) return mkFloat(obj.z)
    }
    return mkVoid
  }

  private evalAssignExpr(node: AssignExpr, env: Environment): VexValue {
    return this.doAssign(node.target, node.op, this.evalExpr(node.value, env), env)
  }

  // ─── Assignment ────────────────────────────────────────────────────────────

  private doAssign(target: AssignTarget, op: AssignOp, rhs: VexValue, env: Environment): VexValue {
    if (target.kind === 'IdentTarget') {
      const prev = env.has(target.name) ? env.get(target.name) : mkFloat(0)
      const result = applyOp(prev, op, rhs)
      env.set(target.name, result)
      return result
    }

    if (target.kind === 'AttrTarget') {
      return this.setAttr(target.attr, target.comp, op, rhs)
    }

    if (target.kind === 'MemberTarget') {
      // e.g. v.x += 1 where v is a local variable
      const obj = this.evalExpr(target.object, env)
      if (obj.kind !== 'vector') return mkVoid
      const comp = target.prop as 'x' | 'y' | 'z'
      const prev = mkFloat(obj[comp as keyof VexVector] as number)
      const newComp = toFloat(applyOp(prev, op, rhs))
      const newVec = mkVec(
        comp === 'x' ? newComp : obj.x,
        comp === 'y' ? newComp : obj.y,
        comp === 'z' ? newComp : obj.z,
      )
      // write back into the variable if it was an identifier
      const tgt = exprToIdentName(target.object)
      if (tgt) {
        env.set(tgt, newVec)
      }
      return newVec
    }

    return mkVoid
  }

  private setAttr(attr: string, comp: 'x' | 'y' | 'z' | null, op: AssignOp, rhs: VexValue): VexValue {
    const a = this.attrs

    const applyVec3 = (current: { x: number; y: number; z: number }) => {
      if (comp !== null) {
        const prev = mkFloat(current[comp])
        const newVal = toFloat(applyOp(prev, op, rhs))
        current[comp] = newVal
        return mkFloat(newVal)
      } else {
        const prev = mkVec(current.x, current.y, current.z)
        const result = toVec(applyOp(prev, op, rhs))
        current.x = result.x; current.y = result.y; current.z = result.z
        return mkVec(result.x, result.y, result.z)
      }
    }

    switch (attr) {
      case 'P': return applyVec3(a.P)
      case 'Cd': return applyVec3(a.Cd)
      case 'N': return applyVec3(a.N)
      default: {
        // dynamic user-defined attribute
        const prev = mkFloat(0)
        const result = applyOp(prev, op, rhs)
        ;(a as any)[attr] = toFloat(result)
        return result
      }
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function evalLiteral(node: Literal): VexValue {
  if (node.type === 'int') return mkInt(node.value as number)
  if (node.type === 'float') return mkFloat(node.value as number)
  return mkStr(node.value as string)
}

function coerceDefault(type: string): VexValue {
  if (type === 'int') return mkInt(0)
  if (type === 'float') return mkFloat(0)
  if (type === 'vector') return mkVec(0, 0, 0)
  if (type === 'string') return mkStr('')
  return mkVoid
}

function applyOp(prev: VexValue, op: AssignOp, rhs: VexValue): VexValue {
  switch (op) {
    case '=':  return rhs
    case '+=': return vexAdd(prev, rhs)
    case '-=': return vexSub(prev, rhs)
    case '*=': return vexMul(prev, rhs)
    case '/=': return vexDiv(prev, rhs)
    default: return rhs
  }
}

function vexEq(a: VexValue, b: VexValue): boolean {
  if (a.kind !== b.kind) return toFloat(a) === toFloat(b)
  if (a.kind === 'vector' && b.kind === 'vector') return a.x === b.x && a.y === b.y && a.z === b.z
  if (a.kind === 'string' && b.kind === 'string') return a.value === b.value
  return toFloat(a) === toFloat(b)
}

function exprToIdentName(expr: Expr): string | null {
  if (expr.kind === 'Identifier') return (expr as Identifier).name
  return null
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function runVex(code: string, points: PointAttrs[]): RunResult {
  ;(globalThis as any).__vex_output__ = ''
  let error: string | null = null

  try {
    const ast = parse(code)
    const ev = new Evaluator()
    for (const pt of points) {
      ev.runForPoint(ast, pt)
    }
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : String(e)
  }

  const output: string = (globalThis as any).__vex_output__ ?? ''
  ;(globalThis as any).__vex_output__ = ''

  return { points, output, error }
}

export function makeDefaultPoints(count = 200, shape: 'sphere' | 'grid' | 'random' = 'sphere'): PointAttrs[] {
  const pts: PointAttrs[] = []
  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0
    if (shape === 'sphere') {
      // Fibonacci sphere
      const phi = Math.acos(1 - 2 * (i + 0.5) / count)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      x = Math.sin(phi) * Math.cos(theta)
      y = Math.cos(phi)
      z = Math.sin(phi) * Math.sin(theta)
    } else if (shape === 'grid') {
      const side = Math.ceil(Math.sqrt(count))
      const row = Math.floor(i / side), col = i % side
      x = (col / (side - 1) - 0.5) * 2
      y = (row / (side - 1) - 0.5) * 2
      z = 0
    } else {
      // deterministic pseudo-random
      const h = (n: number) => { n = Math.sin(n * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n) }
      x = (h(i * 3 + 0) - 0.5) * 2
      y = (h(i * 3 + 1) - 0.5) * 2
      z = (h(i * 3 + 2) - 0.5) * 2
    }
    pts.push({
      P: { x, y, z },
      Cd: { x: 0.4, y: 0.8, z: 1.0 },
      N: { x, y, z },
      ptnum: i,
      numpt: count,
    })
  }
  return pts
}
