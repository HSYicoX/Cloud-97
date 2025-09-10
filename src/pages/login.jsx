// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, useToast } from '@/components/ui';
// @ts-ignore;
import { LogIn, Loader2 } from 'lucide-react';

export default function LoginPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await $w.cloud.callFunction({
        name: 'auth/login',
        data: {
          email,
          password
        }
      });
      if (result.success) {
        // 前端存储短期accessToken
        sessionStorage.setItem('accessToken', result.accessToken);

        // 刷新票据由后端通过Set-Cookie自动设置
        toast({
          title: '登录成功',
          description: '正在跳转到首页...',
          variant: 'default'
        });

        // 跳转到首页
        await $w.utils.navigateTo({
          pageId: 'index'
        });
      } else {
        throw new Error(result.message || '登录失败');
      }
    } catch (error) {
      toast({
        title: '登录失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">用户登录</h1>
          <p className="mt-2 text-slate-400">请输入您的账号密码</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                电子邮箱
              </label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" placeholder="your@email.com" />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                密码
              </label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="bg-slate-800/50 border-slate-700 text-white" placeholder="••••••••" />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </> : <>
                  <LogIn className="mr-2 h-4 w-4" />
                  登录
                </>}
            </Button>
          </div>
        </form>
      </div>
    </div>;
}