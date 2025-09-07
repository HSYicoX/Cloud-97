// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';
// @ts-ignore;
import { TrendingUp, RefreshCw } from 'lucide-react';

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
// @ts-ignore;
import { BlogFilterPanel } from '@/components/BlogFilterPanel';
// @ts-ignore;
import { BlogStats } from '@/components/BlogStats';
// @ts-ignore;
import { BlogListHeader } from '@/components/BlogListHeader';
// @ts-ignore;
import { EmptyBlogState } from '@/components/EmptyBlogState';
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

      // 构建查询条件 - 只查询已发布的文章
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
            publishedAt: true,
            author: true,
            status: true,
            isPublished: true
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

  // 处理排序
  const handleSortChange = value => {
    setSortBy(value);
  };

  // 切换标签显示
  const handleToggleTagFilter = () => {
    setShowTagFilter(!showTagFilter);
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

  // 跳转到编辑器
  const handleCreateArticle = () => {
    $w.utils.navigateTo({
      pageId: 'editor',
      params: {
        new: 'true'
      }
    });
  };

  // 格式化时间
  const formatTime = date => {
    if (!date) return '未知时间';
    return new Date(date).toLocaleString('zh-CN');
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
          {/* 页面标题和刷新按钮 */}
          <BlogListHeader title="技术博客" subtitle="分享前端开发、React、TypeScript等技术文章" onRefresh={handleRefresh} isLoading={isLoading} lastRefreshTime={lastRefreshTime} />

          {/* 最后刷新时间 */}
          {lastRefreshTime && <div className="text-center mb-6">
              <p className="text-slate-500 text-sm">
                最后更新: {formatTime(lastRefreshTime)}
              </p>
            </div>}

          {/* 搜索和过滤区域 */}
          <BlogFilterPanel searchQuery={searchQuery} onSearchChange={handleSearch} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} categories={categories} sortBy={sortBy} onSortChange={handleSortChange} allTags={allTags} selectedTags={selectedTags} onTagToggle={handleTagToggle} onClearTags={handleClearTags} showTagFilter={showTagFilter} onToggleTagFilter={handleToggleTagFilter} />

          {/* 博客列表 */}
          {loadingStatus === 'error' ? <FormStatus status="error" message={loadingMessage} action={<RippleEffect>
                  <Button onClick={handleRefresh} variant="default">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重试
                  </Button>
                </RippleEffect>} /> : filteredBlogs.length === 0 ? <EmptyBlogState hasBlogs={blogs.length > 0} searchQuery={searchQuery} selectedCategory={selectedCategory} selectedTags={selectedTags} onCreateArticle={handleCreateArticle} /> : <>
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
                <BlogStats blogs={filteredBlogs} />
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