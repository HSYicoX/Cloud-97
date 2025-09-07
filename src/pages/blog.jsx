// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Avatar, AvatarFallback, AvatarImage, useToast } from '@/components/ui';
// @ts-ignore;
import { Heart, MessageSquare, Share, Bookmark, Clock, User, Calendar, ArrowLeft, Copy, ThumbsUp } from 'lucide-react';

export default function BlogDetailPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [blog, setBlog] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // 从URL参数获取博客ID
  const blogId = $w.page.dataset.params?.id || '1';

  // 模拟评论数据
  const mockComments = [{
    id: 1,
    user: {
      name: '前端开发者',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a极1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    content: '非常详细的解析，对理解React 18很有帮助！',
    createdAt: '2小时前',
    likes: 5
  }, {
    id: 2,
    user: {
      name: 'React爱好者',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    content: '并发渲染的概念解释得很清楚，期待在实际项目中使用。',
    createdAt: '5小时前',
    likes: 3
  }];

  // 加载博客数据
  useEffect(() => {
    loadBlogData();
  }, [blogId]);
  const loadBlogData = async () => {
    try {
      setIsLoading(true);

      // 获取当前博客文章
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
      }

      // 获取相关文章
      const relatedResult = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $neq: blogId
                }
              }, {
                category: blogResult?.category ? {
                  $eq: blogResult.category
                } : {}
              }]
            }
          },
          select: {
            $master: true
          },
          pageSize: 3,
          pageNumber: 1,
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      if (relatedResult?.records) {
        setRelatedArticles(relatedResult.records.slice(0, 3));
      }

      // 加载评论
      setComments(mockComments);
    } catch (error) {
      console.error('加载博客数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载博客内容，请稍后重试',
        variant: 'destructive'
      });

      // 加载失败时使用默认数据
      setBlog({
        _id: blogId,
        title: 'React 18新特性深度解析',
        content: `# React 18新特性深度解析\n\n文章加载中...`,
        author: {
          name: 'Haokir',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: '前端开发工程师，React爱好者'
        },
        createdAt: '2024-01-15',
        readTime: '8 min read',
        likes: 42,
        tags: ['React', '前端开发', 'JavaScript'],
        category: '前端开发',
        isFavorite: false,
        favoriteCount: 42
      });
      setRelatedArticles([{
        _id: '2',
        title: 'TypeScript高级类型技巧',
        excerpt: '掌握TypeScript的条件类型、映射类型和模板字面量类型',
        readTime: '12 min read',
        date: '2024-01-10'
      }, {
        _id: '3',
        title: '现代CSS布局实战',
        excerpt: '使用Grid和Flexbox构建响应式布局的最佳实践',
        readTime: '6 min read',
        date: '2024-01-05'
      }, {
        _id: '4',
        title: 'Vue 3组合式API深入解析',
        excerpt: '深入学习Vue 3的组合式API和响应式系统',
        readTime: '10 min read',
        date: '2024-01-02'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
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
      const comment = {
        id: Date.now(),
        user: {
          name: '当前用户',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
        },
        content: newComment,
        createdAt: '刚刚',
        likes: 0
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
        description: '评论发布失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  const handleFavorite = async () => {
    try {
      if (!blog) return;
      const newFavoriteState = !isFavorite;
      const newFavoriteCount = newFavoriteState ? favoriteCount + 1 : favoriteCount - 1;

      // 立即更新UI
      setIsFavorite(newFavoriteState);
      setFavoriteCount(newFavoriteCount);

      // 更新数据库
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
      toast({
        title: newFavoriteState ? '已收藏' : '已取消收藏',
        description: newFavoriteState ? '文章已添加到收藏' : '文章已从收藏中移除'
      });
    } catch (error) {
      console.error('更新收藏状态失败:', error);
      // 回滚UI状态
      setIsFavorite(!newFavoriteState);
      setFavoriteCount(favoriteCount);
      toast({
        title: '操作失败',
        description: '收藏状态更新失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const copyCode = code => {
    navigator.clipboard.writeText(code);
    toast({
      title: '已复制',
      description: '代码已复制到剪贴板'
    });
  };
  const shareArticle = platform => {
    const url = window.location.href;
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog?.title || '')}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };
  const renderMarkdown = text => {
    if (!text) return '';
    return text.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-white">$1</h1>').replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-white">$1</h2>').replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-white">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic">$1</em>').replace(/`(.*?)`/g, '<code class="bg-slate-700 px-2 py-1 rounded text-sm font-mono">$1</code>').replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto my-6" />').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>').replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>').replace(/\n/g, '<br/>');
  };
  const renderCodeBlocks = html => {
    const codeBlockRegex = /<pre>(.*?)<\/pre>/gs;
    return html.replace(codeBlockRegex, (match, code) => {
      const language = code.includes('import') ? 'javascript' : 'bash';
      return `<div class="relative group">
        <pre class="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm font-mono text-slate-200">${code}</pre>
        <button onclick="this.parentElement.querySelector('pre').textContent && copyCode(this.parentElement.querySelector('pre').textContent)" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 p-2 rounded">
          <Copy className="h-4 w-4" />
        </button>
      </div>`;
    });
  };
  const handleNavigateToRelated = articleId => {
    $w.utils.navigateTo({
      pageId: 'blog',
      params: {
        id: articleId
      }
    });
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (!blog) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">文章未找到</h2>
          <Button onClick={() => $w.utils.navigateBack()}>
            返回首页
          </Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="text-slate-300 hover:text-white" onClick={() => $w.utils.navigateBack()}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className={`${isFavorite ? 'text-red-400 hover:text-red-300' : 'text-slate-300 hover:text-white'} transition-all duration-200 hover:scale-110`} onClick={handleFavorite}>
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
                {favoriteCount}
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Article Header */}
        <article className="mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full mb-6">
              <div className="w-2 h-2 bg-blue-极400 rounded-full animate-pulse mr-2"></div>
              <span className="text-blue-300 text-sm">{blog.category}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              {blog.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {blog.author?.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {blog.createdAt}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {blog.readTime}
              </div>
              <div className="flex items-center">
                <Heart className={`h-4 w-4 mr-1 ${isFavorite ? 'fill-current text-red-400' : 'text-slate-400'}`} />
                {favoriteCount}
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {blog.tags?.map(tag => <span key={tag} className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full text-sm">
                  #{tag}
                </span>)}
            </div>
          </div>

          {/* Author Info */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={blog.author?.avatar} alt={blog.author?.name} />
                  <AvatarFallback>{blog.author?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{blog.author?.name}</h3>
                  <p className="text-slate-400 text-sm">{blog.author?.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{
            __html: renderCodeBlocks(renderMarkdown(blog.content))
          }} />
          </div>
        </article>

        {/* Share Buttons */}
        <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-lg">分享文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => shareArticle('twitter')}>
                Twitter
              </Button>
              <Button variant="outline" className="border-slate-600 text极-slate-300 hover:bg-slate-700" onClick={() => shareArticle('facebook')}>
                Facebook
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => shareArticle('linkedin')}>
                LinkedIn
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                复制链接
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              评论 ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <Textarea placeholder="写下你的评论..." value={newComment} onChange={e => setNewComment(e.target.value)} className="bg-slate-700/50 border-slate-600 text-white mb-4" rows={4} disabled={isSubmittingComment} />
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmittingComment} isLoading={isSubmittingComment}>
                发布评论
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => <div key={comment.id} className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-start mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                      <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{comment.user.name}</h4>
                      <p className="text-slate-400 text-sm">{comment.createdAt}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {comment.likes}
                    </Button>
                  </div>
                  <p className="text-slate-200">{comment.content}</p>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Related Articles */}
        <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg">相关文章</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map(article => <Card key={article._id} className="bg-slate-700/30 border-slate-600 hover:border-blue-500/30 transition-all duration-300 cursor-pointer" onClick={() => handleNavigateToRelated(article._id)}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}