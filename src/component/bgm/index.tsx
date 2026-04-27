import { useCallback, useEffect, useRef, useState } from "react"
import bgmUrl from "../../music/bgm.opus"

export const BGM = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [showToast, setShowToast] = useState(true)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = new Audio(bgmUrl)
    audio.loop = true
    audio.volume = 0.3
    audioRef.current = audio

    return () => {
      audio.pause()
    }
  }, [])

  useEffect(() => {
    if (started) return

    const handleInteraction = () => {
      const audio = audioRef.current
      if (!audio) return
      audio.play()
      setPlaying(true)
      setStarted(true)
      setShowToast(false)
    }

    document.addEventListener("click", handleInteraction, { once: true })
    document.addEventListener("touchstart", handleInteraction, { once: true })

    return () => {
      document.removeEventListener("click", handleInteraction)
      document.removeEventListener("touchstart", handleInteraction)
    }
  }, [started])

  useEffect(() => {
    if (!showToast) return
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
  }, [showToast])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play()
      setPlaying(true)
    }
  }, [playing])

  return (
    <>
      {showToast && (
        <div className="bgm-toast">
          <span>배경음악이 재생됩니다</span>
        </div>
      )}
      {started && (
        <button
          className={"bgm-toggle" + (playing ? " playing" : "")}
          onClick={toggle}
          aria-label={playing ? "음악 끄기" : "음악 켜기"}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          )}
        </button>
      )}
    </>
  )
}
