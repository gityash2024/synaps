import { useEffect, useRef } from 'react';

type AnimationOptions = {
  threshold?: number;
  rootMargin?: string;
  animationClass?: string;
  once?: boolean;
};

/**
 * Hook to trigger animations when elements scroll into view
 * @param options Animation options
 * @returns ref to attach to the element that should be animated
 */
const useAnimateOnScroll = <T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px',
  animationClass = 'animate-fade-in',
  once = true,
}: AnimationOptions = {}) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    
    if (!element) return;
    
    // Initially set the element to be invisible
    element.style.opacity = '0';
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add animation class when element is visible
            element.classList.add(animationClass);
            
            // Remove the observer if the animation should only happen once
            if (once) {
              observer.unobserve(element);
            }
          } else if (!once) {
            // Remove the animation class when element is not visible
            element.classList.remove(animationClass);
            element.style.opacity = '0';
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );
    
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [animationClass, once, rootMargin, threshold]);
  
  return ref;
};

export default useAnimateOnScroll; 