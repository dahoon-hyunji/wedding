import { useCallback, useEffect, useRef, useState } from "react"
import { LazyDiv } from "../lazyDiv"
import { GALLERY_IMAGES } from "../../images"

const len = GALLERY_IMAGES.length
const getIdx = (i: number) => ((i % len) + len) % len
const GAP = 4
const ITEM_RATIO = 0.88

export const Gallery = () => {
  const [current, setCurrent] = useState(0)
  const viewerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const [swipeX, setSwipeX] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const getItemWidth = useCallback(() => {
    const vw = viewerRef.current?.clientWidth || 0
    return vw * ITEM_RATIO
  }, [])

  const getBaseOffset = useCallback(() => {
    const vw = viewerRef.current?.clientWidth || 0
    const iw = vw * ITEM_RATIO
    return -(iw + GAP) + (vw - iw) / 2
  }, [])

  const goTo = (next: number) => {
    const diff = next - current
    const step = (getItemWidth() + GAP) * diff
    setTransitioning(true)
    setSwipeX(-step)
    setTimeout(() => {
      setTransitioning(false)
      setSwipeX(0)
      setCurrent(getIdx(next))
    }, 300)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (transitioning) return
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (transitioning) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
    setSwipeX(touchDeltaX.current)
  }

  const onTouchEnd = () => {
    if (transitioning) return
    if (touchDeltaX.current > 30) {
      goTo(current - 1)
    } else if (touchDeltaX.current < -30) {
      goTo(current + 1)
    } else {
      setSwipeX(0)
    }
  }

  const [baseOffset, setBaseOffset] = useState(0)
  useEffect(() => {
    const update = () => setBaseOffset(getBaseOffset())
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [getBaseOffset])

  const prevIdx = getIdx(current - 1)
  const nextIdx = getIdx(current + 1)

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div
        className="gallery-viewer"
        ref={viewerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={`gallery-track${transitioning ? " transitioning" : ""}`}
          style={{ transform: `translateX(${baseOffset + swipeX}px)` }}
        >
          {[prevIdx, current, nextIdx].map((idx, i) => (
            <div className="photo-item" key={`${idx}-${i}`}>
              <img
                src={GALLERY_IMAGES[idx]}
                alt={`${idx}`}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </LazyDiv>
  )
}
