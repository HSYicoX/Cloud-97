// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle, Button, Avatar, AvatarFallback, AvatarImage, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Mail, Hash, BookOpen, Code, Calendar, Eye, Heart, GitBranch, Star, Clock, MapPin, Link, Edit } from 'lucide-react';

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
export default function ProfilePage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [userRepositories, setUserRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState('loading');
  const [loadingMessage, setLoadingMessage] = useState('正在加载个人资料...');

  // 获取当前用户信息
  const fetchUserData = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser || !currentUser.userId) {
        setLoadingStatus('error');
        setLoadingMessage('用户未登录，请先登录');
        return;
      }

      // 从 users 表获取用户信息
      const userResult = await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: currentUser.userId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (userResult) {
        setUserData(userResult);
      } else {
        // 如果 users 表中没有数据，使用默认信息
        setUserData({
          username: currentUser.name || '匿名用户',
          email: currentUser.email || '',
          avatar: currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: currentUser.bio || '这个人很懒，什么都没有写',
          location: '',
          website: '',
          totalViews: 0,
          totalLikes: 0,
          totalPosts: 0,
          totalFollowers: 0,
          blogCount: 0,
          repositoryCount: 0,
          favoriteCount: 0
        });
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      setLoadingStatus('error');
      setLoadingMessage('获取用户信息失败');
      toast({
        title: '获取失败',
        description: '无法加载用户信息',
        variant: 'destructive'
      });
    }
  };

  // 获取用户博客列表 - 使用正确的查询条件
  const fetchUserBlogs = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser) return;
      
      const blogResult = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                'author._id': {
                  $eq: currentUser.userId
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
          pageSize: 10,
          getCount: true
        }
      });
      if (blogResult && blogResult.records) {
        setUserBlogs(blogResult.records);
        
        // 更新用户博客数量统计
        if (userData) {
          setUserData(prev => ({
            ...prev,
            blogCount: blogResult.total || blogResult.records.length
          }));
        }
      }
    } catch (error) {
      console.error('获取博客列表失败:', error);
      toast({
        title: '获取失败',
        description: '无法加载博客列表',
        variant: 'destructive'
      });
    }
  };

  // 获取用户代码仓库 - 添加用户筛选条件
  const fetchUserRepositories = async () => {
    try {
      const currentUser = $w.auth.currentUser;
      if (!currentUser) return;
      
      // 这里需要根据实际的数据模型结构调整查询条件
      // 假设代码仓库有 owner 或 author 字段来关联用户
      const repoResult = await $w.cloud.callDataSource({
        dataSourceName: 'code_repositories',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                'owner._id': {
                  $eq: currentUser.userId
                }
              }]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            lastUpdated: 'desc'
          }],
          pageSize: 8,
          getCount: true
        }
      });
      if (repoResult && repoResult.records) {
        setUserRepositories(repoResult.records);
        
        // 更新用户仓库数量统计
        if (userData) {
          setUserData(prev => ({
            ...prev,
            repositoryCount: repoResult.total || repoResult.records.length
          }));
        }
      }
    } catch (error) {
      console.error('获取代码仓库失败:', error);
      // 如果查询失败，可能是字段名不匹配，尝试获取所有仓库
      try {
        const fallbackResult = await $w.cloud.callDataSource({
          dataSourceName: 'code_repositories',
          methodName: 'wedaGetRecordsV2',
          params: {
            select: {
              $master: true
            },
            orderBy: [{
              lastUpdated: 'desc'
            }],
            pageSize: 8
          }
        });
        if (fallbackResult && fallbackResult.records) {
          setUserRepositories(fallbackResult.records);
        }
      } catch (fallbackError) {
        console.error('获取代码仓库备用方案失败:', fallbackError);
        toast({
          title: '获取失败',
          description: '无法加载代码仓库',
          variant: 'destructive'
        });
      }
    }
  };

  // 加载所有数据
  const loadProfileData = async () => {
    setIsLoading(true);
    setLoadingStatus('loading');
    setLoadingMessage('正在加载个人资料...');
    try {
      // 先获取用户信息，然后并行获取博客和仓库
      await fetchUserData();
      await Promise.all([fetchUserBlogs(), fetchUserRepositories()]);
      setLoadingStatus('success');
      setLoadingMessage('资料加载完成');
    } catch (error) {
      console.error('加载个人资料失败:', error);
      setLoadingStatus('error');
      setLoadingMessage('加载失败，请刷新重试');
      toast({
        title: '加载失败',
        description: '无法加载个人资料信息',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleEditProfile = () => {
    toast({
      title: '功能开发中',
      description: '个人资料编辑功能即将上线'
    });
  };

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

  const handleNavigateToBlog = blogId => {
    $w.utils.navigateTo({
      pageId: 'blog',
      params: {
        id: blogId
      }
    });
  };

  const handleNavigateToRepository = repoId => {
    $w.utils.navigateTo({
      pageId: 'repository',
      params: {
        id: repoId
      }
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" text={loadingMessage} />
        </div>
      </div>;
  }

  if (loadingStatus === 'error') {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <FormStatus status="error" message={loadingMessage} />
      </div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="profile" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 用户信息卡片 */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark mb-8 animate-fade-in">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* 头像区域 */}
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24 border-4 border-slate-600/50">
                    <AvatarImage src={userData?.avatar} alt={userData?.username} />
                    <AvatarFallback className="bg-slate-700 text-white text-2xl">
                      {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* 用户信息 */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white">{userData?.username}</h1>
                      {userData?.nickname && <p className="text-slate-400 text-lg">({userData.nickname})</p>}
                    </div>
                    <RippleEffect>
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift click-scale" onClick={handleEditProfile}>
                        <Edit className="h-4 w-4 mr-2" />
                        编辑资料
                      </Button>
                    </RippleEffect>
                  </div>

                  <p className="text-slate-300 text-lg leading-relaxed">{userData?.bio}</p>

                  {/* 联系信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userData?.email && <div className="flex items-center text-slate-400">
                        <Mail className="h-5 w-5 mr-3" />
                        <span>{userData.email}</span>
                      </div>}
                    {userData?.orcid && <div className="flex items-center text-slate-400">
                        <Hash className="h-5 w-5 mr-3" />
                        <span>{userData.orcid}</span>
                      </div>}
                    {userData?.location && <div className="flex items-center text-slate-400">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>{userData.location}</span>
                      </div>}
                    {userData?.website && <div className="flex items-center text-slate-400">
                        <Link className="h-5 w-5 mr-3" />
                        <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          {userData.website}
                        </a>
                      </div>}
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="bg-slate-700/50 rounded-lg p-6 min-w-[200px]">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">{userData?.blogCount || userBlogs.length}</div>
                      <div className="text-slate-400 text-sm">博客</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{userData?.repositoryCount || userRepositories.length}</div>
                      <div className="text-slate-400 text-sm">仓库</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{userData?.totalFollowers || 0}</div>
                      <div className="text-slate-400 text-sm">粉丝</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{userData?.favoriteCount || 0}</div>
                      <div className="text-slate-400 text-sm">收藏</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 博客列表 */}
            <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in-up" style={{
            animationDelay: '0.1s'
          }}>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="h-6 w-极6 mr-2" />
                  我的博客
                  <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300">
                    {userBlogs.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <极CardContent>
                {userBlogs.length === 0 ? <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">暂无博客文章</p>
                    <RippleEffect>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700 hover-lift click-scale" onClick={() => $w.utils.navigateTo({
                    pageId: 'editor',
                    params: {
                      new: 'true'
                    }
                  })}>
                        开始写作
                      </Button>
                    </RippleEffect>
                  </div> : <div className="space-y-4">
                    {userBlogs.map(blog => <RippleEffect key={blog._id}>
                        <Card className="bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 cursor-pointer transition-all hover-lift click-scale" onClick={() => handleNavigateToBlog(blog._id)}>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-white text-lg mb-2">{blog.title}</h3>
                            {blog.excerpt && <p className="text-slate-400 text-sm mb-3 line-clamp-2">{blog.excerpt}</p>}
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(blog.createdAt)}
                                </div>
                                {blog.readTime && <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {blog.readTime}
                                  </div>}
                              </div>
                              <div className="flex items-center space-x-3">
                                {blog.likes > 0 && <div className="flex items-center">
                                    <Heart className="h-3 w-3 mr-1" />
                                    {blog.likes}
                                  </div>}
                                {blog.viewCount > 0 && <div className="flex items-center">
                                    <Eye className="h-3 w-3 mr-1" />
                                    {blog.viewCount}
                                  </div>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </RippleEffect>)}
                  </div>}
              </CardContent>
            </Card>

            {/* 代码仓库列表 */}
            <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in-up" style={{
            animationDelay: '0.2s'
          }}>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Code className="h-6 w-6 mr-2" />
                  我的代码仓库
                  <Badge variant="secondary" className="ml-2 bg-green-500/20 text-green-300">
                    {userRepositories.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userRepositories.length === 0 ? <div className="text-center py-8">
                    <Code className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">暂无代码仓库</p>
                    <RippleEffect>
                      <Button className="mt-4 bg-green-600 hover:bg-green-700 hover-lift click-scale" onClick={() => $w.utils.navigateTo({
                    pageId: 'repository',
                    params: {}
                  })}>
                        查看仓库
                      </Button>
                    </RippleEffect>
                  </极div> : <div className="space-y-4">
                    {userRepositories.map(repo => <RippleEffect key={repo._id}>
                        <Card className="bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 cursor-pointer transition-all hover-lift click-scale" onClick={() => handleNavigateToRepository(repo._id)}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-white text-lg">{repo.name}</h3>
                              {repo.language && <Badge variant="outline" className="bg-slate-极600/50 text-slate-300">
                                  {repo.language}
                                </Badge>}
                            </div>
                            {repo.description && <p className="text-slate-400 text-sm mb-3 line-clamp-2">{repo.description}</p>}
                            <div className="flex items-center justify-between text-xs text-slate-500">
                              <div className="flex items-center space-x-4">
                                {repo.lastUpdated && <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    更新于 {repo.lastUpdated}
                                  </div>}
                                {repo.license && <div className="flex items-center">
                                    {repo.license}
                                  </div>}
                              </div>
                              <div className="flex items-center space-x-3">
                                {repo.stars > 0 && <div className="flex items-center">
                                    <Star className="h-3 w-3 mr-1" />
                                    {repo.stars}
                                  </div>}
                                {repo.forks > 0 && <div className="flex items-center">
                                    <GitBranch className="h-3 w-3 mr-1" />
                                    {repo.forks}
                                  </div>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </RippleEffect>)}
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}