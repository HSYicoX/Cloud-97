// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast, Badge } from '@/components/ui';
// @ts-ignore;
import { Heart, MessageSquare, Eye, Calendar, Clock, Search, Filter, ArrowUpDown, BookOpen, TrendingUp, Star, X, Tag, Hash } from 'lucide-react';

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

  // 加载博客列表
  const loadBlogs = async (pageNum = 1, append = false) => {
    try {
      setIsLoading(true);
      setLoadingStatus('loading');
      setLoadingMessage('正在加载博客文章...');
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                isPublished: {
                  $eq: true
                }
              }]
            }
          },
          select: {
            $master: true
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
        if (append) {
          setBlogs(prev => [...prev, ...result.records]);
        } else {
          setBlogs(result.records);
        }
        setFilteredBlogs(result.records);
        setHasMore(result.records.length === 12);

        // 提取分类和标签
        const uniqueCategories = [...new Set(result.records.map(blog => blog.category).filter(Boolean))];
        setCategories(uniqueCategories);

        // 提取所有标签
        const allTags = result.records.reduce((acc, blog) => {
          if (blog.tags && Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
              if (!acc.includes(tag)) {
                acc.push(tag);
              }
            });
          }
          return acc;
        }, []);
        setAllTags(allTags);
        setLoadingStatus('success');
        setLoadingMessage('博客加载完成');
      } else {
        setLoadingStatus('error');
        setLoadingMessage('没有找到博客文章');
      }
    } catch (error) {
      console.error('加载博客失败:', error);
      setLoadingStatus('error');
      setLoadingMessage('加载失败，请刷新重试');
      toast({
        title: '加载失败',
        description: '无法加载博客列表',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 过滤和搜索博客
  const filterBlogs = () => {
    let filtered = blogs;

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(blog => blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) || blog.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) || blog.category?.toLowerCase().includes(searchQuery.toLowerCase()));
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
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
              技术博客
            </h1>
            <p className="text-slate-400 text-lg">
              分享前端开发、React、TypeScript等技术文章
            </p>
          </div>

          {/* 搜索和过滤区域 */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* 搜索框 */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input placeholder="搜索文章标题、标签或分类..." value={searchQuery} onChange={handleSearch} className="pl-10 bg-slate-700/50 border-slate-600 text-white" />
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
                  </div>
                  {selectedTags.length > 0 && <RippleEffect>
                      <Button variant="ghost" size="sm" onClick={handleClearTags} className="text-slate-400 hover:text-slate-300 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        清除
                      </Button>
                    </RippleEffect>}
                </div>

                {/* 标签列表 */}
                <div className="flex flex-wrap gap-2">
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
                </div>

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
          {loadingStatus === 'error' ? <FormStatus status="error" message={loadingMessage} /> : filteredBlogs.length === 0 ? <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">没有找到文章</h3>
              <p className="text-slate-400">尝试调整搜索条件或分类筛选</p>
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