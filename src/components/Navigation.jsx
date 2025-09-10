// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button } from '@/components/ui';
// @ts-ignore;
import { Home, BookOpen, Github, User, Menu, X, ChevronRight, LogOut, LogIn } from 'lucide-react';

// @ts-ignore
import { AuthService } from '@/lib/auth';
export function NavigationComponent(props) {
  const {
    $w,
    currentPage
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  useEffect(() => {
    // 自动收起菜单（移动端点击外部区域时）
    const handleClickOutside = event => {
      if (isExpanded && !event.target.closest('.navigation-container')) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExpanded]);
  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await AuthService.checkAuth();
      setIsLoggedIn(loggedIn);
    };
    checkAuth();
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
      await AuthService.logout();
      setIsLoggedIn(false);
      await $w.utils.navigateTo({
        pageId: 'index'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const navItems = [{
    id: 'home',
    label: '首页',
    icon: Home,
    page: 'index',
    color: 'text-blue-400',
    hoverColor: 'hover:text-blue-300'
  }, {
    id: 'blogs',
    label: '博客',
    icon: BookOpen,
    page: 'blogs',
    color: 'text-green-400',
    hoverColor: 'hover:text-green-300'
  }, {
    id: 'repository',
    label: '代码仓库',
    icon: Github,
    page: 'repository',
    color: 'text-purple-400',
    hoverColor: 'hover:text-purple-300'
  }, {
    id: 'profile',
    label: '个人资料',
    icon: User,
    page: 'profile',
    color: 'text-amber-400',
    hoverColor: 'hover:text-amber-300'
  }];
  const utilityItems = [{
    id: 'settings',
    label: '设置',
    icon: Settings,
    page: 'settings',
    color: 'text-slate-400',
    hoverColor: 'hover:text-slate-300'
  }, {
    id: 'help',
    label: '帮助中心',
    icon: HelpCircle,
    page: 'help',
    color: 'text-slate-400',
    hoverColor: 'hover:text-slate-300'
  }];
  const isHomePage = currentPage === 'index';

  // 首页显示完整导航栏
  if (isHomePage) {
    return <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50 navigation-container">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Haokir Insights
              </span>
            </div>

            {/* 桌面端导航菜单 */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map(item => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className={`px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:scale-105 ${currentPage === item.page ? 'bg-slate-800 text-blue-300' : 'text-slate-300 hover:text-white'}`} disabled={isNavigating}>
                  {item.label}
                </button>)}
            </div>

            {/* 用户操作区 */}
            <div className="flex items-center space-x-3">
              {isLoggedIn ? <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={handleLogout} disabled={isNavigating}>
                  退出登录
                </Button> : <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white" onClick={() => $w.utils.navigateTo({
              pageId: 'login'
            })} disabled={isNavigating}>
                  登录
                </Button>}
              
              {/* 移动端菜单按钮 */}
              <button className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-all duration-200" onClick={e => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}>
                {isExpanded ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* 移动端展开菜单 */}
          {isExpanded && <div className="md:hidden mt-4 pb-4 border-t border-slate-700/50">
              <div className="flex flex-col space-y-2 pt-4">
                {navItems.map(item => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${currentPage === item.page ? 'bg-slate-800 text-blue-300' : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}`} disabled={isNavigating}>
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </button>)}
              </div>
            </div>}
        </div>
      </nav>;
  }

  // 其他页面显示圆形悬浮导航
  return <>
      {/* 圆形悬浮导航按钮 */}
      <div className="fixed bottom-6 right-6 z-50 navigation-container">
        <Button className={`w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl ${isExpanded ? 'rotate-45 bg-blue-700' : ''} ${isHovered ? 'scale-110' : ''}`} onClick={e => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }} onMouseEnter={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }} onMouseLeave={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }} disabled={isNavigating}>
          {isExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          
          {/* 悬浮提示 */}
          {showTooltip && !isExpanded && <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
              导航菜单
            </div>}
        </Button>

        {/* 展开的导航菜单 */}
        {isExpanded && <div className="absolute bottom-full right-0 mb-4 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl min-w-[220px] animate-in fade-in-90 zoom-in-95">
            <div className="space-y-2">
              {/* 主要导航项 */}
              <div className="pb-2 mb-2 border-b border-slate-700/50">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">导航</h3>
                {navItems.map((item, index) => <button key={item.id} onClick={() => handleNavigate(item.page, item.params || {})} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group" disabled={isNavigating} style={{
              animationDelay: `${index * 50}ms`
            }}>
                    <div className="flex items-center">
                      <item.icon className={`h-4 w-4 mr-3 ${item.color} group-hover:${item.hoverColor}`} />
                      <span className="text-slate-200 group-hover:text-white">{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>)}
              </div>

              {/* 用户操作区 */}
              <div className="pt-4 mt-4 border-t border-slate-700/50">
                {isLoggedIn ? <>
                    <button onClick={() => handleNavigate('profile')} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group" disabled={isNavigating}>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3 text-green-400 group-hover:text-green-300" />
                        <span className="text-slate-200 group-hover:text-white">个人资料</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    
                    <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/20 transition-all duration-200 group text-red-300 hover:text-red-200 mt-2">
                      <LogOut className="h-4 w-4 mr-3" />
                      <span>退出登录</span>
                    </button>
                  </> : <button onClick={() => $w.utils.navigateTo({
              pageId: 'login'
            })} className="w-full flex items-center p-3 rounded-lg hover:bg-blue-500/20 transition-all duration-200 group text-blue-300 hover:text-blue-200">
                    <LogIn className="h-4 w-4 mr-3" />
                    <span>登录</span>
                  </button>}
              </div>
            </div>
          </div>}
      </div>

      {/* 动画样式 */}
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
        
        .animate-in {
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .fade-in-90 {
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .zoom-in-95 {
          transform: scale(0.95);
          animation-fill-mode: forwards;
        }
      `}</style>
    </>;
}