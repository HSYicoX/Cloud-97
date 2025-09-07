// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';

export function FileTree({
  items,
  expandedFolders,
  onToggleFolder,
  onSelectFile,
  selectedFile,
  level = 0
}) {
  return items.map((item, index) => <div key={index} className={`pl-${level * 4}`}>
      {item.type === 'folder' ? <div>
          <div className="flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer" onClick={() => onToggleFolder(item.name)}>
            {expandedFolders.includes(item.name) ? <ChevronDown className="h-4 w-4 mr-1 text-gray-400" /> : <ChevronRight className="h-4 w-4 mr-1 text-gray-400" />}
            <Folder className="h-4 w-4 mr-2 text-blue-400" />
            <span className="text-sm text-gray-300">{item.name}</span>
          </div>
          {expandedFolders.includes(item.name) && item.children && <div className="ml-4">
              <FileTree items={item.children} expandedFolders={expandedFolders} onToggleFolder={onToggleFolder} onSelectFile={onSelectFile} selectedFile={selectedFile} level={level + 1} />
            </div>}
        </div> : <div className={`flex items-center py-1 px-2 hover:bg-gray-800 rounded cursor-pointer ${selectedFile === item.name ? 'bg-gray-800' : ''}`} onClick={() => onSelectFile(item.name)}>
          <FileText className="h-4 w-4 mr-2 text-green-400" />
          <span className="text-sm text-gray-300">{item.name}</span>
          <span className="ml-auto text-xs text-gray-500">{item.size}</span>
        </div>}
    </div>);
}