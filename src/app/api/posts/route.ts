// src/app/api/posts/route.ts

import fs from "node:fs";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "../../../../lib/auth";

const postsDirectory = path.join(process.cwd(), "_posts");

export async function POST(request: NextRequest) {
	try {
		// 인증 확인
		await requireAuth();
		
		const { title, slug, content, tags, readTime, tableOfContents, views } = await request.json();

		if (!title || !slug || !content) {
			return NextResponse.json(
				{ message: "Title, slug, and content are required" },
				{ status: 400 },
			);
		}

		// 슬러그 유효성 검사 (추가하면 더 좋음)
		if (!/^[a-z0-9-]+$/.test(slug)) {
			return NextResponse.json(
				{
					message:
						"Slug can only contain lowercase letters, numbers, and hyphens.",
				},
				{ status: 400 },
			);
		}

		const date = new Date().toISOString().split("T")[0];

		// --- 이 부분이 바뀝니다 ---
		const fileName = `${slug}.md`; // 클라이언트에서 받은 slug를 그대로 파일명으로 사용
		const fullPath = path.join(postsDirectory, fileName);
		// --- 여기까지 ---

		if (fs.existsSync(fullPath)) {
			return NextResponse.json(
				{ message: "A post with this slug already exists" },
				{ status: 409 },
			);
		}

		// excerpt를 content의 첫 150자로 자동 생성
		const excerpt = content.replace(/[#*`]/g, '').substring(0, 150).trim() + (content.length > 150 ? '...' : '');

		const fileContent = `---
title: '${title}'
date: '${date}'
excerpt: '${excerpt}'
tags: [${tags?.map((tag: string) => `'${tag}'`).join(', ') || ''}]
readTime: ${readTime || 1}
views: ${views || 0}
tableOfContents: ${JSON.stringify(tableOfContents || [])}
---

${content}
`;

		fs.writeFileSync(fullPath, fileContent);

		// slug를 그대로 응답
		return NextResponse.json(
			{ message: "Post created successfully", slug },
			{ status: 201 },
		);
	} catch (error) {
		// 인증 에러인 경우
		if (error instanceof Error && error.message === 'Authentication required') {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}
		
		console.error('Post creation error:', error);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
