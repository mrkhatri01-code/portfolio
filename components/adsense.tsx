"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface AdSenseProps {
  slot?: string
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
  responsive?: boolean
  style?: React.CSSProperties
}

export function AdSense({ slot, format = "auto", responsive = true, style }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    try {
      // Check if AdSense is loaded
      if (window.adsbygoogle) {
        // Push the ad to AdSense for rendering
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("Error initializing AdSense:", error)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden my-4" style={style}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8971928382719723"
        data-ad-slot={slot || ""}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  )
}

