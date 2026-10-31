import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

interface RevealProps {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
}

/** Faz o conteúdo surgir suavemente quando entra na tela. Sem IntersectionObserver, aparece direto. */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
