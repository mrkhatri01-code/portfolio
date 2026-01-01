"use client"

import { useEffect, type RefObject } from "react"

export function useClientAnimation(sliderRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    // Clone the slider content for a seamless loop
    const cloneSlider = () => {
      const slides = slider.children
      const slidesArray = Array.from(slides)

      // Reset animation when it completes
      const handleAnimationEnd = () => {
        slider.style.animation = "none"
        slider.offsetHeight // Trigger reflow
        slider.style.animation = ""
      }

      slider.addEventListener("animationend", handleAnimationEnd)

      return () => {
        slider.removeEventListener("animationend", handleAnimationEnd)
      }
    }

    return cloneSlider()
  }, [sliderRef])

  return null
}
