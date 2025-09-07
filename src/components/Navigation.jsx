// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, BookOpen, Github, User, Menu, X, ChevronRight, Settings, LogOut } from 'lucide-react';

export function Navigation(props) {
  const {
    $w,
    currentPage
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const handleNavigate = async (pageId, params = {}) => {
    try {
      setIsNavigating(true);
      setIsExpanded(false);
      await $w.utils.navigateTo({
        pageId,
        params
      });
    } catch (error) {
      console.error('导航失败:', error);
    } finally {
      setIsNavigating(false);
    }
  };
  const handleLogout = async () => {
    try {
      // 这里需要实现具体的登出逻辑
      console.log('用户登出');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };
  const navItems = [{
    id: 'home',
    label: '首页',
    icon: Home,
    page: 'index'
  }, {
    id: 'blogs',
    label: '博客',
    icon: BookOpen,
    page: 'blogs'
  }, {
    id: 'repository',
    label: '仓库',
    icon: Github,
    page: 'repository'
  }, {
    id: 'editor',
    label: '写文章',
    icon: BookOpen,
    page: 'editor',
    params: {
      new: 'true'
    }
  }, {
    id: 'profile',
    label: '个人资料',
    icon: User,
    page: 'profile'
  }];
  const isHomePage = currentPage === 'index';
  if (isHomePage) {
    return <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Haokir Insights
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className={`text-slate-300 hover:text-white transition-all duration-200 hover:scale-105 ${currentPage === item.page ? 'text-blue-300' : ''}`} disabled={isNavigating}>
                  {item.label}
                </button>)}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => handleNavigate('profile')} disabled={isNavigating}>
                <User className="h-5 w-5" />
              </Button>
              
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-all duration-200" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {isExpanded && <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50">
              <div className="flex flex-col space-y-4 pt-4">
                {navItems.map(item => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className={`text-slate-300 hover:text-white transition-all duration-200 hover:bg-slate-800 py-2 px-4 rounded-lg text-left flex items-center ${currentPage === item.page ? 'bg-slate-800 text-blue-300' : ''}`} disabled={isNavigating}>
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>)}
              </div>
            </div>}
        </div>
      </nav>;
  }
  return <>
      {/* 圆形悬浮导航按钮 */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className={`w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${isExpanded ? 'rotate-45' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* 展开的导航菜单 */}
        {isExpanded && <div className="absolute bottom-full right-0 mb-4 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 shadow-2xl min-w-[200px]">
            <div className="space-y-2">
              {navItems.map((item, index) => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group" disabled={isNavigating} style={{
            animationDelay: `${index * 50}ms`,
            animation: 'slideInRight 0.3s ease-out forwards',
            opacity: 0,
            transform: 'translateX(20px)'
          }}>
                  <div className="flex items-center">
                    <item.icon className="h-4 w-4 mr-3 text-slate-300 group-hover:text-blue-300" />
                    <span className="text-slate-200 group-hover:text-white">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>)}
              
              <div className="border-t border-slate-700/50 pt-2 mt-2">
                <button onClick={() => handleNavigate('profile')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group" disabled={isNavigating}>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-slate-300 group-hover:text-green-300" />
                    <span className="text-slate-200 group-hover:text-white">个人资料</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/20 transition-all duration-200 group text-red-300 hover:text-red-200">
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>;
}