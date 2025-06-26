// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">소개</h1>
        <p className="text-xl text-gray-600">
          안녕하세요, 개발자 이준호입니다.
        </p>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Me</h2>
          <p className="text-gray-700 mb-4">
            안녕하세요! 백엔드 개발과 서버 운영에 관심이 많은 개발자 입니다.<br></br>
            이 블로그는 개발 경험과 학습한 내용을 공유하고자 시작했습니다.
          </p>
          <p className="text-gray-700 mb-4">
            블로그 개발은 바이브 코딩으로 이루어졌습니다. (next.js, tailwind css, typescript)
          </p>
          <p className="text-gray-700">
            새로운 기술을 배우고 실험하는 것을 좋아하며, 
            무엇이든 거리낌 없이 도전하는 개발자가 되고 싶습니다.<br></br>
            안정적인 서버 운영을 지향합니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Frontend</h3>
              <ul className="text-gray-700 space-y-1">
                <li>JavaScript</li>
                <li>React / Next.js</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Backend</h3>
              <ul className="text-gray-700 space-y-1">
                <li>Node.js</li>
                <li>SpringBoot</li>
                <li>Database (MySQL, PostgreSQL)</li>
                <li>Docker, k8s</li>
                <li>AWS</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-700 mb-4">
            궁금한 점이나 문의가 있으시면 아래 연락처를 통해 연락해주시면 감사하겠습니다.
          </p>
          <div className="flex flex-col space-y-2">
            <a 
              href="mailto:lastcom1@gmail.com" 
              className="text-blue-600 hover:text-blue-800"
            >
              📧 lastcom1@gmail.com
            </a>
            <a 
              href="https://github.com/junstory" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              🐙 GitHub
            </a>
            {/* <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              💼 LinkedIn
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
}
