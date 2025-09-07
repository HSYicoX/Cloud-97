// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast, Badge } from '@/components/ui';
// @ts-ignore;
import { Heart, MessageSquare, Eye, Calendar, Clock, Search, Filter, ArrowUpDown, BookOpen, TrendingUp, Star, X, Tag, Hash, RefreshCw } from 'lucide-react';

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
// @ts-ignore;
import { BlogCard } from '@/components/BlogCard';
export default function BlogListPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [loadingMessage, setLoadingMessage] = useState('正在加载博客...');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // 加载博客列表
  const loadBlogs = async (pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      setLoadingStatus('loading');
      setLoadingMessage('正在加载博客文章...');

      // 构建查询条件
      const filterConditions = {
        $and: [{
          isPublished: {
            $eq: true
          }
        }]
      };
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: filterConditions
          },
          select: {
            $master: true,
            title: true,
            content: true,
            excerpt: true,
            category: true,
            tags: true,
            coverImage: true,
            viewCount: true,
            likes: true,
            favoriteCount: true,
            readTime: true,
            createdAt: true,
            updatedAt: true,
            author: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 12,
          pageNumber: pageNum,
          getCount: true
        }
      });
      if (result && result.records) {
        console.log('加载博客成功:', result.records.length, '条记录');
        if (append) {
          setBlogs(prev => [...prev, ...result.records]);
        } else {
          setBlogs(result.records);
        }
        setFilteredBlogs(result.records);
        setHasMore(result.records.length === 12);
        setLastRefreshTime(new Date());

        // 提取分类
        const uniqueCategories = [...new Set(result.records.map(blog => blog.category).filter(category => category && category.trim() !== ''))];
        setCategories(uniqueCategories);

        // 提取所有标签
        const allTags = result.records.reduce((acc, blog) => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
              if (tag && tag.trim() !== '' && !acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        setAllTags(allTags);
        setLoadingStatus('success');
        setLoadingMessage(`加载完成，共 ${result.records.length} 篇文章`);
        toast({
          title: '加载成功',
          description: `已加载 ${result.records.length} 篇博客文章`,
          variant: 'default'
        });
      } else {
        console.log('没有找到博客文章');
        setLoadingStatus('empty');
        setLoadingMessage('暂无博客文章');
        setBlogs([]);
        setFilteredBlogs([]);
        toast({
          title: '提示',
          description: '目前还没有发布的博客文章',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('加载博客失败:', error);
      setLoadingStatus('error');
      setLoadingMessage('加载失败，请刷新重试');
      toast({
        title: '加载失败',
        description: error.message || '无法加载博客列表',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    setPage(1);
    loadBlogs(1, false);
  };

  // 过滤和搜索博客
  const filterBlogs = () => {
    let filtered = blogs;

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(blog => blog.title && blog.title.toLowerCase().includes(query) || blog.excerpt && blog.excerpt.toLowerCase().includes(query) || blog.tags && blog.tags.some(tag => tag && tag.toLowerCase().includes(query)) || blog.category && blog.category.toLowerCase().includes(query) || blog.content && blog.content.toLowerCase().includes(query));
    }

    // 分类过滤
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => blog.tags && blog.tags.some(tag => selectedTags.includes(tag)));
    }

    // 排序
    switch (sortBy) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'mostViews':
        filtered = [...filtered].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case 'mostLikes':
        filtered = [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'mostFavorites':
        filtered = [...filtered].sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
        break;
      default:
        break;
    }
    setFilteredBlogs(filtered);
  };

  // 处理搜索
  const handleSearch = e => {
    setSearchQuery(e.target.value);
  };

  // 处理分类选择
  const handleCategoryChange = value => {
    setSelectedCategory(value);
  };

  // 处理标签选择
  const handleTagToggle = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // 清除所有标签
  const handleClearTags = () => {
    setSelectedTags([]);
  };

  // 清除搜索
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // 处理排序
  const handleSortChange = value => {
    setSortBy(value);
  };

  // 加载更多
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadBlogs(nextPage, true);
  };

  // 跳转到文章详情
  const handleNavigateToBlog = blogId => {
    $w.utils.navigateTo({
      pageId: 'blog-detail',
      params: {
        id: blogId
      }
    });
  };

  // 初始化加载
  useEffect(() => {
    loadBlogs();
  }, []);

  // 过滤和排序
  useEffect(() => {
    filterBlogs();
  }, [searchQuery, selectedCategory, selectedTags, sortBy, blogs]);

  // 格式化时间
  const formatTime = date => {
    if (!date) return '未知时间';
    return new Date(date).toLocaleString('zh-CN');
  };
  if (isLoading && blogs.length === 0) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <LoadingSpinner size="xl" text={loadingMessage} />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="blog" />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题和刷新按钮 */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
                技术博客
              </h1>
              <p className="text-slate-400 text-lg">
                分享前端开发、React、TypeScript等技术文章
              </p>
            </div>
            <RippleEffect>
              <Button onClick={handleRefresh} disabled={isLoading} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white" size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </RippleEffect>
          </div>

          {/* 最后刷新时间 */}
          {lastRefreshTime && <div className="text-center mb-6">
              <p className="text-slate-500 text-sm">
                最后更新: {formatTime(lastRefreshTime)}
              </p>
            </div>}

          {/* 搜索和过滤区域 */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* 搜索框 */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="搜索文章标题、标签、分类或内容..." value={searchQuery} onChange={handleSearch} className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white" />
                    {searchQuery && <button onClick={handleClearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300">
                        <X className="h-4 w-4" />
                      </button>}
                  </div>
                </div>

                {/* 分类筛选 */}
                <div>
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="所有分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有分类</SelectItem>
                      {categories.map(category => <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* 排序 */}
                <div>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">最新发布</SelectItem>
                      <SelectItem value="oldest">最早发布</SelectItem>
                      <SelectItem value="mostViews">最多阅读</SelectItem>
                      <SelectItem value="mostLikes">最多点赞</SelectItem>
                      <SelectItem value="mostFavorites">最多收藏</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 标签筛选区域 */}
              <div className="border-t border-slate-700/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-slate-400" />
                    <span className="text-sm font-medium text-slate-300">标签筛选</span>
                    <span className="text-slate-500 text-sm ml-2">({allTags.length} 个标签)</span>
                  </div>
                  {selectedTags.length > 0 && <RippleEffect>
                      <Button variant="ghost" size="sm" onClick={handleClearTags} className="text-slate-400 hover:text-slate-300 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        清除
                      </Button>
                    </RippleEffect>}
                </div>

                {/* 标签列表 */}
                {allTags.length > 0 ? <div className="flex flex-wrap gap-2">
                    {allTags.slice(0, showTagFilter ? allTags.length : 8).map(tag => <RippleEffect key={tag}>
                        <Badge variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer transition-all hover-lift click-scale ${selectedTags.includes(tag) ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50'}`} onClick={() => handleTagToggle(tag)}>
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      </RippleEffect>)}
                    
                    {allTags.length > 8 && <RippleEffect>
                        <Badge variant="outline" className="cursor-pointer bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50" onClick={() => setShowTagFilter(!showTagFilter)}>
                          {showTagFilter ? '收起' : `查看更多 (${allTags.length - 8})`}
                        </Badge>
                      </RippleEffect>}
                  </div> : <p className="text-slate-500 text-sm">暂无标签</p>}

                {/* 已选标签提示 */}
                {selectedTags.length > 0 && <div className="mt-3">
                    <span className="text-sm text-slate-400 mr-2">已选标签:</span>
                    {selectedTags.map(tag => <Badge key={tag} variant="default" className="bg-blue-500/20 text-blue-300 mr-2 mb-2 inline-flex items-center">
                        {tag}
                        <button onClick={() => handleTagToggle(tag)} className="ml-1 hover:text-blue-200">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>)}
                  </div>}
              </div>
            </CardContent>
          </Card>

          {/* 博客列表 */}
          {loadingStatus === 'error' ? <FormStatus status="error" message={loadingMessage} action={<RippleEffect>
                  <Button onClick={handleRefresh} variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重试
                  </Button>
                </RippleEffect>} /> : filteredBlogs.length === 0 ? <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {blogs.length === 0 ? '暂无博客文章' : '没有找到匹配的文章'}
              </h3>
              <p className="text-slate-400 mb-6">
                {blogs.length === 0 ? '还没有发布的博客文章，去创建一篇吧！' : '尝试调整搜索条件或分类筛选'}
              </p>
              {blogs.length === 0 && <RippleEffect>
                  <Button onClick={() => $w.utils.navigateTo({
              pageId: 'editor'
            })} variant="default">
                    创建文章
                  </Button>
                </RippleEffect>}
            </div> : <>
              {/* 博客统计 */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-slate-400">
                  共找到 <span className="text-white font-semibold">{filteredBlogs.length}</span> 篇文章
                  {selectedCategory !== 'all' && <span className="ml-2">
                      (分类: <span className="text-blue-300">{selectedCategory}</span>)
                    </span>}
                  {selectedTags.length > 0 && <span className="ml-2">
                      (标签: <span className="text-blue-300">{selectedTags.join(', ')}</span>)
                    </span>}
                  {searchQuery && <span className="ml-2">
                      (搜索: <span className="text-blue-300">"{searchQuery}"</span>)
                    </span>}
                </p>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {filteredBlogs.reduce((sum, blog) => sum + (blog.viewCount || 0), 0)} 阅读
                  </span>
                  <span className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {filteredBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)} 点赞
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {filteredBlogs.reduce((sum, blog) => sum + (blog.favoriteCount || 0), 0)} 收藏
                  </span>
                </div>
              </div>

              {/* 博客网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredBlogs.map(blog => <BlogCard key={blog._id} blog={blog} onNavigate={() => handleNavigateToBlog(blog._id)} />)}
              </div>

              {/* 加载更多 */}
              {hasMore && <div className="text-center">
                  <RippleEffect>
                    <Button onClick={loadMore} disabled={isLoading} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                      {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
                      加载更多
                    </Button>
                  </RippleEffect>
                </div>}
            </>}
        </div>
      </div>
    </div>;
}