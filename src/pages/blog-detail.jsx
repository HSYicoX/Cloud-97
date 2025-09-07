// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Avatar, AvatarFallback, AvatarImage, useToast, Badge } from '@/components/ui';
// @ts-ignore;
import { Heart, MessageSquare, Share, Bookmark, Clock, User, Calendar, ArrowLeft, Copy, ThumbsUp, Eye, Star } from 'lucide-react';

// @ts-ignore;
import { Navigation } from '@/components/Navigation';
// @ts-ignore;
import { MouseEffects } from '@/components/MouseEffects';
// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
// @ts-ignore;
import { LoadingSpinner } from '@/components/LoadingSpinner';
// @ts-ignore;
import { FormStatus } from '@/components/FormStatus';
export default function BlogDetailPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);

  // 从URL参数获取博客ID
  const blogId = $w.page.dataset.params?.id;

  // 加载博客详情
  useEffect(() => {
    if (blogId) {
      loadBlogDetail();
    }
  }, [blogId]);
  const loadBlogDetail = async () => {
    try {
      setIsLoading(true);

      // 获取博客详情
      const blogResult = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: blogId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (blogResult) {
        setBlog(blogResult);
        setIsFavorite(blogResult.isFavorite || false);
        setFavoriteCount(blogResult.favoriteCount || 0);
        setViewCount(blogResult.viewCount || 0);
        setLikeCount(blogResult.likes || 0);

        // 更新阅读数
        await updateViewCount();
      }

      // 加载评论（这里需要根据实际情况实现评论数据模型）
      // setComments([]);
    } catch (error) {
      console.error('加载博客详情失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载博客内容',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 更新阅读数
  const updateViewCount = async () => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            viewCount: (viewCount || 0) + 1
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: blogId
                }
              }]
            }
          }
        }
      });
      setViewCount(prev => prev + 1);
    } catch (error) {
      console.error('更新阅读数失败:', error);
    }
  };

  // 点赞文章
  const handleLike = async () => {
    try {
      setIsLiking(true);
      const newLikeCount = likeCount + 1;
      await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            likes: newLikeCount
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: blogId
                }
              }]
            }
          }
        }
      });
      setLikeCount(newLikeCount);
      toast({
        title: '已点赞',
        description: '感谢你的点赞！'
      });
    } catch (error) {
      console.error('点赞失败:', error);
      toast({
        title: '点赞失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLiking(false);
    }
  };

  // 收藏文章
  const handleFavorite = async () => {
    try {
      setIsFavoriting(true);
      const newFavoriteState = !isFavorite;
      const newFavoriteCount = newFavoriteState ? favoriteCount + 1 : favoriteCount - 1;
      await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            isFavorite: newFavoriteState,
            favoriteCount: newFavoriteCount
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: blogId
                }
              }]
            }
          }
        }
      });
      setIsFavorite(newFavoriteState);
      setFavoriteCount(newFavoriteCount);
      toast({
        title: newFavoriteState ? '已收藏' : '已取消收藏',
        description: newFavoriteState ? '文章已添加到收藏' : '文章已从收藏中移除'
      });
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast({
        title: '操作失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsFavoriting(false);
    }
  };

  // 提交评论
  const handleCommentSubmit = async e => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({
        title: '错误',
        description: '请输入评论内容',
        variant: 'destructive'
      });
      return;
    }
    setIsSubmittingComment(true);
    try {
      // 这里需要实现评论提交到数据模型
      const comment = {
        id: Date.now(),
        content: newComment,
        createdAt: new Date().toISOString(),
        user: $w.auth.currentUser
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast({
        title: '成功',
        description: '评论已发布'
      });
    } catch (error) {
      toast({
        title: '发布失败',
        description: '评论发布失败',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 渲染Markdown内容
  const renderMarkdown = text => {
    if (!text) return '';
    return text.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-white">$1</h1>').replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-white">$1</h2>').replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-white">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic">$1</em>').replace(/`(.*?)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-sm font-mono">$1</code>').replace(/\n/g, '<br/>');
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" text="加载文章中..." />
      </div>;
  }
  if (!blog) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <FormStatus status="error" message="文章未找到" />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <Navigation $w={$w} currentPage="blog-detail" />
      
      <div className="container mx-auto px-6 py-8 pt-20 max-w-4xl">
        {/* 返回按钮 */}
        <RippleEffect>
          <Button variant="ghost" className="text-slate-300 hover:text-white mb-6" onClick={() => $w.utils.navigateBack()}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            返回列表
          </Button>
        </RippleEffect>

        {/* 文章内容 */}
        <article className="mb-12">
          {/* 文章头部 */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 mb-4">
              {blog.category}
            </Badge>
            
            <h1 className="text-4xl font-bold mb-6 text-white">
              {blog.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {blog.author?.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {blog.readTime}
              </div>
            </div>

            {/* 统计信息 */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center text-slate-400">
                <Eye className="h-4 w-4 mr-1" />
                {viewCount} 阅读
              </div>
              <div className="flex items-center text-slate-400">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {likeCount} 点赞
              </div>
              <div className="flex items-center text-slate-400">
                <Star className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current text-yellow-400' : ''}`} />
                {favoriteCount} 收藏
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-center gap-4">
              <RippleEffect>
                <Button variant="outline" onClick={handleLike} disabled={isLiking} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  点赞
                </Button>
              </RippleEffect>
              <RippleEffect>
                <Button variant="outline" onClick={handleFavorite} disabled={isFavoriting} className={`border-slate-600 ${isFavorite ? 'text-yellow-400 border-yellow-400/30' : 'text-slate-300'} hover:bg-slate-700`}>
                  <Star className="h-4 w-4 mr-2" />
                  {isFavorite ? '已收藏' : '收藏'}
                </Button>
              </RippleEffect>
              <RippleEffect>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Share className="h-4 w-4 mr-2" />
                  分享
                </Button>
              </RippleEffect>
            </div>
          </div>

          {/* 文章内容 */}
          <div className="prose prose-invert prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{
            __html: renderMarkdown(blog.content)
          }} />
          </div>
        </article>

        {/* 评论区域 */}
        <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              评论 ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea placeholder="写下你的评论..." value={newComment} onChange={e => setNewComment(e.target.value)} className="bg-slate-700/50 border-slate-600 text-white mb-4" rows={4} disabled={isSubmittingComment} />
              <Button type="submit" disabled={isSubmittingComment}>
                {isSubmittingComment ? '发布中...' : '发布评论'}
              </Button>
            </form>

            {/* 评论列表 */}
            <div className="space-y-4">
              {comments.map(comment => <div key={comment.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-start mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={comment.user?.avatarUrl} alt={comment.user?.name} />
                      <AvatarFallback>{comment.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-white">{comment.user?.name}</h4>
                      <p className="text-slate-400 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-slate-200">{comment.content}</p>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}