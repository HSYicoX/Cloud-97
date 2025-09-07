// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, useToast } from '@/components/ui';
// @ts-ignore;
import { Mail, Lock, User, Hash, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

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
    orcid: '',
    nickname: '',
    verificationCode: ''
  });
  const [formStatus, setFormStatus] = useState({
    email: 'default',
    password: 'default',
    username: 'default',
    orcid: 'default',
    verificationCode: 'default'
  });
  const [formMessages, setFormMessages] = useState({
    email: '',
    password: '',
    username: '',
    orcid: '',
    verificationCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('default');
  const [submitMessage, setSubmitMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 验证邮箱格式
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return {
        isValid: false,
        message: '邮箱不能为空'
      };
    }
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        message: '请输入有效的邮箱地址'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // 验证密码强度
  const validatePassword = password => {
    if (!password) {
      return {
        isValid: false,
        message: '密码不能为空'
      };
    }
    if (password.length < 8) {
      return {
        isValid: false,
        message: '密码至少需要8个字符'
      };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return {
        isValid: false,
        message: '密码必须包含大小写字母和数字'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // 验证用户名
  const validateUsername = username => {
    if (!username) {
      return {
        isValid: false,
        message: '用户名不能为空'
      };
    }
    if (username.length < 3) {
      return {
        isValid: false,
        message: '用户名至少需要3个字符'
      };
    }
    if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(username)) {
      return {
        isValid: false,
        message: '用户名只能包含字母、数字、下划线和中文字符'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // 验证ORCID格式
  const validateOrcid = orcid => {
    if (!orcid) return {
      isValid: true,
      message: ''
    };
    const orcidRegex = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    if (!orcidRegex.test(orcid)) {
      return {
        isValid: false,
        message: '请输入有效的ORCID格式（如：0000-0000-0000-0000）'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // 验证验证码
  const validateVerificationCode = code => {
    if (!code) {
      return {
        isValid: false,
        message: '验证码不能为空'
      };
    }
    if (code.length !== 6) {
      return {
        isValid: false,
        message: '验证码必须是6位数字'
      };
    }
    if (!/^\d+$/.test(code)) {
      return {
        isValid: false,
        message: '验证码必须是数字'
      };
    }
    return {
      isValid: true,
      message: ''
    };
  };

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 实时验证
    let validationResult;
    switch (field) {
      case 'email':
        validationResult = validateEmail(value);
        break;
      case 'password':
        validationResult = validatePassword(value);
        break;
      case 'username':
        validationResult = validateUsername(value);
        break;
      case 'orcid':
        validationResult = validateOrcid(value);
        break;
      case 'verificationCode':
        validationResult = validateVerificationCode(value);
        break;
      default:
        validationResult = {
          isValid: true,
          message: ''
        };
    }
    setFormStatus(prev => ({
      ...prev,
      [field]: validationResult.isValid ? 'success' : 'error'
    }));
    setFormMessages(prev => ({
      ...prev,
      [field]: validationResult.message
    }));
  };

  // 发送验证码
  const handleSendVerificationCode = async () => {
    // 先验证邮箱
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      setFormStatus(prev => ({
        ...prev,
        email: 'error'
      }));
      setFormMessages(prev => ({
        ...prev,
        email: emailValidation.message
      }));
      return;
    }
    setIsLoading(true);
    try {
      // 调用腾讯云验证码服务（模拟）
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟发送验证码成功
      setVerificationSent(true);
      setCountdown(60);

      // 启动倒计时
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast({
        title: '验证码已发送',
        description: '验证码已发送到您的邮箱，请查收'
      });
    } catch (error) {
      toast({
        title: '发送失败',
        description: '验证码发送失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 检查用户名是否已存在
  const checkUsernameExists = async username => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_registrations',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                username: {
                  $eq: username
                }
              }]
            }
          },
          select: {
            $master: true
          },
          pageSize: 1
        }
      });
      return result?.records?.length > 0;
    } catch (error) {
      console.error('检查用户名失败:', error);
      return false;
    }
  };

  // 检查邮箱是否已注册
  const checkEmailExists = async email => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_registrations',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $and: [{
                email: {
                  $eq: email
                }
              }]
            }
          },
          select: {
            $master: true
          },
          pageSize: 1
        }
      });
      return result?.records?.length > 0;
    } catch (error) {
      console.error('检查邮箱失败:', error);
      return false;
    }
  };

  // 处理表单提交
  const handleSubmit = async e => {
    e.preventDefault();

    // 验证所有字段
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    const usernameValidation = validateUsername(formData.username);
    const orcidValidation = validateOrcid(formData.orcid);
    const codeValidation = validateVerificationCode(formData.verificationCode);
    if (!emailValidation.isValid || !passwordValidation.isValid || !usernameValidation.isValid || !orcidValidation.isValid || !codeValidation.isValid) {
      setFormStatus({
        email: emailValidation.isValid ? 'success' : 'error',
        password: passwordValidation.isValid ? 'success' : 'error',
        username: usernameValidation.isValid ? 'success' : 'error',
        orcid: orcidValidation.isValid ? 'success' : 'error',
        verificationCode: codeValidation.isValid ? 'success' : 'error'
      });
      setFormMessages({
        email: emailValidation.message,
        password: passwordValidation.message,
        username: usernameValidation.message,
        orcid: orcidValidation.message,
        verificationCode: codeValidation.message
      });
      return;
    }

    // 检查用户名和邮箱是否已存在
    setIsSubmitting(true);
    setSubmitStatus('loading');
    setSubmitMessage('正在检查用户信息...');
    try {
      const [usernameExists, emailExists] = await Promise.all([checkUsernameExists(formData.username), checkEmailExists(formData.email)]);
      if (usernameExists) {
        setFormStatus(prev => ({
          ...prev,
          username: 'error'
        }));
        setFormMessages(prev => ({
          ...prev,
          username: '用户名已被使用'
        }));
        setSubmitStatus('error');
        setSubmitMessage('用户名已被使用，请选择其他用户名');
        return;
      }
      if (emailExists) {
        setFormStatus(prev => ({
          ...prev,
          email: 'error'
        }));
        setFormMessages(prev => ({
          ...prev,
          email: '邮箱已被注册'
        }));
        setSubmitStatus('error');
        setSubmitMessage('邮箱已被注册，请使用其他邮箱或尝试登录');
        return;
      }

      // 验证验证码（模拟验证）
      if (formData.verificationCode !== '123456') {
        // 模拟验证码
        setFormStatus(prev => ({
          ...prev,
          verificationCode: 'error'
        }));
        setFormMessages(prev => ({
          ...prev,
          verificationCode: '验证码错误'
        }));
        setSubmitStatus('error');
        setSubmitMessage('验证码错误，请重新获取');
        return;
      }

      // 创建用户
      setSubmitMessage('正在创建账户...');
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_registrations',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            email: formData.email,
            password: formData.password,
            // 注意：实际应用中应该加密存储
            username: formData.username,
            orcid: formData.orcid || undefined,
            nickname: formData.nickname || formData.username,
            registrationTime: new Date().getTime(),
            lastLoginTime: new Date().getTime(),
            isEmailVerified: false,
            status: 'active',
            loginCount: 1
          }
        }
      });
      setSubmitStatus('success');
      setSubmitMessage('注册成功！正在跳转到登录页面...');
      toast({
        title: '注册成功',
        description: '您的账户已成功创建'
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
      setSubmitStatus('error');
      setSubmitMessage('注册失败，请稍后重试');
      toast({
        title: '注册失败',
        description: error.message || '注册过程中出现错误',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleNavigateBack = () => {
    $w.utils.navigateBack();
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="register" />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* 返回按钮 */}
          <RippleEffect>
            <Button variant="ghost" className="text-slate-300 hover:text-white mb-6 hover-lift click-scale" onClick={handleNavigateBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
          </RippleEffect>

          {/* 注册卡片 */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-white">
                创建账户
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 邮箱输入 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    邮箱账号
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="请输入您的邮箱" className={`bg-slate-700/50 border-slate-600 text-white focus-ring ${formStatus.email === 'error' ? 'input-invalid' : formStatus.email === 'success' ? 'input-valid' : ''}`} disabled={isSubmitting} />
                  <InputFeedback status={formStatus.email} message={formMessages.email} />
                </div>

                {/* 密码输入 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    密码
                  </Label>
                  <Input id="password" type="password" value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="请输入密码（至少8位，包含大小写字母和数字）" className={`bg-slate-700/50 border-slate-600 text-white focus-ring ${formStatus.password === 'error' ? 'input-invalid' : formStatus.password === 'success' ? 'input-valid' : ''}`} disabled={isSubmitting} />
                  <InputFeedback status={formStatus.password} message={formMessages.password} />
                </div>

                {/* 用户名输入 */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-300 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    用户名
                  </Label>
                  <Input id="username" type="text" value={formData.username} onChange={e => handleInputChange('username', e.target.value)} placeholder="请输入用户名（3-20个字符）" className={`bg-slate-700/50 border-slate-600 text-white focus-ring ${formStatus.username === 'error' ? 'input-invalid' : formStatus.username === 'success' ? 'input-valid' : ''}`} disabled={isSubmitting} />
                  <InputFeedback status={formStatus.username} message={formMessages.username} />
                </div>

                {/* ORCID输入 */}
                <div className="space-y-2">
                  <Label htmlFor="orcid" className="text-slate-300 flex items-center">
                    <Hash className="h-4 w-4 mr-2" />
                    ORCID（可选）
                  </Label>
                  <Input id="orcid" type="text" value={formData.orcid} onChange={e => handleInputChange('orcid', e.target.value)} placeholder="例如：0000-0000-0000-0000" className={`bg-slate-700/50 border-slate-600 text-white focus-ring ${formStatus.orcid === 'error' ? 'input-invalid' : formStatus.orcid === 'success' ? 'input-valid' : ''}`} disabled={isSubmitting} />
                  <InputFeedback status={formStatus.orcid} message={formMessages.orcid} />
                </div>

                {/* 验证码区域 */}
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-slate-300 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    验证码
                  </Label>
                  <div className="flex space-x-2">
                    <Input id="verificationCode" type="text" value={formData.verificationCode} onChange={e => handleInputChange('verificationCode', e.target.value)} placeholder="请输入6位验证码" className={`flex-1 bg-slate-700/50 border-slate-600 text-white focus-ring ${formStatus.verificationCode === 'error' ? 'input-invalid' : formStatus.verificationCode === 'success' ? 'input-valid' : ''}`} disabled={isSubmitting || !verificationSent} />
                    <RippleEffect>
                      <Button type="button" onClick={handleSendVerificationCode} disabled={isLoading || countdown > 0 || !formData.email || formStatus.email === 'error'} className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                        {isLoading ? <LoadingSpinner size="sm" /> : countdown > 0 ? `${countdown}s` : '获取验证码'}
                      </Button>
                    </RippleEffect>
                  </div>
                  <InputFeedback status={formStatus.verificationCode} message={formMessages.verificationCode} />
                </div>

                {/* 提交状态提示 */}
                {submitMessage && <FormStatus status={submitStatus} message={submitMessage} />}

                {/* 提交按钮 */}
                <SubmitButton type="submit" isLoading={isSubmitting} isSuccess={submitStatus === 'success'} isError={submitStatus === 'error'} successText="注册成功" errorText="注册失败" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg hover-lift click-scale">
                  注册账户
                </SubmitButton>

                {/* 隐私条款提示 */}
                <p className="text-xs text-slate-400 text-center">
                  点击注册即表示您同意我们的
                  <button type="button" className="text-blue-400 hover:text-blue-300 underline ml-1">
                    服务条款
                  </button>
                  和
                  <button type="button" className="text-blue-400 hover:text-blue-300 underline ml-1">
                    隐私政策
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* 已有账户提示 */}
          <div className="text-center mt-6">
            <p className="text-slate-400">
              已有账户？{' '}
              <button type="button" className="text-blue-400 hover:text-blue-300 underline" onClick={() => $w.utils.navigateTo({
              pageId: 'login',
              params: {}
            })}>
                立即登录
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>;
}