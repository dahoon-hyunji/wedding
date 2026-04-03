import { useEffect, useRef } from "react"

class Sparkle {
  x: number
  y: number
  size: number
  opacity: number
  maxOpacity: number
  fadeSpeed: number
  xSpeed: number
  ySpeed: number
  phase: number

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.size = 1.5 + Math.random() * 2.5
    this.maxOpacity = 0.15 + Math.random() * 0.35
    this.opacity = Math.random() * this.maxOpacity
    this.fadeSpeed = 0.003 + Math.random() * 0.008
    this.xSpeed = (Math.random() - 0.5) * 0.3
    this.ySpeed = -0.1 - Math.random() * 0.2
    this.phase = Math.random() * Math.PI * 2
  }

  draw(time: number) {
    this.x += this.xSpeed
    this.y += this.ySpeed
    this.phase += this.fadeSpeed

    this.opacity = this.maxOpacity * (0.3 + 0.7 * Math.abs(Math.sin(this.phase)))

    if (this.y < -10 || this.x < -10 || this.x > this.canvas.width + 10) {
      this.x = Math.random() * this.canvas.width
      this.y = this.canvas.height + Math.random() * 20
      this.phase = Math.random() * Math.PI * 2
    }

    const gradient = this.ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 2,
    )
    gradient.addColorStop(0, `rgba(255, 255, 240, ${this.opacity})`)
    gradient.addColorStop(0.4, `rgba(255, 245, 220, ${this.opacity * 0.6})`)
    gradient.addColorStop(1, `rgba(255, 240, 210, 0)`)

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2)
    this.ctx.fillStyle = gradient
    this.ctx.fill()
  }
}

export const BGEffect = () => {
  const ref = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const sparklesRef = useRef<Sparkle[]>([])
  const resizeTimeoutRef = useRef(0)
  const animationFrameIdRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const getCount = () => {
      return Math.floor((window.innerWidth * window.innerHeight) / 25000)
    }

    const initialize = () => {
      const count = getCount()
      const sparkles = []
      for (let i = 0; i < count; i++) {
        sparkles.push(new Sparkle(canvas, ctx))
      }
      sparklesRef.current = sparkles
    }

    initialize()

    let time = 0
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time++
      sparklesRef.current.forEach((s) => s.draw(time))
      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = window.setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const newCount = getCount()
        if (newCount > sparklesRef.current.length) {
          for (let i = sparklesRef.current.length; i < newCount; i++) {
            sparklesRef.current.push(new Sparkle(canvas, ctx))
          }
        } else if (newCount < sparklesRef.current.length) {
          sparklesRef.current.splice(newCount)
        }
      }, 100)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(animationFrameIdRef.current)
    }
  }, [])

  return (
    <div className="bg-effect">
      <canvas ref={ref} />
    </div>
  )
}
