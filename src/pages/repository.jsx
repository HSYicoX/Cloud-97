// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Badge } from '@/components/ui';
// @ts-ignore;
import { Download, Upload, History, Code, Settings, Github, CloudDownload, RefreshCw, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

// @ts-ignore;
import { Navigation } from '@/components/Navigation';
// @ts-ignore;
import { FileTree } from '@/components/FileTree';
// @ts-ignore;
import { SyncHistory } from '@/components/SyncHistory';
// @ts-ignore;
import { RepositoryHeader } from '@/components/RepositoryHeader';
// @ts-ignore;
import { CodeViewer } from '@/components/CodeViewer';
export default function RepositoryPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('code');
  const [expandedFolders, setExpandedFolders] = useState(['src', 'src/components']);
  const [selectedFile, setSelectedFile] = useState('README.md');
  const [repositories, setRepositories] = useState([]);
  const [repository, setRepository] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncHistory, setSyncHistory] = useState([]);
  const repoId = $w.page.dataset.params?.id || '1';
  useEffect(() => {
    loadRepositoryData();
    loadSyncHistory();
  }, [repoId]);
  const loadRepositoryData = async () => {
    try {
      setIsLoading(true);
      const repoResult = await $w.cloud.callDataSource({
        dataSourceName: 'code_repositories',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: repoId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (repoResult) {
        setRepository(repoResult);
      }
      const reposResult = await $w.cloud.callDataSource({
        dataSourceName: 'code_repositories',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          pageSize: 10,
          pageNumber: 1,
          orderBy: [{
            stars: 'desc'
          }]
        }
      });
      if (reposResult?.records) {
        setRepositories(reposResult.records);
      }
    } catch (error) {
      console.error('加载仓库数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载仓库内容，请稍后重试',
        variant: 'destructive'
      });
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };
  const loadSyncHistory = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'github_sync_records',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          orderBy: [{
            timestamp: 'desc'
          }],
          pageSize: 10,
          pageNumber: 1
        }
      });
      if (result?.records) {
        setSyncHistory(result.records);
      }
    } catch (error) {
      console.error('加载同步历史失败:', error);
      setSyncHistory([]);
    }
  };
  const saveSyncRecord = async recordData => {
    try {
      const currentUser = $w.auth.currentUser;
      await $w.cloud.callDataSource({
        dataSourceName: 'github_sync_records',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            status: recordData.status,
            message: recordData.message,
            timestamp: new Date().getTime(),
            repositoriesUpdated: recordData.repositoriesUpdated,
            repositoryIds: recordData.repositoryIds,
            syncType: 'manual',
            errorDetails: recordData.errorDetails || '',
            duration: recordData.duration || 0,
            userId: currentUser?.userId || 'unknown',
            githubUsername: 'haokir'
          }
        }
      });
    } catch (error) {
      console.error('保存同步记录失败:', error);
    }
  };
  const setDefaultData = () => {
    setRepository({
      _id: repoId,
      name: 'haokir-blog',
      description: 'Personal blog platform built with React and Markdown',
      stars: 128,
      forks: 42,
      lastUpdated: '2 hours ago',
      language: 'JavaScript',
      isFavorite: false,
      fileTree: [{
        name: 'src',
        type: 'folder',
        children: [{
          name: 'components',
          type: 'folder',
          children: [{
            name: 'Header.jsx',
            type: 'file',
            size: '2.1 KB'
          }, {
            name: 'Footer.jsx',
            type: 'file',
            size: '1.8 KB'
          }]
        }, {
          name: 'App.jsx',
          type: 'file',
          size: '3.2 KB'
        }]
      }, {
        name: 'README.md',
        type: 'file',
        size: '4.7 KB'
      }, {
        name: 'package.json',
        type: 'file',
        size: '1.2 KB'
      }]
    });
  };
  const handleStar = async repoId => {
    try {
      const repo = repositories.find(r => r._id === repoId);
      if (!repo) return;
      const newStarState = !repo.isFavorite;
      const newStarCount = newStarState ? repo.stars + 1 : repo.stars - 1;
      setRepositories(prev => prev.map(r => r._id === repoId ? {
        ...r,
        isFavorite: newStarState,
        stars: newStarCount
      } : r));
      await $w.cloud.callDataSource({
        dataSourceName: 'code_repositories',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            isFavorite: newStarState,
            stars: newStarCount
          },
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: repoId
                }
              }]
            }
          }
        }
      });
      toast({
        title: newStarState ? '已加星标' : '已取消星标',
        description: newStarState ? '仓库已添加到星标' : '仓库已从星标中移除'
      });
    } catch (error) {
      console.error('更新星标状态失败:', error);
      toast({
        title: '操作失败',
        description: '星标状态更新失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleSyncRepositories = async () => {
    try {
      setIsSyncing(true);
      setSyncProgress(0);
      toast({
        title: '同步开始',
        description: '正在从GitHub同步仓库数据...'
      });
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => prev >= 100 ? (clearInterval(progressInterval), 100) : prev + 10);
      }, 300);
      await new Promise(resolve => setTimeout(resolve, 3000));
      const newRepositories = repositories.map(repo => ({
        ...repo,
        stars: repo.stars + Math.floor(Math.random() * 5),
        forks: repo.forks + Math.floor(Math.random() * 2),
        lastUpdated: '刚刚更新'
      }));
      setRepositories(newRepositories);
      for (const repo of newRepositories) {
        await $w.cloud.callDataSource({
          dataSourceName: 'code_repositories',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              stars: repo.stars,
              forks: repo.forks,
              lastUpdated: repo.lastUpdated
            },
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: repo._id
                  }
                }]
              }
            }
          }
        });
      }
      const newSyncRecord = {
        status: 'success',
        message: `同步完成，更新了${newRepositories.length}个仓库`,
        timestamp: new Date().getTime(),
        repositoriesUpdated: newRepositories.length,
        repositoryIds: newRepositories.map(r => r._id)
      };
      await saveSyncRecord(newSyncRecord);
      setSyncHistory(prev => [newSyncRecord, ...prev.slice(0, 4)]);
      clearInterval(progressInterval);
      setSyncProgress(100);
      toast({
        title: '同步成功',
        description: `成功更新了${newRepositories.length}个仓库的数据`
      });
    } catch (error) {
      console.error('同步失败:', error);
      const errorSyncRecord = {
        status: 'error',
        message: '同步失败：网络连接问题',
        timestamp: new Date().getTime(),
        repositoriesUpdated: 0,
        errorDetails: error.message
      };
      await saveSyncRecord(errorSyncRecord);
      setSyncHistory(prev => [errorSyncRecord, ...prev.slice(0, 4)]);
      toast({
        title: '同步失败',
        description: '仓库同步失败，请检查网络连接后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncProgress(0), 2000);
    }
  };
  const toggleFolder = folderName => {
    setExpandedFolders(prev => prev.includes(folderName) ? prev.filter(f => f !== folderName) : [...prev, folderName]);
  };
  const handleFileSelect = fileName => {
    setSelectedFile(fileName);
    setActiveTab('code');
  };
  const handleFileUpload = () => {
    toast({
      title: '上传功能',
      description: '文件上传功能准备中...'
    });
  };
  const handleFileDownload = () => {
    toast({
      title: '下载功能',
      description: '文件下载功能准备中...'
    });
  };
  const handleNavigateBack = () => {
    $w.utils.navigateBack();
  };
  const formatSyncTime = timestamp => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMs = now - syncTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    return `${diffDays}天前`;
  };
  if (isLoading) {
    return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;
  }
  if (!repository) {
    return <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">仓库未找到</h2>
          <Button onClick={handleNavigateBack}>返回首页</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navigation $w={$w} currentPage="repository" />
      
      <RepositoryHeader repository={repository} onStar={() => handleStar(repository._id)} onNavigateBack={handleNavigateBack} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Tree Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#161b22] border-[#30363d]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Download className="h-5 w-5 mr-2 text-blue-400" />
                  文件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  <FileTree items={repository.fileTree || []} expandedFolders={expandedFolders} onToggleFolder={toggleFolder} onSelectFile={handleFileSelect} selectedFile={selectedFile} />
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="bg-[#238636] hover:bg-[#2ea043] text-white flex-1" onClick={handleFileUpload}>
                    <Upload className="h-4 w-4 mr-2" />
                    上传
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] flex-1" onClick={handleFileDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    下载
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sync Status Card */}
            <Card className="bg-[#161b22] border-[#30363d] mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <CloudDownload className="h-5 w-5 mr-2 text-green-400" />
                  同步状态
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSyncing ? <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8b949e]">同步进度</span>
                      <span className="text-sm text-green-400">{syncProgress}%</span>
                    </div>
                    <div className="w-full bg-[#30363d] rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{
                    width: `${syncProgress}%`
                  }} />
                    </div>
                    <p className="text-xs text-[#8b949e]">正在从GitHub获取最新数据...</p>
                  </div> : <div className="space-y-2">
                    <div className="flex items-center text-sm text-green-400">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>同步就绪</span>
                    </div>
                    <p className="text-xs text-[#8b949e]">点击同步按钮获取最新仓库数据</p>
                  </div>}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-[#161b22] border-b border-[#30363d]">
                <TabsTrigger value="code" className="data-[state=active]:bg-[#21262d] data-[state=active]:text-white">
                  <Code className="h-4 w-4 mr-2" />
                  代码
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-[#21262d] data-[state=active]:text-white">
                  <History className="h-4 w-4 mr-2" />
                  历史
                </TabsTrigger>
                <TabsTrigger value="sync" className="data-[state=active]:bg-[#21262d] data-[state=active]:text-white">
                  <Github className="h-4 w-4 mr-2" />
                  同步
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-[#21262d] data-[state=active]:text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </TabsTrigger>
              </TabsList>

              {/* Code Tab */}
              <TabsContent value="code" className="mt-0">
                <CodeViewer selectedFile={selectedFile} repository={repository} />
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-0">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-lg">提交历史</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {repository.commitHistory?.map(commit => <div key={commit.hash} className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{commit.message}</h4>
                              <p className="text-sm text-[#8b949e] mt-1">
                                {commit.author} committed {commit.date} • {commit.filesChanged} files changed
                              </p>
                            </div>
                            <code className="text-xs bg-[#21262d] px-2 py-1 rounded text-[#8b949e]">
                              {commit.hash.slice(0, 7)}
                            </code>
                          </div>
                        </div>)}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sync Tab */}
              <TabsContent value="sync" className="mt-0">
                <div className="space-y-6">
                  {/* Sync Control Card */}
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Github className="h-5 w-5 mr-2" />
                        GitHub 同步
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">手动同步</h4>
                            <p className="text-sm text-[#8b949e]">从GitHub获取最新的仓库数据</p>
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSyncRepositories} disabled={isSyncing}>
                            {isSyncing ? <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                同步中...
                              </> : <>
                                <CloudDownload className="h-4 w-4 mr-2" />
                                立即同步
                              </>}
                          </Button>
                        </div>

                        {isSyncing && <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#8b949e]">同步进度</span>
                              <span className="text-sm text-green-400">{syncProgress}%</span>
                            </div>
                            <div className="w-full bg-[#30363d] rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{
                            width: `${syncProgress}%`
                          }} />
                            </div>
                          </div>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sync History Card */}
                  <Card className="bg-[#161b22] border-[#30363d]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        同步历史
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SyncHistory syncHistory={syncHistory} formatSyncTime={formatSyncTime} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="mt-0">
                <Card className="bg-[#161b22] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-lg">仓库设置</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#8b949e]">仓库设置功能准备中...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>;
}