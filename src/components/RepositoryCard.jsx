// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { Star, GitBranch, RefreshCw, ExternalLink } from 'lucide-react';

export function RepositoryCard({
  repositories,
  onSync
}) {
  const getLanguageColor = language => {
    switch (language) {
      case 'JavaScript':
        return 'text-yellow-400';
      case 'TypeScript':
        return 'text-blue-400';
      case 'CSS':
        return 'text-purple-400';
      case 'HTML':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };
  return <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">仓库管理</CardTitle>
        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={onSync}>
          <RefreshCw className="h-4 w-4 mr-2" />
          同步仓库
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repositories.map(repo => <div key={repo.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{repo.name}</h4>
                  <p className="text-sm text-slate-400 mb-2">{repo.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className={getLanguageColor(repo.language)}>{repo.language}</span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center">
                      <GitBranch className="h-3 w-3 mr-1" />
                      {repo.forks}
                    </span>
                    <span className="text-xs text-slate-500">更新于 {repo.lastUpdated}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400" onClick={() => window.open(`https://github.com/haokir/${repo.name}`, '_blank')}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}