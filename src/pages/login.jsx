// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Input, useToast, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui';
// @ts-ignore;
import { Eye, EyeOff, LogIn, User, Mail, Lock } from 'lucide-react';

// @ts-ignore;
import { useForm } from 'react-hook-form';
// @ts-ignore;
import { Navigation } from '@/components/Navigation';
// @ts-ignore;
import { MouseEffects } from '@/components/MouseEffects';
// @ts-ignore;
import { BackgroundParticles } from '@/components/BackgroundParticles';
// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
// @ts-ignore;
import { LoadingSpinner } from '@/components/LoadingSpinner';
const validateForm = values => {
  const errors = {};
  if (!values.identifier || values.identifier.trim() === '') {
    errors.identifier = '请输入用户名或邮箱';
  } else if (values.identifier.length > 100) {
    errors.identifier = '用户名或邮箱过长';
  }
  if (!values.password || values.password.length < 6) {
    errors.password = '密码至少6位字符';
  } else if (values.password.length > 50) {
    errors.password = '密码过长';
  }
  return errors;
};
export default function LoginPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });
  const onSubmit = async values => {
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach(key => {
        form.setError(key, {
          type: 'manual',
          message: errors[key]
        });
      });
      return;
    }
    try {
      setIsLoading(true);
      const users = await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $or: [{
                username: {
                  $eq: values.identifier
                }
              }, {
                email: {
                  $eq: values.identifier
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
      if (users.records.length === 0) {
        throw new Error('用户不存在，请检查用户名或邮箱');
      }
      const user = users.records[0];
      if (user.password !== values.password) {
        throw new Error('密码错误，请重新输入');
      }
      toast({
        title: '登录成功',
        description: `欢迎回来，${user.username || user.email}!`,
        variant: 'default'
      });
      setTimeout(() => {
        $w.utils.redirectTo({
          pageId: 'index',
          params: {}
        });
      }, 1000);
    } catch (error) {
      console.error('登录失败:', error);
      toast({
        title: '登录失败',
        description: error.message || '请检查用户名和密码',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleRegister = () => {
    $w.utils.navigateTo({
      pageId: 'register',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <BackgroundParticles />
      <MouseEffects />
      <Navigation $w={$w} currentPage="login" />
      
      <div className="container mx-auto px-4 py-8 pt-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
              <p className="text-slate-400">请输入您的账号信息登录系统</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField control={form.control} name="identifier" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-slate-300 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        用户名或邮箱
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input {...field} placeholder="请输入用户名或邮箱" className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus" disabled={isLoading} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <FormField control={form.control} name="password" render={({
                field
              }) => <FormItem>
                      <FormLabel className="text-slate-300 flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        密码
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input {...field} type={showPassword ? 'text' : 'password'} placeholder="请输入密码" className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent input-focus" disabled={isLoading} />
                          <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>} />

                <RippleEffect>
                  <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover-lift">
                    {isLoading ? <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        登录中...
                      </> : <>
                        <LogIn className="h-5 w-5 mr-2" />
                        登录
                      </>}
                  </Button>
                </RippleEffect>
              </form>
            </Form>

            <div className="text-center mt-6 pt-6 border-t border-slate-700/50">
              <p className="text-slate-400">
                还没有账号？{' '}
                <button onClick={handleRegister} disabled={isLoading} className="text-blue-400 hover:text-blue-300 underline transition-colors font-medium">
                  立即注册
                </button>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-slate-500 text-sm">
              登录系统连接到用户数据模型，支持用户名或邮箱登录
            </p>
          </div>
        </div>
      </div>
    </div>;
}