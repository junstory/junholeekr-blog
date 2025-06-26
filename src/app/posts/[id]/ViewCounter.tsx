// src/app/posts/[id]/ViewCounter.tsx
"use client";

import { useEffect, useState } from "react";

interface ViewCounterProps {
  postId: string;
  initialViews: number;
}

export default function ViewCounter({ postId, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/views`, {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error('Failed to increment views:', error);
      }
    };

    incrementViews();
  }, [postId]);

  return <span>{views}</span>;
}
