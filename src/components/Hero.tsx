import { Sig208TwoMoodHero } from './signature/SIG-208/SIG-208'
import { hero, primaryCta } from '../data/site'
import { Cta } from './ui/Cta'

/**
 * Hero — SIG-208 (project variant): one full-screen frame; a diagonal wall follows the mouse between the two
 * moods. The brand name sits in the centre with one standard CTA right under it.
 */
export function Hero() {
  return (
    <Sig208TwoMoodHero
      id="hero"
      intensity={2}
      before={hero.before}
      after={hero.after}
      labels={{ handle: 'Vách giữa hai khung cảnh: ngoài kia và tại Miên' }}
      info={
        <>
          <h1 className="font-display text-[clamp(3.4rem,8vw,7.5rem)] leading-[0.95] text-ink">Miên Spa Tuy Hòa</h1>
          <Cta target={primaryCta.target} className="mt-7 !min-h-14 !px-8 !text-[1.0625rem]">Đặt lịch ngay</Cta>
        </>
      }
    />
  )
}
