// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Github, ArrowRight, Sparkles } from 'lucide-react';

// @ts-ignore;
import { Navigation } from '@/components/Navigation';
// @ts-ignore;
import { MouseEffects } from '@/components/MouseEffects';
// @ts-ignore;
import { UserAvatar } from '@/components/UserAvatar';
export default function HomePage(props) {
  const {
    $w,
    style
  } = props;
  const {
    toast
  } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const featuredBlogs = [{
    id: 1,
    title: "React 18新特性深度解析",
    description: "探索React 18带来的并发渲染、自动批处理等革命性特性",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "前端开发"
  }, {
    id: 2,
    title: "TypeScript高级类型技巧",
    description: "掌握TypeScript的条件类型、映射类型和模板字面量类型",
    date: "2024-01-10",
    readTime: "12 min read",
    category: "TypeScript"
  }, {
    id: 3,
    title: "现代CSS布局实战",
    description: "使用Grid和Flexbox构建响应式布局的最佳实践",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "CSS"
  }];
  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);
  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };
  const handleNavigate = async (pageId, params = {}) => {
    try {
      setIsNavigating(true);
      await $w.utils.navigateTo({
        pageId,
        params
      });
    } catch (error) {
      toast({
        title: '导航失败',
        description: '页面跳转失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsNavigating(false);
    }
  };
  const handleExternalLink = url => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return <div style={style} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* 背景粒子效果 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${i * 0.5}s`,
        animationDuration: `${3 + Math.random() * 2}s`
      }} />)}
      </div>

      {/* Navigation - 添加用户头像组件 */}
      <Navigation $w={$w} currentPage="index">
        <UserAvatar $w={$w} className="ml-auto" />
      </Navigation>
      
      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-50"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full mb-6 hover:bg-blue-500/20 transition-all duration-300 hover-lift">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-blue-300 text-sm">探索技术前沿</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-极6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent animate-fade-in-up" style={{
            animationDelay: '0.2s'
          }}>
              Haokir Insights
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed animate-fade-in-up" style={{
            animationDelay: '0.3s'
          }}>
              分享前沿技术见解、编程技巧与个人项目实践
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{
            animationDelay: '0.4s'
          }}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 hover-lift" onClick={() => handleNavigate('blogs')} disabled={isNavigating} isLoading={isNavigating}>
                探索博客
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover-lift" onClick={() => scrollToSection('projects')}>
                查看项目
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section id="blogs" className="py-20 px-6 bg-slate-800/20 backdrop-blur-sm relative">