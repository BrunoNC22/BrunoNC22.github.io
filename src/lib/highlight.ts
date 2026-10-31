export type TokenType = 'keyword' | 'string' | 'comment' | 'number' | 'type' | 'function' | 'plain'

export interface Token {
  type: TokenType
  text: string
}

const KEYWORDS = new Set([
  'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'constructor', 'continue', 'default',
  'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function', 'if', 'implements',
  'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null', 'of', 'private', 'protected',
  'public', 'readonly', 'return', 'static', 'switch', 'this', 'throw', 'true', 'try', 'type',
  'typeof', 'undefined', 'void', 'while',
])

const PATTERNS: Array<[TokenType, RegExp]> = [
  ['comment', /^\/\/[^\n]*/],
  ['comment', /^\/\*[\s\S]*?\*\//],
  ['string', /^'(?:\\.|[^'\\\n])*'/],
  ['string', /^"(?:\\.|[^"\\\n])*"/],
  ['string', /^`(?:\\.|[^`\\])*`/],
  ['number', /^\d[\d_]*(?:\.\d+)?/],
]

const IDENTIFIER = /^[A-Za-z_$][\w$]*/

/** Tokenizador mínimo para TypeScript: suficiente para realçar trechos curtos de código. */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = []
  let rest = source

  const push = (type: TokenType, text: string) => {
    const last = tokens[tokens.length - 1]
    if (last && last.type === type && type === 'plain') last.text += text
    else tokens.push({ type, text })
  }

  while (rest.length > 0) {
    const pattern = PATTERNS.find(([, regex]) => regex.test(rest))
    if (pattern) {
      const text = rest.match(pattern[1])![0]
      push(pattern[0], text)
      rest = rest.slice(text.length)
      continue
    }

    const identifier = rest.match(IDENTIFIER)
    if (identifier) {
      const word = identifier[0]
      const after = rest.slice(word.length)
      if (KEYWORDS.has(word)) push('keyword', word)
      else if (/^[A-Z]/.test(word)) push('type', word)
      else if (/^\s*\(/.test(after)) push('function', word)
      else push('plain', word)
      rest = after
      continue
    }

    push('plain', rest[0])
    rest = rest.slice(1)
  }

  return tokens
}
