// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';
// @ts-ignore;
import { User, Mail, FileText, Users, Heart, LogOut, Settings, ChevronDown, ChevronUp } from 'lucide-react';
// @ts-ignore;
import { cn } from '@/lib/utils';

export function UserAvatar({
  $w,
  className
}) {
  const {
    toast
  } = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    loadUserData();
  }, []);
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const currentUser = $w.auth.currentUser;
      if (currentUser && currentUser.userId) {
        const user = await $w.cloud.callDataSource({
          dataSourceName: 'users',
          methodName: 'wedaGetItemV2',
          params: {
            filter: {
              where: {
                _id: {
                  $eq: currentUser.userId
                }
              }
            },
            select: {
              $master: true
            }
          }
        });
        setUserData(user);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载用户信息',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      // 这里需要实现实际的登出逻辑
      toast({
        title: '登出成功',
        description: '您已成功登出',
        variant: 'default'
      });
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('登出失败:', error);
      toast({
        title: '登出失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleNavigate = (pageId, params = {}) => {
    $w.utils.navigateTo({
      pageId,
      params
    });
    setIsDropdownOpen(false);
  };
  const currentUser = $w.auth.currentUser;
  if (!currentUser || !currentUser.userId) {
    return <div className={cn('flex items-center gap-2', className)}>
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => handleNavigate('login')}>
          登录
        </Button>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleNavigate('register')}>
          注册
        </Button>
      </div>;
  }
  return <div className={cn('relative', className)}>
      <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 group" disabled={isLoading}>
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
          {userData?.avatar ? <img src={userData.avatar} alt={userData.username || userData.email} className="w-full h-full object-cover" /> : <User className="h-5 w-5 text-white" />}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
            {userData?.nickname || userData?.username || currentUser.name}
          </div>
          <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
            {userData?.email || currentUser.email}
          </div>
        </div>
        {isDropdownOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
      </button>

      {isDropdownOpen && <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-50 animate-in fade-in-80">
          {/* 用户信息卡片 */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                {userData?.avatar ? <img src={userData.avatar} alt={userData.username || userData.email} className="w-full h-full object-cover" /> : <User className="h-8 w-8 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">
                  {userData?.nickname || userData?.username || currentUser.name}
                </h3>
                <p className="text-slate-400 text-sm flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {userData?.email || currentUser.email}
                </p>
              </div>
            </div>

            {/* 用户统计数据 */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{userData?.totalPosts || 0}</div>
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                  <FileText className="h-3 w-3" />
                  文章
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{userData?.totalFollowers || 0}</div>
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                  <Users className="h-3 w-3" />
                  粉丝
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{userData?.totalLikes || 0}</div>
                <div className="text-slate-400 text-xs flex items-center justify-center gap-1">
                  <Heart className="h-3 w-3" />
                  点赞
                </div>
              </div>
            </div>
          </div>

          {/* 操作菜单 */}
          <div className="p-2">
            <button onClick={() => handleNavigate('profile')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
              <User className="h-4 w-4" />
              个人资料
            </button>
            <button onClick={() => handleNavigate('settings')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200">
              <Settings className="h-4 w-4" />
              设置
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200 mt-2">
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </div>}
    </div>;
}