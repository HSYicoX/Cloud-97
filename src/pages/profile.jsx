// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Avatar, AvatarFallback, AvatarImage, Input, Textarea, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Settings, BookOpen, Github, BarChart3, Edit, Save, Plus, Trash2, Eye, Calendar, Heart, Users, Download, Upload, Mail, MapPin, Link, RefreshCw, Camera, X } from 'lucide-react';

// @ts-ignore;
import { UserStatsCard } from '@/components/UserStatsCard';
// @ts-ignore;
import { BlogManagementCard } from '@/components/BlogManagementCard';
// @ts-ignore;
import { RepositoryCard } from '@/components/RepositoryCard';

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
  const [statsData, setStatsData] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // 加载用户数据
  useEffect(() => {
    loadUserData();
  }, []);
  
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
                username: {
                  $eq: 'Haokir'
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
        setUserData({
          username: user.username || 'Haokir',
          email: user.email || 'haokir@example.com',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: user.bio || '前端开发工程师 | React爱好者 | 技术博客作者',
          location: user.location || '上海',
          website: user.website || 'https://haokir.dev'
        });

        // 设置统计数据
        setStatsData({
          totalViews: user.totalViews || 3427,
          totalLikes: user.totalLikes || 116,
          totalPosts: user.totalPosts || 12,
          totalFollowers: user.totalFollowers || 284,
          monthlyStats: user.monthlyStats || [{
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
  
  const setDefaultData = () => {
    setUserData({
      username: 'Haokir',
      email: 'haokir@example.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d极cf377fde?w=150&h=150&fit=crop&crop=face',
      bio: '前端开发工程师 | React爱好者 | 技术博客作者',
      location: '上海',
      website: '极https://haokir.dev'
    });
    setStatsData({
      totalViews: 3427,
      totalLikes: 116,
      totalPosts: 12,
      totalFollowers: 284,
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
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast({
          title: '文件类型错误',
          description: '请选择图片文件',
          variant: 'destructive'
        });