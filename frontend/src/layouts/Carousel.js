import React, { useState, useEffect } from "react"

export function Carousel({
  images = [],
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0)

  // If no images provided, show a placeholder
  if (images.length === 0) {
    images = ["https://via.placeholder.com/400x400?text=No+Image+Available"];
  }

  // Generate slides from images
  const slides = images.map((image, index) => (
    <div key={index} className="min-w-full">
      <img
        src={image}
        alt={`Product image ${index + 1}`}
        className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
      />
    </div>
  ));

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [autoSlide, autoSlideInterval])
  return (
    <div className="flex flex-col">
      <div className="overflow-hidden relative md:rounded-lg">
        <div
          className="flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {slides}
        </div>

        {slides.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={prev}
              className="bg-white/80 rounded-full p-2 shadow hover:bg-white transition-all"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={next}
              className="bg-white/80 rounded-full p-2 shadow hover:bg-white transition-all"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0">
            <div className="flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurr(i)}
                  className={`
                  transition-all w-2 h-2 rounded-full
                  ${curr === i ? "bg-yellow-400 w-4" : "bg-white/50 hover:bg-white/80"}
                `}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="hidden md:flex w-full gap-4 mt-4">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setCurr(i)}
              className={`
                cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                ${curr === i ? 'border-yellow-400' : 'border-transparent hover:border-yellow-200'}
              `}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className={`h-16 w-16 object-cover rounded-lg
                  ${curr === i ? 'opacity-70' : 'opacity-100'}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}