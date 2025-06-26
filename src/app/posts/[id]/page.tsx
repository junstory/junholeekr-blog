// src/app/posts/[id]/page.tsx
import { notFound } from "next/navigation";
import { getPostData, getAllPostIds } from "../../../../lib/posts";
import ViewCounter from "./ViewCounter";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
	const resolvedParams = await params;
	const { id } = resolvedParams;

	try {
		const postData = await getPostData(id);
		
		if (!postData) {
			notFound();
		}

		return (
			<article className="max-w-4xl mx-auto px-4 py-8">
				{/* 헤더 섹션 */}
				<header className="mb-8 pb-8 border-b border-gray-200">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						{postData.title}
					</h1>
					
					<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
						<time dateTime={postData.date}>
							{new Date(postData.date).toLocaleDateString('ko-KR', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</time>
						<span>읽기 시간 {postData.readTime}분</span>
						<span>조회수 <ViewCounter postId={id} initialViews={postData.views || 0} /></span>
					</div>

					{/* 태그 */}
					{postData.tags && postData.tags.length > 0 && (
						<div className="flex flex-wrap gap-2">
							{postData.tags.map((tag: string) => (
								<span
									key={tag}
									className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
								>
									#{tag}
								</span>
							))}
						</div>
					)}
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* 메인 콘텐츠 */}
					<main className="lg:col-span-3">
						<div 
							className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
							dangerouslySetInnerHTML={{ __html: postData.contentHtml || '' }}
						/>
					</main>

					{/* 사이드바 - 목차 */}
					{postData.tableOfContents && postData.tableOfContents.length > 0 && (
						<aside className="lg:col-span-1">
							<div className="sticky top-8">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">목차</h3>
								<nav className="space-y-2">
									{postData.tableOfContents.map((item: { id: string; text: string; level: number }) => (
										<a
											key={item.id}
											href={`#${item.id}`}
											className={`block text-sm hover:text-blue-600 transition-colors ${
												item.level === 1 ? 'font-medium text-gray-900' :
												item.level === 2 ? 'ml-4 text-gray-700' :
												'ml-8 text-gray-600'
											}`}
										>
											{item.text}
										</a>
									))}
								</nav>
							</div>
						</aside>
					)}
				</div>
			</article>
		);
	} catch (error) {
		console.error('Error loading post:', error);
		notFound();
	}
}

// 정적 경로 생성을 위한 함수
export async function generateStaticParams() {
	try {
		const posts = getAllPostIds();
		
		return posts.map((post) => ({
			id: post.params.id,
		}));
	} catch (error) {
		console.error('Error generating static params:', error);
		return [];
	}
}
