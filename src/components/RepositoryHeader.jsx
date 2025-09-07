// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Star, GitBranch, Heart } from 'lucide-react';

export function RepositoryHeader({
  repository,
  onStar,
  onNavigateBack
}) {
  return <div className="bg-[#0d1117] border-b border-[#30363d]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={onNavigateBack} className="text-[#58a6ff] hover:text-[#79c0ff] text-sm mb-2 transition-colors">
              ← 返回仓库列表
            </button>
            <h1 className="text-2xl font-semibold text-white">{repository.name}</h1>
            <p className="text-[#8b949e] mt-1">{repository.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[#8b949e]">
              <GitBranch className="h-4 w-4" />
              <span>{repository.forks}</span>
            </div>
            <div className="flex items-center space-x-2 text-[#8b949e]">
              <Star className="h-4 w-4" />
              <span>{repository.stars}</span>
            </div>
            <Button variant="outline" className="border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d]">
              <Star className="h-4 w-4 mr-2" />
              Star
            </Button>
            <Button variant="ghost" className={`${repository.isFavorite ? 'text-yellow-400 hover:text-yellow-300' : 'text-[#8b949e] hover:text-white'} transition-all duration-200 hover:scale-110`} onClick={onStar}>
              <Heart className={`h-4 w-4 ${repository.isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-6">
          <span className="text-sm text-[#8b949e]">Last updated {repository.lastUpdated}</span>
          <span className="text-sm text-[#8b949e]">MIT License</span>
        </div>
      </div>
    </div>;
}