// @ts-ignore;
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, useToast } from '@/components/ui';
// @ts-ignore;
import { Github, ArrowRight, Sparkles, Cpu, Shield, Zap, Globe } from 'lucide-react';

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
  const [isNavigating, setIsNavigating] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    transactions: 0,
    nodes: 0,
    countries: 0
  });
  const particlesCreated = useRef(false);

  // 粒子效果
  useEffect(() => {
    if (particlesCreated.current) return;
    particlesCreated.current = true;
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = `${Math.random() * 5 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.background = Math.random() > 0.5 ? 'rgba(0, 247, 255, 0.5)' : 'rgba(255, 0, 230, 0.5)';
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      document.body.appendChild(particle);
      animateParticle(particle);
    };
    const animateParticle = particle => {
      let x = parseFloat(particle.style.left);
      let y = parseFloat(particle.style.top);
      let xSpeed = (Math.random() - 0.5) * 0.2;
      let ySpeed = (Math.random() - 0.5) * 0.2;
      const move = () => {
        x += xSpeed;
        y += ySpeed;
        if (x > 100 || x < 0) xSpeed *= -1;
        if (y > 100 || y < 0) ySpeed *= -1;
        particle.style.left = `${x}vw`;
        particle.style.top = `${y}vh`;
        requestAnimationFrame(move);
      };
      move();
    };
    for (let i = 0; i < 30; i++) {
      createParticle();
    }
  }, []);

  // 数字动画
  useEffect(() => {
    const animateValue = (start, end, duration, callback) => {
      let startTimestamp = null;
      const step = timestamp => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        callback(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };
    animateValue(0, 12500, 2000, val => setStats(prev => ({
      ...prev,
      users: val
    })));
    animateValue(0, 8400000, 2500, val => setStats(prev => ({
      ...prev,
      transactions: val
    })));
    animateValue(0, 3200, 1800, val => setStats(prev => ({
      ...prev,
      nodes: val
    })));
    animateValue(0, 92, 1500, val => setStats(prev => ({
      ...prev,
      countries: val
    })));
  }, []);
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
      {/* 背景元素 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-50"></div>
        <div className="absolute inset-0 bg-[length:50px_50px] bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 opacity-20"></div>
      </div>

      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="index" />
      
      {/* 用户头像菜单 */}
      <div className="fixed top-4 right-4 z-50">
        <UserAvatarMenu $w={$w} currentUser={$w.auth.currentUser || {}} />
      </div>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 animate-fade-in" style={{
            animationDelay: '0.1s'
          }}>
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/30 rounded-full mb-6 hover:bg-blue-500/20 transition-all duration-300 hover:scale-105">
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
              <Button className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25" onClick={() => handleNavigate('blogs')} disabled={isNavigating}>
                <span className="relative z-10 flex items-center">
                  探索博客
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-6 text-lg rounded-xl transition-all duration-300 hover:scale-105" onClick={() => document.getElementById('projects')?.scrollIntoView({
              behavior: 'smooth'
            })}>
                查看项目
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">核心技术</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              我们采用最前沿的技术栈，为您提供卓越体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-slate-800/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <Cpu className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">AI 集成</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">
                  先进的人工智能技术，能够学习和适应您的需求
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800/70 backdrop-blur-md border border-purple-500/30 hover:border-purple-500/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">区块链安全</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">
                  军事级加密，由去中心化区块链技术提供支持
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/70 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-cyan-500/20">
              <CardHeader className="flex flex-row items-center space-x-4">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">闪电速度</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-300">
                  优化性能，实现近乎即时的响应时间
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 backdrop-blur-sm border-y border-cyan-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-cyan-400">
                {stats.users.toLocaleString()}
              </div>
              <div className="text-slate-300">活跃用户</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-purple-400">
                {stats.transactions.toLocaleString()}
              </div>
              <div className="text-slate-300">交易量</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-cyan-400">
                {stats.nodes.toLocaleString()}
              </div>
              <div className="text-slate-300">在线节点</div>
            </div>
            <div className="stat-item">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-purple-400">
                {stats.countries.toLocaleString()}
              </div>
              <div className="text-slate-300">覆盖国家</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">开源项目</h2>
            <p className="text-slate-400 text-lg mb-12">
              探索我在GitHub上的开源项目和技术实践
            </p>

            <Card className="p-8 bg-slate-800/70 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-500/70 transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row items-center justify-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
                <Github className="h-12 w-12 text-white" />
                <div>
                  <h3 className="text-xl font-bold text-white">GitHub仓库</h3>
                  <p className="text-slate-400">@haokir</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                包含React组件库、工具函数、学习笔记和各种有趣的技术实验项目
              </p>
              
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25" onClick={() => handleExternalLink('https://github.com/haokir')}>
                访问GitHub
                <Github className="ml-2 h-5 w-5" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 py-12 px-6 relative z-10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-lg font-bold text-white">Haokir Insights</span>
          </div>
          <p className="text-slate-400 mb-6">分享技术见解，探索编程之美</p>
          <div className="flex justify-center space-x-6">
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
          <p className="text-slate-500 text-sm mt-6">© {new Date().getFullYear()} Haokir Insights. 保留所有权利。</p>
        </div>
      </footer>
    </div>;
}