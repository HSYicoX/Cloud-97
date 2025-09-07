// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { BookOpen } from 'lucide-react';

// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
export function EmptyBlogState({
  hasBlogs,
  searchQuery,
  selectedCategory,
  selectedTags,
  onCreateArticle
}) {
  const getMessage = () => {
    if (!hasBlogs) {
      return '还没有发布的博客文章，去创建一篇吧！';
    }
    if (searchQuery) {
      return `没有找到包含"${searchQuery}"的文章，尝试调整搜索关键词`;
    }
    if (selectedCategory !== 'all') {
      return `没有找到"${selectedCategory}"分类的文章，尝试选择其他分类`;
    }
    if (selectedTags.length > 0) {
      return `没有找到包含"${selectedTags.join(', ')}"标签的文章，尝试选择其他标签`;
    }
    return '没有找到匹配的文章，尝试调整筛选条件';
  };
  return <div className="text-center py-16">
      <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-slate-300 mb-2">
        {hasBlogs ? '没有找到匹配的文章' : '暂无博客文章'}
      </h3>
      <p className="text-slate-400 mb-6">
        {getMessage()}
      </p>
      {!hasBlogs && <RippleEffect>
          <Button onClick={onCreateArticle} variant="default">
            创建文章
          </Button>
        </RippleEffect>}
    </div>;
}