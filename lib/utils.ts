// lib/utils.ts
import fs from 'fs';
import path from 'path';

export function extractThumbnailFromMarkdown(content: string): string | null {
  // 마크다운에서 첫 번째 이미지 URL을 찾는 정규식
  const imageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(imageRegex);
  
  if (match?.[1]) {
    let imagePath = match[1];
    
    // URL이 http로 시작하면 외부 이미지이므로 그대로 반환
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 상대 경로를 절대 경로로 변환
    if (!imagePath.startsWith('/')) {
      imagePath = `/${imagePath}`;
    }
    
    // 파일이 실제로 존재하는지 확인
    try {
      const fullPath = path.join(process.cwd(), 'public', imagePath);
      if (fs.existsSync(fullPath)) {
        return imagePath;
      }
    } catch {
      console.warn(`Thumbnail image not found: ${imagePath}`);
    }
  }
  
  return null;
}

export function formatDate(dateString: string): string {
  const postDate = new Date(dateString + 'T00:00:00+09:00'); // 한국 시간대로 파싱
  const now = new Date();
  
  // 한국 시간대로 오늘 날짜
  const today = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
  
  // 날짜만 비교 (시간 제거)
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetDate = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
  
  const diffTime = todayDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays <= 7) {
    return `${diffDays}일 전`;
  } else if (diffDays <= 30) {
    return `${Math.ceil(diffDays / 7)}주 전`;
  } else {
    return postDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
