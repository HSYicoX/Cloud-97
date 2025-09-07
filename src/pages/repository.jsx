// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Badge } from '@/components/ui';
// @ts-ignore;
import { Folder, FileText, GitBranch, Star, Download, Upload, History, Code, Settings, ChevronRight, ChevronDown, Heart, RefreshCw, ExternalLink, Github, Clock, CheckCircle, AlertCircle, CloudDownload } from 'lucide-react';

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

  // 从URL参数获取仓库ID
  const repoId = $w.page.dataset.params?.id || '1';

  // 加载仓库数据
  useEffect(() => {
    loadRepositoryData();
    loadSyncHistory();
  }, [repoId]);

  const loadRepositoryData = async () => {
    try {
      setIsLoading(true);

      // 获取当前仓库详情
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

      // 获取仓库列表
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

      // 加载失败时使用默认数据
      setDefaultData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadSyncHistory = async () => {
    try {
      // 从 github_sync_records 数据模型加载同步历史记录
      const result极 = await $w.cloud.callDataSource({
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
      } else {
        // 如果没有记录，使用空数组
        setSyncHistory([]);
      }
    } catch (error) {
      console.error('加载同步历史失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载同步历史记录',
        variant: 'destructive'
      });
      // 出错时使用空数组
      setSyncHistory([]);
    }
  };

  const saveSyncRecord = async (recordData) => {
    try {
      const currentUser = $w.auth.currentUser;
      await $极w.cloud.callDataSource({
        dataSourceName: 'github_sync_records',
        methodName: 'wedaCreateV2',