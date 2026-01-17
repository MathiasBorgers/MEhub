"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageGalleryProps {
  screenshots: string[]
}

export function ImageGallery({ screenshots }: ImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set())

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
  }

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index))
  }

  const isDirectImageUrl = (url: string) => {
    // Check if URL has image extension
    if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)) {
      return true
    }

    // Check if URL is from known image hosting services
    const imageHostingDomains = [
      'picsum.photos',
      'via.placeholder.com',
      'placeholder.com',
      'i.imgur.com',
      'i.ibb.co',
      'i.postimg.cc',
      'res.cloudinary.com',
      'img.freepik.com',
    ]

    try {
      const urlObj = new URL(url)
      return imageHostingDomains.some(domain => urlObj.hostname.includes(domain))
    } catch {
      return false
    }
  }

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="aspect-video bg-mehub-card rounded-lg flex items-center justify-center">
        <p className="text-mehub-text-secondary">No screenshots available</p>
      </div>
    )
  }

  const currentUrl = screenshots[currentImageIndex]
  const hasError = imageErrors.has(currentImageIndex)
  const isDirect = isDirectImageUrl(currentUrl)

  return (
    <div className="relative">
      <div className="aspect-video bg-mehub-card rounded-lg overflow-hidden relative group">
        {hasError || !isDirect ? (
          // Fallback for non-image URLs or errors
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
            <ImageIcon size={64} className="text-mehub-text-secondary" />
            <p className="text-mehub-text text-center">
              {hasError ? "Image failed to load" : "Screenshot link (not a direct image)"}
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-mehub-accent text-mehub-bg rounded-lg hover:bg-mehub-accent/90 transition-colors"
            >
              <ExternalLink size={16} />
              View Screenshot
            </a>
          </div>
        ) : (
          <Image
            src={currentUrl}
            alt={`Screenshot ${currentImageIndex + 1}`}
            width={800}
            height={450}
            className="w-full h-full object-cover"
            onError={() => handleImageError(currentImageIndex)}
          />
        )}

        {screenshots.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next screenshot"
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
                index === currentImageIndex ? "bg-mehub-accent" : "bg-mehub-text-secondary"
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}