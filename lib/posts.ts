// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { extractThumbnailFromMarkdown } from './utils';
import { getPostViews, getAllPostStats } from './database';

const postsDirectory = path.join(process.cwd(), '_posts');

// 포스트 타입 정의
export interface PostData {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  thumbnail?: string | null;
  tags?: string[];
  readTime?: number;
  views?: number;
  tableOfContents?: Array<{
    level: number;
    text: string;
    id: string;
    index: number;
  }>;
  contentHtml?: string;
}

// 모든 포스트를 날짜순으로 정렬하여 가져오는 함수
export function getSortedPostsData(): PostData[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allStats = getAllPostStats();
  
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // 썸네일 추출
    const thumbnail = extractThumbnailFromMarkdown(matterResult.content);
    
    // 데이터베이스에서 조회수 가져오기
    const views = allStats[id]?.views || 0;

    return {
      id,
      thumbnail,
      views,
      ...matterResult.data as Omit<PostData, 'id' | 'contentHtml' | 'thumbnail' | 'views'>,
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 모든 포스트의 id (파일 이름)를 가져오는 함수 (동적 라우팅용)
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // 데이터베이스에서 조회수 가져오기
  const views = getPostViews(id);

  return {
    id,
    contentHtml,
    views,
    ...matterResult.data as Omit<PostData, 'id' | 'contentHtml' | 'views'>,
  };
}

// 조회수 증가 함수
export function incrementViews(id: string): void {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const currentViews = (matterResult.data.views as number) || 0;
  const updatedData = {
    ...matterResult.data,
    views: currentViews + 1,
  };

  const updatedContent = matter.stringify(matterResult.content, updatedData);
  fs.writeFileSync(fullPath, updatedContent);
}