import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

const SliderControl = ({ slideRef, itemsPerPage = 1, showIndicator = true }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);
  const [gapSize, setGapSize] = useState(0);

  // Memoized function to calculate slider metrics
  const calculateMetrics = useCallback(() => {
    if (slideRef?.current && slideRef.current.children.length > 0) {
      const container = slideRef.current;
      const firstItem = container.children[0];

      if (firstItem) {
        const computedStyle = window.getComputedStyle(container);
        const gap = parseInt(computedStyle.gap) || 0;

        setItemWidth(firstItem.offsetWidth);
        setGapSize(gap);
        setTotalPages(Math.ceil(container.children.length / itemsPerPage));
      }
    }
  }, [slideRef, itemsPerPage]);

  // Handle scroll events to track active index
  const handleScroll = useCallback(() => {
    if (slideRef?.current && itemWidth > 0) {
      const scrollPosition = slideRef.current.scrollLeft;
      const scrollAmount = (itemWidth + gapSize) * itemsPerPage;
      const newIndex = Math.round(scrollPosition / scrollAmount);
      setActiveIndex(Math.min(newIndex, totalPages - 1));
    }
  }, [slideRef, itemWidth, gapSize, itemsPerPage, totalPages]);

  // Navigation handlers
  const scrollToIndex = useCallback((index) => {
    if (slideRef?.current && itemWidth > 0) {
      const scrollAmount = (itemWidth + gapSize) * itemsPerPage * index;
      slideRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setActiveIndex(index);
    }
  }, [slideRef, itemWidth, gapSize, itemsPerPage]);

  const handlePrev = () => scrollToIndex(Math.max(activeIndex - 1, 0));
  const handleNext = () => scrollToIndex(Math.min(activeIndex + 1, totalPages - 1));

  // Set up event listeners and initial calculations
  useEffect(() => {
    calculateMetrics();

    const container = slideRef?.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(calculateMetrics);
    resizeObserver.observe(container);

    container.addEventListener('scroll', handleScroll);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
    };
  }, [slideRef, itemsPerPage, calculateMetrics, handleScroll]);

  // Disable buttons when at boundaries
  const isAtStart = activeIndex === 0;
  const isAtEnd = activeIndex >= totalPages - 1;

  return (
    <div className="flex items-center gap-4">
      <div className="rounded-md px-3 py-2 bg-[#0F0F0F] flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={isAtStart}
          className={`p-1.5 rounded-sm bg-[#141414] text-[#E4E4E7] hover:bg-[#1a1a1a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E50000] ${
            isAtStart ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Previous slide"
        >
          <ArrowLeft size={20} />
        </button>

        {showIndicator && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeIndex === index ? 'bg-[#E50000] w-4' : 'bg-[#333] hover:bg-[#555]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={isAtEnd}
          className={`p-1.5 rounded-sm bg-[#141414] text-[#E4E4E7] hover:bg-[#1a1a1a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E50000] ${
            isAtEnd ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Next slide"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SliderControl;