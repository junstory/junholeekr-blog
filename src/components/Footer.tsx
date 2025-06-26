// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 및 소개 */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              JunhoLee.kr
            </Link>
            <p className="mt-2 text-gray-600 text-sm">
              새로운 기술을 배우고 경험을 공유합니다.
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              빠른 링크
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-gray-600 hover:text-gray-900 text-sm">
                  아카이브
                </Link>
              </li>
            </ul>
          </div>

          {/* 소셜 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              연결
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a 
                  href="https://github.com/junstory" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="mailto:lastcom1@gmail.com" 
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  이메일
                </a>
              </li>
              {/* <li>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 text-sm"
                >
                  LinkedIn
                </a>
              </li> */}
            </ul>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} JunhoLee.kr. All rights reserved.
            </p>
            {/* <div className="mt-2 md:mt-0 flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                이용약관
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
