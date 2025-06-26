// lib/database.ts
import fs from 'fs';
import path from 'path';

interface PostStats {
  views: number;
  lastViewed?: string;
}

interface Database {
  posts: { [postId: string]: PostStats };
}

const dbPath = path.join(process.cwd(), 'data', 'stats.json');

// 데이터베이스 디렉토리 생성
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 데이터베이스 읽기
function readDatabase(): Database {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Error reading database:', error);
  }
  
  return { posts: {} };
}

// 데이터베이스 저장
function writeDatabase(db: Database): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// 조회수 가져오기
export function getPostViews(postId: string): number {
  const db = readDatabase();
  return db.posts[postId]?.views || 0;
}

// 조회수 증가
export function incrementPostViews(postId: string): number {
  const db = readDatabase();
  
  if (!db.posts[postId]) {
    db.posts[postId] = { views: 0 };
  }
  
  db.posts[postId].views += 1;
  db.posts[postId].lastViewed = new Date().toISOString();
  
  writeDatabase(db);
  
  return db.posts[postId].views;
}

// 모든 포스트 통계 가져오기
export function getAllPostStats(): { [postId: string]: PostStats } {
  const db = readDatabase();
  return db.posts;
}
