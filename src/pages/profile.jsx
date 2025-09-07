// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, AvatarImage, Input, Textarea, useToast, Badge, Progress, RippleEffect } from '@/components/ui';
// @ts-ignore;
import { User, Settings, BookOpen, Github, BarChart3, Edit, Save, Plus, Trash2, Eye, Calendar, Heart, Users, Download, Upload, Mail, MapPin, Link, RefreshCw, Camera, X, Star, GitBranch, Code, FileText, Bookmark, TrendingUp, BarChart, Activity, Hash } from 'lucide-react';

// @ts-ignore;
import { UserStatsCard } from '@/components/UserStatsCard';
// @ts-ignore;
import { BlogManagementCard } from '@/components/BlogManagementCard';
// @ts-ignore;
import { RepositoryCard } from '@/components/RepositoryCard';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userBlogs, setUserBlogs] = useState([]);
  const [userRepositories, setUserRepositories] = useState([]);
  const [statsData, setStatsData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    orcid: ''
  });
  const fileInputRef = useRef(null);

  // 获取当前用户ID
  const currentUserId = $w.auth.currentUser?.userId;

  // 加载用户数据
  useEffect(() => {
    if (currentUserId) {
      loadUserData();
      loadUserBlogs();
      loadUserRepositories();
    }
  }, [currentUserId]);
  const loadUserData = async () => {
    try {
      setIsLoading(true);

      // 获取当前用户信息
      const userResult = await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: currentUserId
                }
              }]
            }
          },
          select: {
            $master: true
          },
          pageSize: 1,
          pageNumber: 1
        }
      });
      if (userResult?.records?.[0]) {
        const user = userResult.records[0];
        setUserData(user);
        setEditForm({
          username: user.username || '',
          email: user.email || '',
          bio: user.bio || '',
          location: user.location || '',
          website: user.website || '',
          orcid: user.orcid || ''
        });

        // 设置统计数据
        setStatsData({
          totalViews: user.totalViews || 0,
          totalLikes: user.totalLikes || 0,
          totalPosts: user.totalPosts || 0,
          totalFollowers: user.totalFollowers || 0,
          blogCount: user.blogCount || 0,
          repositoryCount: user.repositoryCount || 0,
          favoriteCount: user.favoriteCount || 0,
          monthlyStats: user.monthlyStats || []
        });
      } else {
        // 如果没有找到用户数据，使用默认数据
        setDefaultData();
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载用户信息，请稍后重试',
        variant: 'destructive'
      });
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };
  const loadUserBlogs = async () => {
    try {
      // 获取用户博客文章
      const blogsResult = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                'author.name': {
                  $eq: $w.auth.currentUser?.name || 'Haokir'
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
          pageNumber: 1
        }
      });
      setUserBlogs(blogsResult?.records || []);
    } catch (error) {
      console.error('加载博客数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载博客文章',
        variant: 'destructive'
      });
    }
  };
  const loadUserRepositories = async () => {
    try {
      // 获取用户代码仓库
      const reposResult = await $w.cloud.callDataSource({
        dataSourceName: 'code_repositories',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          orderBy: [{
            stars: 'desc'
          }],
          pageSize: 10,
          pageNumber: 1
        }
      });
      setUserRepositories(reposResult?.records || []);
    } catch (error) {
      console.error('加载仓库数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载代码仓库',
        variant: 'destructive'
      });
    }
  };
  const setDefaultData = () => {
    const defaultUser = {
      username: 'Haokir',
      email: 'haokir@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: '前端开发工程师 | React爱好者 | 技术博客作者',
      location: '上海',
      website: 'https://haokir.dev',
      orcid: '',
      totalViews: 3427,
      totalLikes: 116,
      totalPosts: 12,
      totalFollowers: 284,
      blogCount: 5,
      repositoryCount: 8,
      favoriteCount: 23
    };
    setUserData(defaultUser);
    setEditForm({
      username: defaultUser.username,
      email: defaultUser.email,
      bio: defaultUser.bio,
      location: defaultUser.location,
      website: defaultUser.website,
      orcid: defaultUser.orcid
    });
    setStatsData({
      totalViews: defaultUser.totalViews,
      totalLikes: defaultUser.totalLikes,
      totalPosts: defaultUser.totalPosts,
      totalFollowers: defaultUser.totalFollowers,
      blogCount: defaultUser.blogCount,
      repositoryCount: defaultUser.repositoryCount,
      favoriteCount: defaultUser.favoriteCount,
      monthlyStats: [{
        month: '1月',
        views: 1245,
        likes: 42
      }, {
        month: '2月',
        views: 892,
        likes: 31
      }, {
        month: '3月',
        views: 567,
        likes: 18
      }, {
        month: '4月',
        views: 723,
        likes: 25
      }]
    });
  };
  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast({
          title: '文件类型错误',
          description: '请选择图片文件',
          variant: 'destructive'
        });
        return;
      }

      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: '文件过大',
          description: '请选择小于5MB的图片',
          variant: 'destructive'
        });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      toast({
        title: '上传中',
        description: '头像正在上传...'
      });

      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 更新用户头像
      const avatarUrl = URL.createObjectURL(selectedFile);
      await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            avatar: avatarUrl
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: currentUserId
                }
              }]
            }
          }
        }
      });
      setUserData(prev => ({
        ...prev,
        avatar: avatarUrl
      }));
      toast({
        title: '上传成功',
        description: '头像更新成功'
      });
      setSelectedFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error('头像上传失败:', error);
      toast({
        title: '上传失败',
        description: '头像上传失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaUpdateV2',
        params: {
          data: editForm,
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: currentUserId
                }
              }]
            }
          }
        }
      });
      setUserData(prev => ({
        ...prev,
        ...editForm
      }));
      setIsEditing(false);
      toast({
        title: '保存成功',
        description: '个人资料已更新'
      });
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: '保存失败',
        description: '更新个人资料失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadUserData(), loadUserBlogs(), loadUserRepositories()]);
    setIsRefreshing(false);
    toast({
      title: '刷新成功',
      description: '数据已更新'
    });
  };
  const handleNavigateTo = (pageId, params = {}) => {
    setIsNavigating(true);
    $w.utils.navigateTo({
      pageId,
      params
    });
  };
  if (isLoading && !userData) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <LoadingSpinner size="xl" text="加载用户信息..." />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      {/* Header */}
      <div className="container mx-auto max-w-6xl pt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-white">个人中心</h1>
            <RippleEffect>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white click-scale" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                刷新
              </Button>
            </RippleEffect>
          </div>
          <div className="flex items-center space-x-2">
            <RippleEffect>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover-lift click-scale" onClick={() => handleNavigateTo('index')} disabled={isNavigating}>
                <X className="h-4 w-4 mr-2" />
                返回首页
              </Button>
            </RippleEffect>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Profile */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
              <CardContent className="p-6">
                <div className="text-center">
                  {/* Avatar Section */}
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-24 w-24 mx-auto border-4 border-slate-600/50">
                      <AvatarImage src={avatarPreview || userData?.avatar} alt={userData?.username} />
                      <AvatarFallback className="bg-slate-700 text-white text-2xl">
                        {userData?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <RippleEffect>
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full click-scale" disabled={isUploading}>
                        <Camera className="h-4 w-4" />
                      </button>
                    </RippleEffect>
                  </div>

                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

                  {selectedFile && <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">新头像预览</span>
                        <RippleEffect>
                          <button onClick={() => {
                        setSelectedFile(null);
                        setAvatarPreview(null);
                      }} className="text-slate-400 hover:text-white click-scale">
                            <X className="h-4 w-4" />
                          </button>
                        </RippleEffect>
                      </div>
                      <RippleEffect>
                        <Button onClick={handleAvatarUpload} disabled={isUploading} className="w-full bg-blue-600 hover:bg-blue-700 click-scale">
                          {isUploading ? <LoadingSpinner size="sm" className="mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                          上传头像
                        </Button>
                      </RippleEffect>
                    </div>}

                  <h2 className="text-xl font-bold text-white mb-1">
                    {userData?.username}
                  </h2>
                  
                  {userData?.email && <div className="flex items-center justify-center text-slate-400 mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{userData.email}</span>
                    </div>}

                  {userData?.orcid && <div className="flex items-center justify-center text-slate-400 mb-3">
                      <Hash className="h-4 w-4 mr-2" />
                      <span>ORCID: {userData.orcid}</span>
                    </div>}

                  {userData?.location && <div className="flex items-center justify-center text-slate-400 mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{userData.location}</span>
                    </div>}

                  {userData?.website && <div className="flex items-center justify-center text-slate-400 mb-4">
                      <Link className="h-4 w-4 mr-2" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                        {userData.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>}

                  {userData?.bio && <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                      {userData.bio}
                    </p>}

                  <RippleEffect>
                    <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 click-scale">
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? '取消编辑' : '编辑资料'}
                    </Button>
                  </RippleEffect>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            {statsData && <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2 text-blue-400" />
                    数据概览
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{statsData.totalViews}</div>
                      <div className="text-xs text-slate-400">总阅读量</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{statsData.totalLikes}</div>
                      <div className="text-xs text-slate-400">总点赞数</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{statsData.blogCount}</div>
                      <div className="text-xs text-slate-400">博客数量</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-white">{statsData.repositoryCount}</div>
                      <div className="text-xs text-slate-400">仓库数量</div>
                    </div>
                  </div>
                </CardContent>
              </Card>}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Form */}
            {isEditing && <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                <CardHeader>
                  <CardTitle>编辑个人资料</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          用户名
                        </label>
                        <Input value={editForm.username} onChange={e => setEditForm(prev => ({
                      ...prev,
                      username: e.target.value
                    }))} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          邮箱
                        </label>
                        <Input type="email" value={editForm.email} onChange={e => setEditForm(prev => ({
                      ...prev,
                      email: e.target.value
                    }))} className="bg-slate-700/50 border-slate-600 text-white" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        个人简介
                      </label>
                      <Textarea value={editForm.bio} onChange={e => setEditForm(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))} className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]" placeholder="介绍一下自己..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          位置
                        </label>
                        <Input value={editForm.location} onChange={e => setEditForm(prev => ({
                      ...prev,
                      location: e.target.value
                    }))} className="bg-slate-700/50 border-slate-600 text-white" placeholder="例如：上海" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                          个人网站
                        </label>
                        <Input value={editForm.website} onChange={e => setEditForm(prev => ({
                      ...prev,
                      website: e.target.value
                    }))} className="bg-slate-700/50 border-slate-600 text-white" placeholder="https://example.com" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300 mb-2 block">
                        ORCID
                      </label>
                      <Input value={editForm.orcid} onChange={e => setEditForm(prev => ({
                    ...prev,
                    orcid: e.target.value
                  }))} className="bg-slate-700/50 border-slate-600 text-white" placeholder="XXXX-XXXX-XXXX-XXX" />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <RippleEffect>
                        <Button onClick={handleSaveProfile} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 click-scale">
                          <Save className="h-4 w-4 mr-2" />
                          保存更改
                        </Button>
                      </RippleEffect>
                      <RippleEffect>
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="border-slate-600 text-slate-300 hover:bg-slate-700 click-scale">
                          取消
                        </Button>
                      </RippleEffect>
                    </div>
                  </div>
                </CardContent>
              </Card>}

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 glass-dark">
                <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white hover-lift click-scale">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  总览
                </TabsTrigger>
                <TabsTrigger value="blogs" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white hover-lift click-scale">
                  <BookOpen className="h-4 w-4 mr-2" />
                  博客管理
                </TabsTrigger>
                <TabsTrigger value="repositories" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white hover-lift click-scale">
                  <Github className="h-4 w-4 mr-2" />
                  代码仓库
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* User Stats Card */}
                {statsData && <UserStatsCard stats={statsData} />}

                {/* Recent Blogs */}
                <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                      最近博客
                    </CardTitle>
                    <RippleEffect>
                      <Button variant="ghost" size="sm" onClick={() => handleNavigateTo('editor', {
                      new: true
                    })} className="text-slate-400 hover:text-white click-scale">
                        <Plus className="h-4 w-4 mr-1" />
                        写博客
                      </Button>
                    </RippleEffect>
                  </CardHeader>
                  <CardContent>
                    {userBlogs.length > 0 ? <div className="space-y-3">
                        {userBlogs.slice(0, 5).map(blog => <BlogManagementCard key={blog._id} blog={blog} onEdit={() => handleNavigateTo('editor', {
                      id: blog._id
                    })} onView={() => handleNavigateTo('blog', {
                      id: blog._id
                    })} />)}
                      </div> : <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">还没有博客文章</p>
                        <RippleEffect>
                          <Button onClick={() => handleNavigateTo('editor', {
                        new: true
                      })} className="mt-4 bg-blue-600 hover:bg-blue-700 click-scale">
                            <Plus className="h-4 w-4 mr-2" />
                            开始写作
                          </Button>
                        </RippleEffect>
                      </div>}
                  </CardContent>
                </Card>

                {/* Recent Repositories */}
                <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="flex items-center">
                      <Github className="h-5 w-5 mr-2 text-green-400" />
                      代码仓库
                    </CardTitle>
                    <RippleEffect>
                      <Button variant="ghost" size="sm" onClick={() => handleNavigateTo('repository')} className="text-slate-400 hover:text-white click-scale">
                        <Code className="h-4 w-4 mr-1" />
                        查看全部
                      </Button>
                    </RippleEffect>
                  </CardHeader>
                  <CardContent>
                    {userRepositories.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userRepositories.slice(0, 4).map(repo => <RepositoryCard key={repo._id} repository={repo} onView={() => handleNavigateTo('repository', {
                      id: repo._id
                    })} />)}
                      </div> : <div className="text-center py-8">
                        <Github className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400">还没有代码仓库</p>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs" className="mt-6">
                <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                      博客管理
                    </CardTitle>
                    <RippleEffect>
                      <Button onClick={() => handleNavigateTo('editor', {
                      new: true
                    })} className="bg-blue-600 hover:bg-blue-700 click-scale">
                        <Plus className="h-4 w-4 mr-2" />
                        新建博客
                      </Button>
                    </RippleEffect>
                  </CardHeader>
                  <CardContent>
                    {userBlogs.length > 0 ? <div className="space-y-4">
                        {userBlogs.map(blog => <BlogManagementCard key={blog._id} blog={blog} onEdit={() => handleNavigateTo('editor', {
                      id: blog._id
                    })} onView={() => handleNavigateTo('blog', {
                      id: blog._id
                    })} showActions />)}
                      </div> : <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">还没有博客文章</h3>
                        <p className="text-slate-400 mb-6">开始创作你的第一篇技术博客吧！</p>
                        <RippleEffect>
                          <Button onClick={() => handleNavigateTo('editor', {
                        new: true
                      })} className="bg-blue-600 hover:bg-blue-700 click-scale">
                            <Plus className="h-4 w-4 mr-2" />
                            开始写作
                          </Button>
                        </RippleEffect>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Repositories Tab */}
              <TabsContent value="repositories" className="mt-6">
                <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Github className="h-5 w-5 mr-2 text-green-400" />
                      代码仓库管理
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userRepositories.length > 0 ? <div className="grid grid-cols-1 gap-4">
                        {userRepositories.map(repo => <RepositoryCard key={repo._id} repository={repo} onView={() => handleNavigateTo('repository', {
                      id: repo._id
                    })} showFullInfo />)}
                      </div> : <div className="text-center py-12">
                        <Github className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">还没有代码仓库</h3>
                        <p className="text-slate-400">开始创建你的第一个代码项目吧！</p>
                      </div>}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>;
}