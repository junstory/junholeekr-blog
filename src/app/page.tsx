// src/app/page.tsx
import Link from "next/link";
import { getSortedPostsData } from "../../lib/posts"; // 경로 확인!
import { formatDate, truncateText } from "../../lib/utils";

export default function HomePage() {
	const allPostsData = getSortedPostsData();

	return (
		<div className="min-h-screen bg-gray-50">
			{/* 헤더 */}
			<header className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">Tech Blog</h1>
							<p className="text-gray-600 mt-1">개발과 기술에 대한 이야기</p>
						</div>
						<Link 
							href="/admin/write"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							글 작성
						</Link>
					</div>
				</div>
			</header>

			{/* 메인 컨텐츠 */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* 포스트 그리드 */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{allPostsData.map((post) => (
						<article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
							<Link href={`/posts/${post.id}`} className="block">
								{/* 썸네일 */}
								<div className="relative h-48 bg-gray-200 overflow-hidden">
									{/** biome-ignore lint: 썸네일 이미지로 img 태그 사용 필요 */}
									<img
										src={post.thumbnail || '/images/default-thumbnail.svg'}
										alt={post.title}
										className="w-full h-full object-cover"
									/>
								</div>

								{/* 컨텐츠 */}
								<div className="p-6">
									<h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
										{post.title}
									</h2>
									
									<p className="text-gray-600 text-sm mb-4 line-clamp-3">
										{truncateText(post.excerpt || '', 120)}
									</p>

									{/* 태그 */}
									{post.tags && post.tags.length > 0 && (
										<div className="flex flex-wrap gap-2 mb-4">
											{post.tags.slice(0, 3).map((tag) => (
												<span
													key={tag}
													className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
												>
													#{tag}
												</span>
											))}
											{post.tags.length > 3 && (
												<span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
													+{post.tags.length - 3}
												</span>
											)}
										</div>
									)}

									{/* 메타 정보 */}
									<div className="flex items-center justify-between text-sm text-gray-500">
										<span>{formatDate(post.date)}</span>
										<div className="flex items-center gap-3">
											{post.readTime && (
												<span className="flex items-center gap-1">
													⏱️ {post.readTime}분
												</span>
											)}
											{post.views !== undefined && (
												<span className="flex items-center gap-1">
													👀 {post.views}
												</span>
											)}
										</div>
									</div>
								</div>
							</Link>
						</article>
					))}
				</div>

				{/* 빈 상태 */}
				{allPostsData.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 text-6xl mb-4">📝</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">아직 작성된 글이 없습니다</h3>
						<p className="text-gray-500 mb-6">첫 번째 블로그 글을 작성해보세요!</p>
						<Link 
							href="/admin/write"
							className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							첫 글 작성하기
						</Link>
					</div>
				)}
			</main>
		</div>
	);
}
