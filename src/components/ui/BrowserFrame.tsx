import './browser-frame.css'

interface BrowserFrameProps {
  src: string
  alt: string
  url: string
  width: number
  height: number
}

export function BrowserFrame({ src, alt, url, width, height }: BrowserFrameProps) {
  return (
    <figure className="browser">
      <div className="browser__bar" aria-hidden="true">
        <span className="browser__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url mono">{url}</span>
      </div>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </figure>
  )
}
