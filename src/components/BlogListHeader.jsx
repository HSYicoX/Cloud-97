// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { RefreshCw } from 'lucide-react';

// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
export function BlogListHeader({
  title,
  subtitle,
  onRefresh,
  isLoading,
  lastRefreshTime
}) {
  const formatTime = date => {
    if (!date) return '未知时间';
    return new Date(date).toLocaleString('zh-CN');
  };
  return <div className="flex items-center justify-between mb-8">
      <div className="text-center flex-1">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
          {title}
        </h1>
        <p className="text-slate-400 text-lg">
          {subtitle}
        </p>
      </div>
      <RippleEffect>
        <Button onClick={onRefresh} disabled={isLoading} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </RippleEffect>
    </div>;
}