// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
// @ts-ignore;
import { Heart, MessageSquare, Eye, Calendar, Clock, Star } from 'lucide-react';

// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
export default function BlogCard({
  blog,
  onNavigate
}) {
  const formatDate = timestamp => {
    if (!timestamp) return '未知时间';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      return '无效日期';
    }
  };
  const handleCardClick = () => {
    onNavigate(blog._id);
  };
  return <RippleEffect>
      <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 cursor-pointer group hover-lift click-scale" onClick={handleCardClick}>
        {/* 封面图片 */}
        {blog.coverImage && <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 backdrop-blur-sm">
                {blog.category}
              </Badge>
            </div>
          </div>}

        <CardContent className="p-6">
          {/* 标题 */}
          <h3 className="font-semibold text-white text-lg mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
            {blog.title}
          </h3>

          {/* 摘要 */}
          {blog.excerpt && <p className="text-slate-400 text-sm mb-4 line-clamp-3">
              {blog.excerpt}
            </p>}

          {/* 标签 */}
          {blog.tags && blog.tags.length > 0 && <div className="flex flex-wrap gap-1 mb-4">
              {blog.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline" className="bg-slate-700/50 text-slate-300 text-xs">
                  #{tag}
                </Badge>)}
              {blog.tags.length > 3 && <Badge variant="outline" className="bg-slate-700/50 text-slate-300 text-xs">
                  +{blog.tags.length - 3}
                </Badge>}
            </div>}

          {/* 统计信息 */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              {/* 阅读数 */}
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                {blog.viewCount || 0}
              </div>

              {/* 点赞数 */}
              <div className="flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                {blog.likes || 0}
              </div>

              {/* 收藏数 */}
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-1" />
                {blog.favoriteCount || 0}
              </div>
            </div>

            {/* 日期和时间 */}
            <div className="flex items-center space-x-2">
              {blog.createdAt && <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(blog.createdAt)}
                </div>}
              {blog.readTime && <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {blog.readTime}
                </div>}
            </div>
          </div>
        </CardContent>
      </Card>
    </RippleEffect>;
}