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
import { UserAvatarMenu } from '@/components/UserAvatarMenu';
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

  // 获取当前用户信息
  const currentUser = $w.auth.currentUser || {};
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

      {/* Navigation */}
      <Navigation $w={$w} currentPage="index" />
      
      {/* 用户头像菜单 */}
      <div className="fixed top-4 right-4 z-50">
        <UserAvatarMenu $w={$w} currentUser={currentUser} />
      </div>

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
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent animate-fade-in-up" style={{
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-30"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-16 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">特色博客</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              精选技术文章，涵盖前端开发、TypeScript、CSS等热门话题
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBlogs.map((blog, index) => <Card key={blog.id} hoverable clickable className="group animate-fade-in-up glass-dark" style={{
            animationDelay: `${0.2 + index * 0.1}s`
          }} onClick={() => handleNavigate('blog', {
            id: blog.id
          })}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full hover:bg-blue-500/20 transition-colors duration-200">
                      {blog.category}
                    </span>
                    <span className="text-xs text-slate-400">{blog.date}</span>
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-300 transition-colors duration-200">
                    {blog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300 mb-4">
                    {blog.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{blog.readTime}</span>
                    <ArrowRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center mt-12 animate-fade-in" style={{
          animationDelay: '0.5s'
        }}>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover-lift" onClick={() => handleNavigate('blogs')} disabled={isNavigating} isLoading={isNavigating}>
              查看所有博客
            </Button>
          </div>
        </div>
      </section>

      {/* GitHub Projects Section */}
      <section id="projects" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 opacity-40"></div>
        <div className="container mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white animate-fade-in">个人仓库</h2>
            <p className="text-slate-400 text-lg mb-12 animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              探索我在GitHub上的开源项目和技术实践
            </p>

            <Card hoverable className="p-8 group glass-dark animate-scale-in" style={{
            animationDelay: '0.2s'
          }}>
              <div className="flex items-center justify-center mb-6">
                <Github className="h-12 w-12 text-white mr-4 group-hover:text-blue-400 transition-colors duration-200" />
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">GitHub仓库</h3>
                  <p className="text-slate-400">@haokir</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                包含React组件库、工具函数、学习笔记和各种有趣的技术实验项目
              </p>
              
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 animate-bounce hover-lift" onClick={() => handleExternalLink('https://github.com/haokir')}>
                访问GitHub
                <Github className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 py-12 px-6 relative">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4 animate-fade-in">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-lg font-bold text-white">Haokir Insights</span>
          </div>
          <p className="text-slate-400 mb-6 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>分享技术见解，探索编程之美</p>
          <div className="flex justify-center space-x-6 animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <button className="text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">
              隐私政策
            </button>
            <button className="text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">
              服务条款
            </button>
            <button className="text-slate-400 hover:text-white transition-all duration-200 hover:scale-105">
              联系我们
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6 animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>© 2024 Haokir Insights. 保留所有权利。</p>
        </div>
      </footer>
    </div>;
}