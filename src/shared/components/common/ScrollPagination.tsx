import { useEffect, useRef, useState } from 'react';

interface ScrollPaginationProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export default function ScrollPagination({ onLoadMore, hasMore, loading }: ScrollPaginationProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setIsIntersecting(true);
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    if (isIntersecting) {
      setIsIntersecting(false);
    }
  }, [isIntersecting]);

  if (!hasMore) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No more events to load</p>
      </div>
    );
  }

  return (
    <div ref={observerRef} className="py-8">
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading more events...</span>
        </div>
      ) : (
        <div className="text-center text-gray-400">
          <p>Scroll down to load more events</p>
        </div>
      )}
    </div>
  );
}
