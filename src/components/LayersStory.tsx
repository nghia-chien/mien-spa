import { Sig316StickyHeading } from './signature/SIG-316/SIG-316'
import { layers, layersCopy } from '../data/site'

/**
 * Thân · Tâm · Trí — SIG-316 (compact). The three-band curtain now opens the About section (LayersCurtain),
 * not this one. The section keeps the page ground (one background colour for the page).
 */
export function LayersStory() {
  return (
    <div className="relative bg-cream">
      <Sig316StickyHeading
        id="ba-tang"
        intensity={2}
        heading={
          <>
            {layersCopy.heading}
            <span className="mt-3 block max-md:hidden font-[family-name:var(--font-body)] text-[1.125rem] font-normal normal-case leading-relaxed tracking-normal [font-stretch:100%]">{layersCopy.lead}</span>
          </>
        }
        items={layers.map((l) => ({ no: l.no, name: l.name, text: <p>{l.text}</p>, image: l.image }))}
      />
    </div>
  )
}
