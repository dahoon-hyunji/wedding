import { useCallback, useEffect, useRef } from "react"
import { LazyDiv } from "../lazyDiv"
import { GALLERY_IMAGES } from "../../images"

const CLONE_COUNT = 1

export const Gallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isJumping = useRef(false)

  // Build items: [cloneLast, ...originals, cloneFirst]
  const items = [
    ...GALLERY_IMAGES.slice(-CLONE_COUNT),
    ...GALLERY_IMAGES,
    ...GALLERY_IMAGES.slice(0, CLONE_COUNT),
  ]

  const getItemElements = useCallback(() => {
    const el = scrollRef.current
    if (!el) return []
    return Array.from(el.children) as HTMLElement[]
  }, [])

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "instant") => {
      const el = scrollRef.current
      const children = getItemElements()
      if (!el || !children[index]) return
      const child = children[index]
      const targetScroll =
        child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2
      el.scrollTo({ left: targetScroll, behavior })
    },
    [getItemElements],
  )

  // Initialize scroll position to first real item
  useEffect(() => {
    // Small delay to ensure layout is ready
    requestAnimationFrame(() => {
      scrollToIndex(CLONE_COUNT, "instant")
    })
  }, [scrollToIndex])

  // Detect when scroll lands on a clone and silently jump to the real item
  const handleScrollEnd = useCallback(() => {
    if (isJumping.current) return
    const el = scrollRef.current
    if (!el) return

    const children = getItemElements()
    const scrollCenter = el.scrollLeft + el.clientWidth / 2

    // Find which item is closest to center
    let closestIdx = 0
    let closestDist = Infinity
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2
      const dist = Math.abs(scrollCenter - childCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })

    // If on a clone, jump to corresponding real item
    if (closestIdx < CLONE_COUNT) {
      // Left clone → jump to real item near end
      isJumping.current = true
      const realIdx = closestIdx + GALLERY_IMAGES.length
      scrollToIndex(realIdx, "instant")
      requestAnimationFrame(() => {
        isJumping.current = false
      })
    } else if (closestIdx >= CLONE_COUNT + GALLERY_IMAGES.length) {
      // Right clone → jump to real item near start
      isJumping.current = true
      const realIdx = closestIdx - GALLERY_IMAGES.length
      scrollToIndex(realIdx, "instant")
      requestAnimationFrame(() => {
        isJumping.current = false
      })
    }
  }, [getItemElements, scrollToIndex])

  // Use scrollend event with fallback timer
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let timer = 0
    const supportsScrollEnd = "onscrollend" in window

    if (supportsScrollEnd) {
      el.addEventListener("scrollend", handleScrollEnd)
    }

    const onScroll = () => {
      if (!supportsScrollEnd) {
        clearTimeout(timer)
        timer = window.setTimeout(handleScrollEnd, 100)
      }
    }

    el.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      el.removeEventListener("scroll", onScroll)
      if (supportsScrollEnd) {
        el.removeEventListener("scrollend", handleScrollEnd)
      }
      clearTimeout(timer)
    }
  }, [handleScrollEnd])

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="gallery-scroll" ref={scrollRef}>
        {items.map((src, i) => (
          <div className="gallery-item" key={i}>
            <img src={src} alt={`gallery-${i}`} draggable={false} />
          </div>
        ))}
      </div>
    </LazyDiv>
  )
}
