// src/app/api/upload/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    // 지원되는 이미지 타입 확인
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const baseFileName = path.basename(file.name, fileExtension);
    const safeFileName = baseFileName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${timestamp}_${safeFileName}${fileExtension}`;

    // 파일을 public/images 디렉토리에 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), "public", "images");
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    // 업로드된 파일의 URL 반환
    const fileUrl = `/images/${fileName}`;
    
    return NextResponse.json({ 
      url: fileUrl,
      fileName: fileName,
      message: "File uploaded successfully" 
    });
    
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
