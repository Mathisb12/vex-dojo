// ─── VEX Runtime Types ───────────────────────────────────────────────────────

export type VexInt = { kind: 'int'; value: number }
export type VexFloat = { kind: 'float'; value: number }
export type VexVector = { kind: 'vector'; x: number; y: number; z: number }
export type VexString = { kind: 'string'; value: string }
export type VexVoid = { kind: 'void' }

export type VexValue = VexInt | VexFloat | VexVector | VexString | VexVoid

export function mkInt(v: number): VexInt { return { kind: 'int', value: Math.trunc(v) } }
export function mkFloat(v: number): VexFloat { return { kind: 'float', value: v } }
export function mkVec(x: number, y: number, z: number): VexVector { return { kind: 'vector', x, y, z } }
export function mkStr(v: string): VexString { return { kind: 'string', value: v } }
export const mkVoid: VexVoid = { kind: 'void' }

export function toFloat(v: VexValue): number {
  if (v.kind === 'int') return v.value
  if (v.kind === 'float') return v.value
  if (v.kind === 'vector') return v.x
  return 0
}

export function toVec(v: VexValue): VexVector {
  if (v.kind === 'vector') return v
  const n = toFloat(v)
  return mkVec(n, n, n)
}

export function isTruthy(v: VexValue): boolean {
  if (v.kind === 'int') return v.value !== 0
  if (v.kind === 'float') return v.value !== 0
  if (v.kind === 'string') return v.value.length > 0
  if (v.kind === 'vector') return v.x !== 0 || v.y !== 0 || v.z !== 0
  return false
}

export function vexAdd(a: VexValue, b: VexValue): VexValue {
  if (a.kind === 'vector' || b.kind === 'vector') {
    const av = toVec(a), bv = toVec(b)
    return mkVec(av.x + bv.x, av.y + bv.y, av.z + bv.z)
  }
  if (a.kind === 'float' || b.kind === 'float') return mkFloat(toFloat(a) + toFloat(b))
  return mkInt(toFloat(a) + toFloat(b))
}

export function vexSub(a: VexValue, b: VexValue): VexValue {
  if (a.kind === 'vector' || b.kind === 'vector') {
    const av = toVec(a), bv = toVec(b)
    return mkVec(av.x - bv.x, av.y - bv.y, av.z - bv.z)
  }
  if (a.kind === 'float' || b.kind === 'float') return mkFloat(toFloat(a) - toFloat(b))
  return mkInt(toFloat(a) - toFloat(b))
}

export function vexMul(a: VexValue, b: VexValue): VexValue {
  if (a.kind === 'vector' && b.kind === 'vector') {
    return mkVec(a.x * b.x, a.y * b.y, a.z * b.z)
  }
  if (a.kind === 'vector') { const s = toFloat(b); return mkVec(a.x * s, a.y * s, a.z * s) }
  if (b.kind === 'vector') { const s = toFloat(a); return mkVec(b.x * s, b.y * s, b.z * s) }
  if (a.kind === 'float' || b.kind === 'float') return mkFloat(toFloat(a) * toFloat(b))
  return mkInt(toFloat(a) * toFloat(b))
}

export function vexDiv(a: VexValue, b: VexValue): VexValue {
  const bv = toFloat(b)
  if (bv === 0) return a.kind === 'vector' ? mkVec(0, 0, 0) : mkFloat(0)
  if (a.kind === 'vector') { return mkVec(a.x / bv, a.y / bv, a.z / bv) }
  if (a.kind === 'float' || b.kind === 'float') return mkFloat(toFloat(a) / bv)
  return mkFloat(toFloat(a) / bv)
}

export function vexMod(a: VexValue, b: VexValue): VexValue {
  const bv = toFloat(b)
  if (bv === 0) return mkInt(0)
  return mkFloat(toFloat(a) % bv)
}

// ─── AST Node Types ──────────────────────────────────────────────────────────

export type TypeName = 'int' | 'float' | 'vector' | 'string' | 'void'

export type ASTNode =
  | Program
  | VarDecl
  | AssignStmt
  | ExprStmt
  | IfStmt
  | ForStmt
  | WhileStmt
  | Block
  | ReturnStmt
  | Expr

export type Expr =
  | Literal
  | Identifier
  | AttrAccess
  | VectorLiteral
  | BinaryExpr
  | UnaryExpr
  | CallExpr
  | MemberExpr
  | IndexExpr
  | AssignExpr

export interface Program { kind: 'Program'; body: ASTNode[] }
export interface VarDecl { kind: 'VarDecl'; type: TypeName; name: string; init: Expr | null }
export interface AssignStmt { kind: 'AssignStmt'; target: AssignTarget; op: AssignOp; value: Expr }
export interface ExprStmt { kind: 'ExprStmt'; expr: Expr }
export interface IfStmt { kind: 'IfStmt'; cond: Expr; then: Block; else: Block | null }
export interface ForStmt { kind: 'ForStmt'; init: VarDecl | AssignStmt | ExprStmt | null; cond: Expr | null; update: Expr | null; body: Block }
export interface WhileStmt { kind: 'WhileStmt'; cond: Expr; body: Block }
export interface Block { kind: 'Block'; body: ASTNode[] }
export interface ReturnStmt { kind: 'ReturnStmt'; value: Expr | null }

export interface Literal { kind: 'Literal'; value: number | string; type: 'int' | 'float' | 'string' }
export interface Identifier { kind: 'Identifier'; name: string }
export interface AttrAccess { kind: 'AttrAccess'; attr: string; comp: 'x' | 'y' | 'z' | null; attrType?: TypeName }
export interface VectorLiteral { kind: 'VectorLiteral'; x: Expr; y: Expr; z: Expr }
export interface BinaryExpr { kind: 'BinaryExpr'; op: BinaryOp; left: Expr; right: Expr }
export interface UnaryExpr { kind: 'UnaryExpr'; op: '-' | '!'; operand: Expr }
export interface CallExpr { kind: 'CallExpr'; name: string; args: Expr[] }
export interface MemberExpr { kind: 'MemberExpr'; object: Expr; prop: string }
export interface IndexExpr { kind: 'IndexExpr'; object: Expr; index: Expr }
export interface AssignExpr { kind: 'AssignExpr'; target: AssignTarget; op: AssignOp; value: Expr }

export type AssignTarget =
  | { kind: 'IdentTarget'; name: string }
  | { kind: 'AttrTarget'; attr: string; comp: 'x' | 'y' | 'z' | null; attrType?: TypeName }
  | { kind: 'MemberTarget'; object: Expr; prop: string }
  | { kind: 'IndexTarget'; object: Expr; index: Expr }

export type BinaryOp = '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '<' | '>' | '<=' | '>=' | '&&' | '||'
export type AssignOp = '=' | '+=' | '-=' | '*=' | '/='
