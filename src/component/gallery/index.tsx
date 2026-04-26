import { useState } from "react"
import { createPortal } from "react-dom"
import { LazyDiv } from "../lazyDiv"
import { GALLERY_IMAGES } from "../../images"

export const Gallery = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  return (
    <LazyDiv className="card gallery">
      <h2 className="english">Gallery</h2>
      <div className="gallery-grid">
        {GALLERY_IMAGES.map((image, idx) => (
          <div
            className="gallery-item"
            key={idx}
            onClick={() => setSelectedIdx(idx)}
          >
            <img src={image} alt={`${idx}`} draggable={false} />
          </div>
        ))}
      </div>

      {selectedIdx !== null &&
        createPortal(
          <div
            className="gallery-fullscreen"
            onClick={() => setSelectedIdx(null)}
          >
            <img
              src={GALLERY_IMAGES[selectedIdx]}
              alt={`${selectedIdx}`}
              draggable={false}
            />
          </div>,
          document.body,
        )}
    </LazyDiv>
  )
}
