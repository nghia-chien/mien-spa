import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SIG106 } from '../components/signature/SIG-106/SIG-106'
import { brand } from '../data/site'
import { SiteNav } from '../components/SiteNav'
import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { LayersStory } from '../components/LayersStory'
import { Services } from '../components/Services'
import { Reviews } from '../components/Reviews'
import { ComboPath } from '../components/ComboPath'
import { PriceList } from '../components/PriceList'
import { SpaceGallery } from '../components/SpaceGallery'
import { Booking } from '../components/Booking'
import { Footer } from '../components/Footer'
import { startSmooth, getLenis } from '../lib/smooth'
import { scrollToHashOnLoad } from '../lib/scroll-to-section'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const stop = startSmooth()
    // --header-h = SIG-106's real header height (px, read by scroll-to-section)
    const header = document.querySelector<HTMLElement>('#top > header')
    const setH = () => header && document.documentElement.style.setProperty('--header-h', `${Math.round(header.getBoundingClientRect().height)}px`)
    setH()
    const ro = header ? new ResizeObserver(setH) : null
    if (header && ro) ro.observe(header)
    document.fonts.ready.then(() => {
      setH()
      ScrollTrigger.refresh()
      scrollToHashOnLoad({ lenis: getLenis() ?? undefined })
    })
    return () => {
      ro?.disconnect()
      stop()
    }
  }, [])

  return (
    <SIG106 id="top" brand={brand.name} tagline={brand.tagline} intensity={1} logo={{ src: brand.logoLight, alt: brand.fullName }} labels={{ brand: brand.fullName }}>
      {/* SIG-106 pads its children (4rem 2rem); cancel it so sections run full-bleed */}
      <div style={{ margin: '-4rem -2rem' }}>
        <SiteNav />
        <main>
          <Hero />
          <About />
          <LayersStory />
          <Services />
          <ComboPath />
          <PriceList />
          <SpaceGallery />
          <Reviews />
          <Booking />
        </main>
        <Footer />
      </div>
    </SIG106>
  )
}
