import { useEffect, useRef, useState } from "react"
import { LazyDiv } from "../lazyDiv"
import { GALLERY_IMAGES } from "../../images"

const len = GALLERY_IMAGES.length
const getIdx = (i: number) => ((i % len) + len) % len
const GAP = 4
const RATIO = 0.88
const SWIPE_THRESHOLD = 40
const ANIM_DURATION = 300

export const Gallery = () => {
  const viewerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef(0)
  const lockRef = useRef(false)
  const touchRef = useRef({
    startX: 0,
    startY: 0,
    deltaX: 0,
    decided: false,
    isSwiping: false,
  })
  const [current, setCurrent] = useState(0)

  const getViewerWidth = () => viewerRef.current?.clientWidth || 0
  const getItemWidth = () => getViewerWidth() * RATIO
  const getBaseOffset = () => {
    const vw = getViewerWidth()
    const iw = vw * RATIO
    return -(iw + GAP) + (vw - iw) / 2
  }

  const setTrackStyle = (offset: number, animate: boolean) => {
    const track = trackRef.current
    if (!track) return
    track.style.transition = animate ? `transform ${ANIM_DURATION}ms ease` : "none"
    track.style.transform = `translateX(${getBaseOffset() + offset}px)`
  }

  const slideTo = (dir: number) => {
    if (lockRef.current) return
    lockRef.current = true
    const step = (getItemWidth() + GAP) * dir
    setTrackStyle(-step, true)
    setTimeout(() => {
      const next = getIdx(currentRef.current + dir)
      currentRef.current = next
      setCurrent(next)
      setTrackStyle(0, false)
      lockRef.current = false
    }, ANIM_DURATION)
  }

  // Position track on render and resize
  useEffect(() => {
    setTrackStyle(0, false)
  }, [current])

  useEffect(() => {
    const onResize = () => setTrackStyle(0, false)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Touch handlers via native listeners for passive: false
  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const onTouchStart = (e: TouchEvent) => {
      if (lockRef.current) return
      touchRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        deltaX: 0,
        decided: false,
        isSwiping: false,
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (lockRef.current) return
      const t = touchRef.current
      const dx = e.touches[0].clientX - t.startX
      const dy = e.touches[0].clientY - t.startY

      if (!t.decided) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          t.decided = true
          t.isSwiping = Math.abs(dx) > Math.abs(dy)
        }
        return
      }

      if (!t.isSwiping) return
      e.preventDefault()
      t.deltaX = dx
      setTrackStyle(dx, false)
    }

    const onTouchEnd = () => {
      if (lockRef.current) return
      const t = touchRef.current
      if (!t.isSwiping) return

      if (t.deltaX > SWIPE_THRESHOLD) {
        slideTo(-1)
      } else if (t.deltaX < -SWIPE_THRESHOLD) {
        slideTo(1)
      } else {
        // snap back
        lockRef.current = true
        setTrackStyle(0, true)
        setTimeout(() => {
          lockRef.current = false
        }, ANIM_DURATION)
      }
    }

    viewer.addEventListener("touchstart", onTouchStart)
    viewer.addEventListener("touchmove", onTouchMove, { passive: false })
    viewer.addEventListener("touchend", onTouchEnd)
    return () => {
      viewer.removeEventListener("touchstart", onTouchStart)
      viewer.removeEventListener("touchmove", onTouchMove)
      viewer.removeEventListener("touchend", onTouchEnd)
    }
  }, [])

  const prevIdx = getIdx(current - 1)
  const nextIdx = getIdx(current + 1)

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="gallery-viewer" ref={viewerRef}>
        <div className="gallery-track" ref={trackRef}>
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
