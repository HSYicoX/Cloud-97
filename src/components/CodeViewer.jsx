// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Download } from 'lucide-react';

export function CodeViewer({
  selectedFile,
  repository
}) {
  const getFileContent = () => {
    switch (selectedFile) {
      case 'README.md':
        return `# ${repository.name}

${repository.description}

## 功能特性

- 📝 Markdown编辑器
- 🎨 GitHub风格UI
- 📁 文件树导航
- 🔄 实时同步

## 安装

\`\`\`bash
npm install
npm run dev
\`\`\``;
      default:
        return '// 选择文件查看内容';
    }
  };
  return <div className="bg-[#161b22] border-[#30363d] rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-[#30363d]">
        <h3 className="text-lg font-semibold text-white">{selectedFile}</h3>
        <Button size="sm" variant="outline" className="border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]">
          <Download className="h-4 w-4 mr-2" />
          下载
        </Button>
      </div>
      <div className="p-4">
        <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm overflow-x-auto">
          <pre className="text-[#c9d1d9] whitespace-pre-wrap">
            {getFileContent()}
          </pre>
        </div>
      </div>
    </div>;
}