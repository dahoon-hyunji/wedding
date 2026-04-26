import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { LazyDiv } from "../lazyDiv"
import { GALLERY_IMAGES } from "../../images"

const len = GALLERY_IMAGES.length
const getIdx = (i: number) => ((i % len) + len) % len
const GAP = 4
const RATIO = 0.88
const THRESHOLD = 40
const TAP_THRESHOLD = 10
const DURATION = 300

export const Gallery = () => {
  const viewerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const state = useRef({
    current: 0,
    locked: false,
    tracking: false,
    startX: 0,
    deltaX: 0,
  })
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState<number | null>(null)

  const getMetrics = () => {
    const vw = viewerRef.current?.clientWidth || 0
    const iw = vw * RATIO
    const base = -(iw + GAP) + (vw - iw) / 2
    return { iw, base }
  }

  const setOffset = (px: number, animate: boolean) => {
    const t = trackRef.current
    if (!t) return
    const { base } = getMetrics()
    t.style.transition = animate ? `transform ${DURATION}ms ease` : "none"
    t.style.transform = `translateX(${base + px}px)`
  }

  useEffect(() => {
    setOffset(0, false)
  }, [current])

  useEffect(() => {
    const h = () => setOffset(0, false)
    window.addEventListener("resize", h)
    return () => window.removeEventListener("resize", h)
  }, [])

  useEffect(() => {
    const el = viewerRef.current
    if (!el) return

    let animFrame = 0

    const onStart = (e: TouchEvent) => {
      const s = state.current
      if (s.locked) return
      s.tracking = true
      s.startX = e.touches[0].clientX
      s.deltaX = 0
    }

    const onMove = (e: TouchEvent) => {
      const s = state.current
      if (!s.tracking || s.locked) return
      s.deltaX = e.touches[0].clientX - s.startX
      cancelAnimationFrame(animFrame)
      animFrame = requestAnimationFrame(() => setOffset(s.deltaX, false))
    }

    const onEnd = () => {
      const s = state.current
      if (!s.tracking || s.locked) return
      s.tracking = false
      cancelAnimationFrame(animFrame)

      // Tap detection: minimal movement = click
      if (Math.abs(s.deltaX) < TAP_THRESHOLD) {
        setCurrent((c) => {
          setFullscreen(c)
          return c
        })
        return
      }

      const { iw } = getMetrics()
      const step = iw + GAP

      if (Math.abs(s.deltaX) > THRESHOLD) {
        const dir = s.deltaX > 0 ? -1 : 1
        s.locked = true
        setOffset(-step * dir, true)
        setTimeout(() => {
          s.current = getIdx(s.current + dir)
          setCurrent(s.current)
          setOffset(0, false)
          s.locked = false
        }, DURATION)
      } else {
        setOffset(0, true)
      }
    }

    const onCancel = () => {
      const s = state.current
      s.tracking = false
      cancelAnimationFrame(animFrame)
      setOffset(0, true)
    }

    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchmove", onMove, { passive: true })
    el.addEventListener("touchend", onEnd)
    el.addEventListener("touchcancel", onCancel)
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
      el.removeEventListener("touchend", onEnd)
      el.removeEventListener("touchcancel", onCancel)
      cancelAnimationFrame(animFrame)
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

      {fullscreen !== null &&
        createPortal(
          <div className="gallery-fullscreen">
            <div
              className="fullscreen-bg"
              style={{ backgroundImage: `url(${GALLERY_IMAGES[fullscreen]})` }}
            />
            <img
              src={GALLERY_IMAGES[fullscreen]}
              alt={`${fullscreen}`}
              draggable={false}
            />
            <button
              className="fullscreen-close"
              onClick={() => setFullscreen(null)}
            >
              &times;
            </button>
          </div>,
          document.body,
        )}
    </LazyDiv>
  )
}
