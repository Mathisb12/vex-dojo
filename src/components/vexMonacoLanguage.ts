import { VEX_SIGNATURES, VEX_FUNCTION_NAMES } from '../interpreter/signatures'

type MonacoNamespace = typeof import('monaco-editor')

let registered = false

const ATTRS = [
  { name: '@P', doc: 'Position (vector).' },
  { name: '@Cd', doc: 'Diffuse color (vector) — X=red, Y=green, Z=blue.' },
  { name: '@N', doc: 'Surface normal (vector).' },
  { name: '@ptnum', doc: 'Current point index (int, read-only).' },
  { name: '@numpt', doc: 'Total point count (int, read-only).' },
]

const KEYWORDS = ['int', 'float', 'vector', 'string', 'if', 'else', 'for', 'while']

// Finds the function call the cursor is currently inside, scanning backward
// through the text and tracking paren depth (ignores nested calls).
function findActiveCall(text: string): { name: string; argIndex: number } | null {
  let depth = 0
  let argIndex = 0
  for (let i = text.length - 1; i >= 0; i--) {
    const ch = text[i]
    if (ch === ')') {
      depth++
    } else if (ch === '(') {
      if (depth === 0) {
        let j = i - 1
        while (j >= 0 && /\s/.test(text[j])) j--
        const end = j + 1
        while (j >= 0 && /[a-zA-Z0-9_]/.test(text[j])) j--
        const name = text.slice(j + 1, end)
        return name ? { name, argIndex } : null
      }
      depth--
    } else if (ch === ',' && depth === 0) {
      argIndex++
    }
  }
  return null
}

export function registerVexEditorFeatures(monaco: MonacoNamespace) {
  if (registered) return
  registered = true

  monaco.languages.registerSignatureHelpProvider('cpp', {
    signatureHelpTriggerCharacters: ['(', ','],
    signatureHelpRetriggerCharacters: [')'],
    provideSignatureHelp(model, position) {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      const active = findActiveCall(textUntilPosition)
      if (!active) return null
      const sig = VEX_SIGNATURES[active.name]
      if (!sig) return null

      return {
        value: {
          signatures: [
            {
              label: sig.label,
              documentation: sig.doc,
              parameters: sig.params.map(p => ({ label: p.label, documentation: p.doc })),
            },
          ],
          activeSignature: 0,
          activeParameter: Math.min(active.argIndex, sig.params.length - 1),
        },
        dispose: () => {},
      }
    },
  })

  monaco.languages.registerCompletionItemProvider('cpp', {
    triggerCharacters: ['@'],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const fnItems = VEX_FUNCTION_NAMES.map(name => ({
        label: name,
        kind: monaco.languages.CompletionItemKind.Function,
        detail: VEX_SIGNATURES[name].label,
        documentation: VEX_SIGNATURES[name].doc,
        insertText: `${name}($0)`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }))

      const attrItems = ATTRS.map(a => ({
        label: a.name,
        kind: monaco.languages.CompletionItemKind.Property,
        detail: 'VEX attribute',
        documentation: a.doc,
        insertText: a.name.slice(1), // word range already excludes the leading @
        range,
      }))

      const keywordItems = KEYWORDS.map(k => ({
        label: k,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: k,
        range,
      }))

      return { suggestions: [...fnItems, ...attrItems, ...keywordItems] }
    },
  })

  monaco.languages.registerHoverProvider('cpp', {
    provideHover(model, position) {
      const word = model.getWordAtPosition(position)
      if (!word) return null
      const sig = VEX_SIGNATURES[word.word]
      if (!sig) return null
      return {
        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
        contents: [{ value: `**${sig.label}**` }, { value: sig.doc }],
      }
    },
  })
}
