// src/app/admin/write/page.tsx
"use client";

import MDEditor from "@uiw/react-md-editor";
import { useRouter } from "next/navigation";
import { useId, useState, useEffect, useCallback } from "react";

export default function WritePage() {
	const [title, setTitle] = useState("");
	const [slug, setSlug] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");
	const [isComposing, setIsComposing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	const router = useRouter();

	// useId 훅을 사용하여 고유 ID 생성
	const titleId = useId();
	const slugId = useId();
	const contentId = useId();
	const tagsId = useId();

	// 인증 확인
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/verify');
				if (response.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
					router.push('/admin/login');
				}
			} catch (error) {
				console.error('Auth check error:', error);
				setIsAuthenticated(false);
				router.push('/admin/login');
			}
		};

		checkAuth();
	}, [router]);

	// 이미지 업로드 함수
	const uploadImage = useCallback(async (file: File): Promise<string> => {
		const formData = new FormData();
		formData.append("file", file);

		setUploadProgress("이미지 업로드 중...");

		try {
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Upload failed");
			}

			const data = await response.json();
			return data.url;
		} catch (error) {
			console.error("Upload error:", error);
			throw error;
		} finally {
			setUploadProgress(null);
		}
	}, []);

	// 마크다운에 이미지 삽입
	const insertImageToMarkdown = useCallback((imageUrl: string, alt: string = "") => {
		const imageMarkdown = `![${alt}](${imageUrl})`;
		setContent(prev => prev + `\n\n${imageMarkdown}\n\n`);
	}, []);

	// 태그 관리 함수들
	const addTag = (tag: string) => {
		const trimmedTag = tag.trim();
		if (trimmedTag && !tags.includes(trimmedTag)) {
			setTags(prev => [...prev, trimmedTag]);
		}
		setTagInput("");
	};

	const removeTag = (tagToRemove: string) => {
		setTags(prev => prev.filter(tag => tag !== tagToRemove));
	};

	const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		// 한글 입력 중일 때는 태그 추가를 하지 않음
		if (isComposing) return;
		
		if (e.key === 'Enter' || e.key === ',') {
			e.preventDefault();
			addTag(tagInput);
		}
	};

	// 한글 입력 시작
	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	// 한글 입력 완료
	const handleCompositionEnd = () => {
		setIsComposing(false);
	};

	// 읽기 시간 계산 (한국어 기준 분당 300자)
	const calculateReadTime = (content: string): number => {
		const textContent = content.replace(/[#*`]/g, '').trim();
		const charCount = textContent.length;
		const readTime = Math.ceil(charCount / 300);
		return Math.max(1, readTime); // 최소 1분
	};

	// 목차 생성 함수
	const generateTableOfContents = (content: string) => {
		const headingRegex = /^(#{1,6})\s+(.+)$/gm;
		const toc = [];
		let match: RegExpExecArray | null;

		while ((match = headingRegex.exec(content)) !== null) {
			const level = match[1].length;
			const text = match[2].trim();
			const id = text.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
			
			toc.push({
				level,
				text,
				id
			});
		}

		return toc;
	};

	// 드래그앤드롭 핸들러
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		
		const files = Array.from(e.dataTransfer.files);
		const imageFiles = files.filter(file => file.type.startsWith('image/'));
		
		for (const file of imageFiles) {
			try {
				const imageUrl = await uploadImage(file);
				insertImageToMarkdown(imageUrl, file.name.split('.')[0]);
			} catch {
				alert('이미지 업로드 실패: ' + file.name);
			}
		}
	};

	// 전역 paste 이벤트 처리 (클립보드에서 이미지 붙여넣기)
	useEffect(() => {
		const handleGlobalPaste = async (e: ClipboardEvent) => {
			const items = Array.from(e.clipboardData?.items || []);
			const imageItems = items.filter(item => item.type.startsWith('image/'));
			
			if (imageItems.length > 0) {
				for (const item of imageItems) {
					const file = item.getAsFile();
					if (file) {
						try {
							const imageUrl = await uploadImage(file);
							insertImageToMarkdown(imageUrl, `pasted-image-${Date.now()}`);
						} catch {
							alert("이미지 업로드 실패");
						}
					}
				}
			}
		};

		document.addEventListener("paste", handleGlobalPaste);
		return () => document.removeEventListener("paste", handleGlobalPaste);
	}, [uploadImage, insertImageToMarkdown]);

	// 제목을 입력하면 자동으로 URL-friendly한 슬러그를 제안하는 함수
	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newTitle = e.target.value;
		setTitle(newTitle);

		const newSlug = newTitle
			.toString()
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9\s-]/g, "") // 영문, 숫자, 공백, 하이픈 외 제거
			.replace(/\s+/g, "-"); // 공백을 하이픈으로 변경
		setSlug(newSlug);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			// 추가 메타데이터 계산
			const readTime = calculateReadTime(content);
			const tableOfContents = generateTableOfContents(content);

			const res = await fetch("/api/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 
					title, 
					slug, 
					content, 
					tags,
					readTime,
					tableOfContents,
					views: 0 // 초기 조회수
				}),
			});

			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || "Something went wrong");
			}

			const data = await res.json();
			alert("글이 성공적으로 작성되었습니다!");
			// 글 작성 후 해당 글로 이동 (실제 반영은 재빌드 후)
			router.push(`/posts/${data.slug}`);
		} catch (err) {
			// 에러 타입을 확인하여 안전하게 메시지 처리
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("An unknown error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// 인증 상태가 확인되지 않았으면 로딩 표시
	if (isAuthenticated === null) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-lg">인증 확인 중...</div>
			</div>
		);
	}

	// 인증되지 않았으면 빈 화면 (리다이렉트 중)
	if (isAuthenticated === false) {
		return null;
	}

	return (
		<div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
			<h1 className="text-3xl font-bold mb-6">새 글 작성하기</h1>
			
			{/* 업로드 상태 표시 */}
			{uploadProgress && (
				<div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
					{uploadProgress}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor={titleId}
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						제목
					</label>
					<input
						id={titleId}
						type="text"
						value={title}
						onChange={handleTitleChange}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
						placeholder="글 제목을 입력하세요"
					/>
				</div>

				<div>
					<label
						htmlFor={slugId}
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						URL 슬러그
					</label>
					<input
						id={slugId}
						type="text"
						value={slug}
						onChange={(e) => setSlug(e.target.value)}
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
						placeholder="url-friendly-slug"
					/>
					<p className="mt-1 text-sm text-gray-500">
						글의 URL이 될 부분입니다. 영문, 숫자, 하이픈만 사용하세요.
					</p>
				</div>

				{/* 태그 입력 */}
				<div>
					<label
						htmlFor={tagsId}
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						태그
					</label>
					<input
						id={tagsId}
						type="text"
						value={tagInput}
						onChange={(e) => setTagInput(e.target.value)}
						onKeyDown={handleTagInputKeyPress}
						onCompositionStart={handleCompositionStart}
						onCompositionEnd={handleCompositionEnd}
						className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
						placeholder="태그를 입력하고 Enter 또는 쉼표를 눌러주세요"
					/>
					
					{/* 태그 표시 */}
					{tags.length > 0 && (
						<div className="mt-2 flex flex-wrap gap-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-sky-100 text-sky-800"
								>
									{tag}
									<button
										type="button"
										onClick={() => removeTag(tag)}
										className="ml-1 text-sky-600 hover:text-sky-800"
									>
										×
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				<div>
					<label
						htmlFor={contentId}
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						내용
					</label>
					<div className="text-sm text-gray-600 mb-2">
						💡 이미지를 드래그앤드롭하거나 Ctrl+V로 붙여넣기할 수 있습니다
					</div>
					<section
						data-color-mode="light"
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						className={`relative ${isDragOver ? 'ring-2 ring-blue-500 ring-opacity-50 bg-blue-50' : ''}`}
						aria-label="마크다운 에디터 드래그앤드롭 영역"
					>
						<MDEditor
							id={contentId}
							value={content}
							onChange={(val) => setContent(val || "")}
							preview="edit"
							height={500}
							data-color-mode="light"
						/>
					</section>
				</div>

				<div className="flex justify-end">
					<button
						type="submit"
						disabled={isLoading}
						className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{isLoading ? "저장 중..." : "발행하기"}
					</button>
				</div>

				{error && (
					<p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md">
						{error}
					</p>
				)}
			</form>
		</div>
	);
}
