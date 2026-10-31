import { Nav } from './components/Nav'
import { CaseStudies } from './sections/CaseStudies'
import { Education, Footer } from './sections/Education'
import { Hero } from './sections/Hero'
import { OpenSource } from './sections/OpenSource'
import { Professional } from './sections/Professional'
import { Timeline } from './sections/Timeline'

export function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Nav />
      <main id="conteudo">
        <Hero />
        <Timeline />
        <CaseStudies />
        <OpenSource />
        <Professional />
        <Education />
      </main>
      <Footer />
    </>
  )
}
