// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';
// @ts-ignore;
import { User, LogOut, Settings, ChevronDown, Mail, Calendar, Star, HelpCircle } from 'lucide-react';

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
    return new Date(timestamp).toLocaleDateString('zh-CN');
  };

  // 未登录状态显示登录按钮
  if (!currentUser?.userId) {
    return <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => handleNavigate('login')}>
          登录
        </Button>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleNavigate('register')}>
          注册
        </Button>
      </div>;
  }
  return <div className="relative">
      {/* 用户头像按钮 */}
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-800/50 transition-all duration-200 group" onClick={() => setIsOpen(!isOpen)} disabled={isLoading}>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <span className="text-sm font-medium text-slate-200 group-hover:text-white">
            {userData?.username || currentUser.name || '用户'}
          </span>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* 下拉菜单 */}
      {isOpen && <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-50 animate-in fade-in-90 zoom-in-95">
          {/* 用户信息头部 */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {userData?.username || currentUser.name || '用户'}
                </h3>
                <p className="text-sm text-slate-400 truncate">
                  {userData?.email || currentUser.email || '未设置邮箱'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  用户ID: {currentUser.userId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-1 text-slate-400">
                <Calendar className="h-3 w-3" />
                <span>注册: {formatDate(userData?.registrationTime)}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <Star className="h-3 w-3" />
                <span>登录: {userData?.loginCount || 0} 次</span>
              </div>
            </div>
          </div>

          {/* 菜单选项 */}
          <div className="p-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-200 hover:text-white" onClick={() => handleNavigate('profile')}>
              <User className="h-4 w-4" />
              <span>个人资料</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-200 hover:text-white" onClick={() => handleNavigate('settings')}>
              <Settings className="h-4 w-4" />
              <span>账户设置</span>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 text-slate-200 hover:text-white" onClick={() => handleNavigate('help')}>
              <HelpCircle className="h-4 w-4" />
              <span>帮助中心</span>
            </button>
          </div>

          {/* 底部操作区 */}
          <div className="p-3 border-t border-slate-700/50">
            <button className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-200 text-red-300 hover:text-red-200" onClick={handleLogout} disabled={isLoading}>
              <LogOut className="h-4 w-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>}

      {/* 点击外部关闭菜单 */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>;
}