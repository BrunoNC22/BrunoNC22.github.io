import { useMemo } from 'react'
import { tokenize } from '../../lib/highlight'
import { Icon } from './Icon'
import './code-block.css'

interface CodeBlockProps {
  file: string
  href: string
  source: string
}

export function CodeBlock({ file, href, source }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(source), [source])

  return (
    <figure className="code">
      <figcaption className="code__head">
        <span className="code__file mono" title={file}>
          {file}
        </span>
        <a className="code__link" href={href} target="_blank" rel="noreferrer">
          <Icon name="github" />
          <span>Ver no GitHub</span>
        </a>
      </figcaption>
      <pre className="code__body" tabIndex={0} aria-label={`Trecho de ${file}`}>
        <code>
          {tokens.map((token, i) =>
            token.type === 'plain' ? (
              token.text
            ) : (
              <span key={i} className={`tok-${token.type}`}>
                {token.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </figure>
  )
}
