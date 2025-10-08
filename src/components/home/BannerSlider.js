'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { userApiService } from '@/services/api';

export default function BannerSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const intervalRef = useRef(null);


  // جلوگیری از Hydration Error
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const transformApiDataToSlides = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.filter(slide => slide.isActive).map((slide, index) => ({
      id: slide.id,
      image: slide.image,
      alt: `اسلاید ${index + 1}`
    }));
  };

  const fetchSliderData = async () => {
    try {
      setIsLoading(true);
      const response = await userApiService.getSlider();

      if (response.success && response.data?.length > 0) {
        const transformed = transformApiDataToSlides(response.data);
        setSlides(transformed);
      } else {
        setSlides([]);
      }
    } catch (err) {
      console.error('خطا در دریافت اسلایدر:', err);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasMounted) fetchSliderData();
  }, [hasMounted]);

  const startAutoplay = useCallback(() => {
    if (!hasMounted || slides.length <= 1) return;
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
  }, [hasMounted, slides.length]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (hasMounted && slides.length > 0) startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay, slides.length, hasMounted]);

  const ShimmerLoader = () => (
    <section className="relative mt-4">
      <div className="container mx-auto px-4">
        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] overflow-hidden shadow-md rounded-xl bg-gray-200">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse" />
        </div>
      </div>
    </section>
  );

  if (!hasMounted) return <ShimmerLoader />;
  if (isLoading) return <ShimmerLoader />;
  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative mt-4">
      <div className="container mx-auto px-4">
        <div className="relative w-full aspect-[2/1] sm:aspect-[3/1] overflow-hidden shadow-md rounded-xl">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={slides[currentIndex]?.image}
                alt={slides[currentIndex]?.alt}
                fill
                className="object-cover"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
