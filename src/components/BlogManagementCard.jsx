// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
// @ts-ignore;
import { Eye, Heart, Calendar, Edit, Trash2, Plus } from 'lucide-react';

export function BlogManagementCard({
  blogPosts,
  onEdit,
  onDelete,
  onCreate
}) {
  const getStatusColor = status => {
    switch (status) {
      case 'published':
        return 'text-green-400';
      case 'draft':
        return 'text-yellow-400';
      default:
        return 'text-slate-400';
    }
  };
  const getStatusText = status => {
    switch (status) {
      case 'published':
        return '已发布';
      case 'draft':
        return '草稿';
      default:
        return status;
    }
  };
  return <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">博客管理</CardTitle>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600" onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          新建文章
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {blogPosts.map(post => <div key={post.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{post.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className={getStatusColor(post.status)}>{getStatusText(post.status)}</span>
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-blue-400" onClick={() => onEdit(post.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-400" onClick={() => onDelete(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 rounded-full">
                  {post.category}
                </span>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}