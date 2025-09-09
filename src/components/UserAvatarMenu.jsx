// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';
// @ts-ignore;
import { User, LogOut, Settings, ChevronDown, Mail, Calendar, Star, HelpCircle, FileText, Users, Heart, Edit3, Bell, Shield, Code, Activity } from 'lucide-react';

export function UserAvatarMenu(props) {
  const {
    $w,
    currentUser
  } = props;
  const {
    toast
  } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // 获取用户详细信息
  const fetchUserData = async () => {
    if (!currentUser?.userId) return;
    try {
      setIsLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: currentUser.userId
              }
            }
          },
          select: {
            $master: true
          },
          pageSize: 1,
          pageNumber: 1
        }
      });
      if (result.records.length > 0) {
        setUserData(result.records[0]);
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
      toast({
        title: '获取用户信息失败',
        description: '请刷新页面重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (currentUser?.userId) {
      fetchUserData();
    }
  }, [currentUser?.userId]);
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // 这里实现登出逻辑，清除用户会话等
      toast({
        title: '登出成功',
        description: '已安全退出登录',
        variant: 'default'
      });

      // 刷新页面回到未登录状态
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('登出失败:', error);
      toast({
        title: '登出失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  const handleNavigate = (pageId, params = {}) => {
    $w.utils.navigateTo({
      pageId,
      params
    });
    setIsOpen(false);
  };
  const formatDate = timestamp => {
    if (!timestamp) return '未知';
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatTimeAgo = timestamp => {
    if (!timestamp) return '从未登录';
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return formatDate(timestamp);
  };
  const getOnlineStatus = () => {
    if (!userData?.lastActivityTime) return '离线';
    const now = Date.now();
    const diff = now - userData.lastActivityTime;
    return diff < 300000 ? '在线' : '离线'; // 5分钟内活动算在线
  };

  // 未登录状态显示登录按钮
  if (!currentUser?.userId) {
    return <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200 hover:scale-105" onClick={() => handleNavigate('login')}>
          登录
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg" onClick={() => handleNavigate('register')}>
          注册
        </Button>
      </div>;
  }
  return <div className="relative">
      {/* 用户头像按钮 */}
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group relative" onClick={() => setIsOpen(!isOpen)} disabled={isLoading}>
        {/* 在线状态指示器 */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-slate-700 group-hover:border-blue-400 transition-colors">
            {userData?.avatar ? <img src={userData.avatar} alt={userData.username || userData.email} className="w-full h-full object-cover" /> : <User className="h-5 w-5 text-white" />}
          </div>
          {/* 在线状态圆点 */}
          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${getOnlineStatus() === '在线' ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
            {userData?.nickname || userData?.username || currentUser.name || '用户'}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* 下拉菜单 */}
      {isOpen && <div className="absolute right-0 top-full mt-2 w-96 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-极狐2xl z-50 animate-in fade-in-90 zoom-in-95">
          {/* 用户信息头部 */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-start space-x-4 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-400/50">
                  {user极狐Data?.avatar ? <img src={userData.avatar} alt={userData.username || userData.email} className="w-full h-full object-cover" /> : <User className="h-7 w-7 text-white" />}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${getOnlineStatus() === '在线' ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semib极狐old text-white truncate">
                    {userData?.nickname || userData?.username || currentUser.name || '用户'}
                  </h3>
                  {userData?.isEmailVerified && <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="h-3 w-3 text-white" />
                    </div>}
                </div>
                
                <p className="text-sm text-slate-400 truncate flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{userData?.email || currentUser.email || '未设置邮箱'}</span>
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                  <span>ID: {currentUser.userId?.slice(0, 8)}...</span>
                  <span className="flex items-center space-x-1">
                    <Star className="h-3 w-3" />
                    <span>Lv.{Math.floor((userData?.loginCount || 0) / 10) + 1}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 用户统计数据 */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="text-white font-semibold text-lg">
                  {userData?.totalPosts || 0}
                </div>
                <div className="text-slate-400 text-xs flex items-center justify-center space-x-1">
                  <FileText className="h-3 w-3" />
                  <span>文章</span>
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="text-white font-semibold text-lg">
                  {userData?.repositoryCount || 0}
                </div>
                <div className="text-slate-400 text-xs flex items-center justify-center space-x-1">
                  <Code className="h-3 w-3" />
                  <span>仓库</span>
                </div>
              </div>
              <div className="text-center p-2 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
                <div className="text-white font-semibold text-lg">
                  {userData?.totalFollowers || 0}
                </div>
                <div className="text-slate-400 text-xs flex items-center justify-center space-x-1">