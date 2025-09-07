// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Eye, Heart, Star } from 'lucide-react';

export function BlogStats({
  blogs
}) {
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.viewCount || 0), 0);
  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
  const totalFavorites = blogs.reduce((sum, blog) => sum + (blog.favoriteCount || 0), 0);
  return <div className="flex items-center space-x-4 text-sm text-slate-400">
      <span className="flex items-center">
        <Eye className="h-4 w-4 mr-1" />
        {totalViews} 阅读
      </span>
      <span className="flex items-center">
        <Heart className="h-4 w-4 mr-1" />
        {totalLikes} 点赞
      </span>
      <span className="flex items-center">
        <Star className="h-4 w-4 mr-1" />
        {totalFavorites} 收藏
      </span>
    </div>;
}