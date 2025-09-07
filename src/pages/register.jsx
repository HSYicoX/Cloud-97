// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, useToast } from '@/components/ui';
// @ts-ignore;
import { Mail, Lock, User, Hash, Shield, CheckCircle, XCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

// @ts-ignore;
import { Navigation } from '@/components/Navigation';
// @ts-ignore;
import { MouseEffects } from '@/components/MouseEffects';
// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
// @ts-ignore;
import { InputFeedback } from '@/components/InputFeedback';
// @ts-ignore;
import { SubmitButton } from '@/components/SubmitButton';
// @ts-ignore;
import { FormStatus } from '@/components/FormStatus';
// @ts-ignore;
import { LoadingSpinner } from '@/components/LoadingSpinner';
export default function RegisterPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    orcid: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputStatus, setInputStatus] = useState({
    email: 'default',
    password: 'default',
    confirmPassword: 'default',
    username: 'default',
    orcid: 'default',
    captcha: 'default'
  });
  const [inputMessages, setInputMessages] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    orcid: '',
    captcha: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [registerStatus, setRegisterStatus] = useState('default');
  const [registerMessage, setRegisterMessage] = useState('');
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return {
        valid: false,
        message: '邮箱不能为空'
      };
    }
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        message: '请输入有效的邮箱地址'
      };
    }
    return {
      valid: true,
      message: ''
    };
  };
  const validatePassword = password => {
    if (!password) {
      return {
        valid: false,
        message: '密码不能为空',
        strength: 0
      };
    }
    if (password.length < 8) {
      return {
        valid: false,
        message: '密码至少需要8个字符',
        strength: 1
      };
    }
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    let message = '';
    if (strength <= 2) {
      message = '密码强度较弱';
    } else if (strength <= 4) {
      message = '密码强度中等';
    } else {
      message = '密码强度强';
    }
    return {
      valid: true,
      message,
      strength
    };
  };
  const validateUsername = username => {
    if (!username) {
      return {
        valid: false,
        message: '用户名不能为空'
      };
    }
    if (username.length < 2) {
      return {
        valid: false,
        message: '用户名至少需要2个字符'
      };
    }
    if (username.length > 20) {
      return {
        valid: false,
        message: '用户名不能超过20个字符'
      };
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return {
        valid: false,
        message: '用户名只能包含字母、数字、下划线和中文字符'
      };
    }
    return {
      valid: true,
      message: ''
    };
  };
  const validateORCID = orcid => {
    if (!orcid) {
      return {
        valid: true,
        message: ''
      };
    }
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    if (!orcidRegex.test(orcid)) {
      return {
        valid: false,
        message: '请输入有效的ORCID格式（XXXX-XXXX-XXXX-XXX）'
      };
    }
    return {
      valid: true,
      message: ''
    };
  };
  const validateCaptcha = code => {
    if (!code) {
      return {
        valid: false,
        message: '请输入验证码'
      };
    }
    if (code.length !== 6) {
      return {
        valid: false,
        message: '验证码必须是6位数字'
      };
    }
    if (!/^\d+$/.test(code)) {
      return {
        valid: false,
        message: '验证码必须是数字'
      };
    }
    return {
      valid: true,
      message: ''
    };
  };
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    let validation;
    switch (field) {
      case 'email':
        validation = validateEmail(value);
        break;
      case 'password':
        validation = validatePassword(value);
        setPasswordStrength(validation.strength || 0);
        break;
      case 'username':
        validation = validateUsername(value);
        break;
      case 'orcid':
        validation = validateORCID(value);
        break;
      default:
        validation = {
          valid: true,
          message: ''
        };
    }
    setInputStatus(prev => ({
      ...prev,
      [field]: validation.valid ? 'success' : 'error'
    }));
    setInputMessages(prev => ({
      ...prev,
      [field]: validation.message
    }));
  };
  const handleConfirmPasswordChange = value => {
    setConfirmPassword(value);
    const validation = value === formData.password ? {
      valid: true,
      message: ''
    } : {
      valid: false,
      message: '密码不一致'
    };
    setInputStatus(prev => ({
      ...prev,
      confirmPassword: validation.valid ? 'success' : 'error'
    }));
    setInputMessages(prev => ({
      ...prev,
      confirmPassword: validation.message
    }));
  };
  const handleCaptchaChange = value => {
    setCaptchaCode(value);
    const validation = validateCaptcha(value);
    setInputStatus(prev => ({
      ...prev,
      captcha: validation.valid ? 'success' : 'error'
    }));
    setInputMessages(prev => ({
      ...prev,
      captcha: validation.message
    }));
  };
  const sendCaptcha = async () => {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      setInputStatus(prev => ({
        ...prev,
        email: 'error'
      }));
      setInputMessages(prev => ({
        ...prev,
        email: emailValidation.message
      }));
      toast({
        title: '验证失败',
        description: '请先输入有效的邮箱地址',
        variant: 'destructive'
      });
      return;
    }
    try {
      // 模拟发送验证码
      toast({
        title: '验证码已发送',
        description: `验证码已发送到 ${formData.email}，请查收`
      });
      // 这里应该调用腾讯云验证码API
      // await $w.cloud.callFunction({
      //   name: 'sendCaptcha',
      //   data: { email: formData.email }
      // });
    } catch (error) {
      toast({
        title: '发送失败',
        description: '验证码发送失败，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleRegister = async () => {
    // 验证所有字段
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const usernameValidation = validateUsername(formData.username);
    const orcidValidation = validateORCID(formData.orcid);
    const captchaValidation = validateCaptcha(captchaCode);
    const confirmValidation = confirmPassword === formData.password ? {
      valid: true,
      message: ''
    } : {
      valid: false,
      message: '密码不一致'
    };
    if (!emailValidation.valid || !passwordValidation.valid || !usernameValidation.valid || !orcidValidation.valid || !captchaValidation.valid || !confirmValidation.valid) {
      setInputStatus({
        email: emailValidation.valid ? 'success' : 'error',
        password: passwordValidation.valid ? 'success' : 'error',
        confirmPassword: confirmValidation.valid ? 'success' : 'error',
        username: usernameValidation.valid ? 'success' : 'error',
        orcid: orcidValidation.valid ? 'success' : 'error',
        captcha: captchaValidation.valid ? 'success' : 'error'
      });
      setInputMessages({
        email: emailValidation.message,
        password: passwordValidation.message,
        confirmPassword: confirmValidation.message,
        username: usernameValidation.message,
        orcid: orcidValidation.message,
        captcha: captchaValidation.message
      });
      toast({
        title: '验证失败',
        description: '请检查表单填写是否正确',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsLoading(true);
      setRegisterStatus('loading');
      setRegisterMessage('正在注册账号...');
      // 创建用户数据
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        // 注意：实际应用中应该加密存储
        orcid: formData.orcid || '',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        bio: '',
        blogCount: 0,
        favoriteCount: 0,
        repositoryCount: 0,
        totalFollowers: 0,
        totalLikes: 0,
        totalPosts: 0,
        totalViews: 0,
        location: '',
        website: '',
        notificationSettings: {
          commentNotifications: true,
          followerNotifications: true,
          marketingEmails: false
        },
        privacySettings: {
          publicProfile: true,
          showEmail: false
        },
        monthlyStats: [],
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      // 保存用户数据到数据库
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'users',
        methodName: 'wedaCreateV2',
        params: {
          data: userData
        }
      });
      setRegisterStatus('success');
      setRegisterMessage('注册成功！正在跳转到登录页面...');
      toast({
        title: '注册成功',
        description: '账号已成功创建，请登录使用'
      });
      // 3秒后跳转到登录页面
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'login',
          params: {}
        });
      }, 3000);
    } catch (error) {
      console.error('注册失败:', error);
      setRegisterStatus('error');
      setRegisterMessage('注册失败：邮箱可能已被使用');
      toast({
        title: '注册失败',
        description: error.message || '注册失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleNavigateBack = () => {
    $w.utils.navigateBack();
  };
  const getInputClass = field => {
    const baseClass = 'bg-slate-700/50 border-slate-600 text-white focus-ring pr-10';
    const statusClass = {
      default: '',
      success: 'input-valid',
      error: 'input-invalid',
      warning: 'input-warning'
    }[inputStatus[field]];
    return `${baseClass} ${statusClass}`;
  };
  const getPasswordStrengthColor = strength => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  const getPasswordStrengthText = strength => {
    if (strength <= 2) return '弱';
    if (strength <= 4) return '中';
    return '强';
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 relative">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="register" />
      
      <div className="container mx-auto max-w-md pt-16">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <RippleEffect>
            <Button variant="ghost" className="text-slate-300 hover:text-white absolute left-4 top-20 hover-lift click-scale" onClick={handleNavigateBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
          </RippleEffect>
          <h1 className="text-3xl font-bold text-white mb-2">创建账号</h1>
          <p className="text-slate-400">加入我们，开始您的技术之旅</p>
        </div>

        {/* Register Form */}
        <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in-up">
          <CardContent className="p-6">
            <form onSubmit={e => e.preventDefault()} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">邮箱地址</Label>
                <div className="relative">
                  <Input id="email" type="email" placeholder="请输入邮箱地址" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className={getInputClass('email')} disabled={isLoading} />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <InputFeedback status={inputStatus.email} message={inputMessages.email} />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">密码</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="请输入密码（至少8位）" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} className={getInputClass('password')} disabled={isLoading} />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <RippleEffect>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white click-scale" disabled={isLoading}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </RippleEffect>
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                {formData.password && <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">密码强度</span>
                      <span className={`text-xs ${getPasswordStrengthColor(passwordStrength)} text-white px-2 py-1 rounded`}>
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div className={`h-1 rounded-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`} style={{
                    width: `${passwordStrength / 5 * 100}%`
                  }} />
                    </div>
                  </div>}
                <InputFeedback status={inputStatus.password} message={inputMessages.password} />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">确认密码</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="请再次输入密码" value={confirmPassword} onChange={e => handleConfirmPasswordChange(e.target.value)} className={getInputClass('confirmPassword')} disabled={isLoading} />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <RippleEffect>
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-white click-scale" disabled={isLoading}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </RippleEffect>
                    <Shield className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <InputFeedback status={inputStatus.confirmPassword} message={inputMessages.confirmPassword} />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">用户名</Label>
                <div className="relative">
                  <Input id="username" type="text" placeholder="请输入用户名（2-20个字符）" value={formData.username} onChange={e => handleInputChange('username', e.target.value)} className={getInputClass('username')} disabled={isLoading} />
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <InputFeedback status={inputStatus.username} message={inputMessages.username} />
              </div>

              {/* ORCID (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="orcid" className="text-slate-300">
                  ORCID <span className="text-slate-500 text-sm">（可选）</span>
                </Label>
                <div className="relative">
                  <Input id="orcid" type="text" placeholder="XXXX-XXXX-XXXX-XXX" value={formData.orcid} onChange={e => handleInputChange('orcid', e.target.value)} className={getInputClass('orcid')} disabled={isLoading} />
                  <Hash className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
                <InputFeedback status={inputStatus.orcid} message={inputMessages.orcid} />
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-slate-300">验证码</Label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Input id="captcha" type="text" placeholder="请输入6位验证码" value={captchaCode} onChange={e => handleCaptchaChange(e.target.value)} className={getInputClass('captcha')} disabled={isLoading} maxLength={6} />
                    <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  <RippleEffect>
                    <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 whitespace-nowrap click-scale" onClick={sendCaptcha} disabled={isLoading}>
                      获取验证码
                    </Button>
                  </RippleEffect>
                </div>
                <InputFeedback status={inputStatus.captcha} message={inputMessages.captcha} />
              </div>

              {/* Form Status */}
              {registerStatus !== 'default' && <FormStatus status={registerStatus} message={registerMessage} className="mt-4" />}

              {/* Submit Button */}
              <div className="pt-4">
                <SubmitButton isLoading={isLoading} isSuccess={registerStatus === 'success'} isError={registerStatus === 'error'} successText="注册成功" errorText="注册失败" onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg click-scale" disabled={isLoading}>
                  注册账号
                </SubmitButton>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-4 border-t border-slate-700/50">
              <p className="text-slate-400 text-sm">
                已有账号？{' '}
                <RippleEffect>
                  <button type="button" onClick={() => $w.utils.navigateTo({
                  pageId: 'login',
                  params: {}
                })} className="text-blue-400 hover:text-blue-300 underline click-scale" disabled={isLoading}>
                    立即登录
                  </button>
                </RippleEffect>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}