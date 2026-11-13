import { Sig510ImageLanes } from './signature/SIG-510/SIG-510'
import { space } from '../data/site'

/** Không gian — SIG-510 (scrub #2 of 2): three lanes of real photos drifting in opposite directions. */
export function SpaceGallery() {
  return (
    <div className="bg-cream">
      <Sig510ImageLanes
        id="khong-gian"
        intensity={2}
        title={space.title}
        intro={space.intro}
        lanes={space.lanes.map((l) => [...l])}
        labels={{ region: 'Ảnh không gian Miên Spa', lane: 'Hàng ảnh' }}
      />
    </div>
  )
}
