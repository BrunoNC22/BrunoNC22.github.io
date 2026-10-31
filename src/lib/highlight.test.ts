import { describe, expect, it } from 'vitest'
import { tokenize } from './highlight'

const typesOf = (source: string) => tokenize(source).filter((t) => t.type !== 'plain')

describe('tokenize', () => {
  it('reconstrói exatamente o código original', () => {
    const source = "export class A implements B {\n  async save(item: Item): Promise<void> { return 'ok' } // fim\n}"
    expect(tokenize(source).map((t) => t.text).join('')).toBe(source)
  })

  it('reconhece palavras-chave, tipos e chamadas de função', () => {
    expect(typesOf('await this.queue.add(event)')).toEqual([
      { type: 'keyword', text: 'await' },
      { type: 'keyword', text: 'this' },
      { type: 'function', text: 'add' },
    ])
    expect(typesOf('new SyncEvent()')).toEqual([
      { type: 'keyword', text: 'new' },
      { type: 'type', text: 'SyncEvent' },
    ])
  })

  it('não realça palavras-chave dentro de strings e comentários', () => {
    expect(typesOf("'return this' // await new")).toEqual([
      { type: 'string', text: "'return this'" },
      { type: 'comment', text: '// await new' },
    ])
  })

  it('reconhece números e template strings', () => {
    expect(typesOf('const total = 10_000 + `x${1}`')).toEqual([
      { type: 'keyword', text: 'const' },
      { type: 'number', text: '10_000' },
      { type: 'string', text: '`x${1}`' },
    ])
  })

  it('identificadores com letra minúscula seguidos de espaço não viram função', () => {
    expect(typesOf('foundUser = user')).toEqual([])
  })
})
