"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface ImageGalleryProps {
  screenshots: string[]
}

export function ImageGallery({ screenshots }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="aspect-video bg-mehub-card rounded-lg flex items-center justify-center">
        <p className="text-mehub-text-secondary">No screenshots available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="aspect-video bg-mehub-card rounded-lg overflow-hidden relative group">
        <Image
          src={screenshots[currentImageIndex]}
          alt={`Screenshot ${currentImageIndex + 1}`}
          width={800}
          height={450}
          className="w-full h-full object-cover"
        />
        
        {screenshots.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      {screenshots.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-orange-500" : "bg-mehub-text-secondary"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}