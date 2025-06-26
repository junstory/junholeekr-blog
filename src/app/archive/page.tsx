// src/app/archive/page.tsx
import { getSortedPostsData, type PostData } from "../../../lib/posts";
import { formatDate } from "../../../lib/utils";
import Link from "next/link";

export default async function ArchivePage() {
  const allPosts = getSortedPostsData();
  
  // 연도별로 포스트 그룹화
  const postsByYear = allPosts.reduce((acc: Record<number, PostData[]>, post: PostData) => {
    const year = new Date(post.date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(postsByYear)
    .map(Number)
    .sort((a, b) => b - a); // 최신 연도부터

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">아카이브</h1>
        <p className="text-xl text-gray-600">
          모든 글을 연도별로 정리했습니다. ({allPosts.length}개의 글)
        </p>
      </div>

      <div className="space-y-12">
        {years.map((year) => (
          <div key={year} className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {year}년 ({postsByYear[year].length}개의 글)
            </h2>
            
            <div className="space-y-4">
              {postsByYear[year].map((post: PostData) => (
                <article key={post.id} className="group">
                  <Link 
                    href={`/posts/${post.id}`}
                    className="block hover:bg-gray-50 p-4 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        
                        {/* 태그 */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.tags.slice(0, 3).map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{post.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-4">
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                        {post.readTime && (
                          <span>{post.readTime}분</span>
                        )}
                        {post.views !== undefined && (
                          <span>조회 {post.views}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {allPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
