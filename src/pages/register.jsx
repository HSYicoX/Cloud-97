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

// 生成十位数唯一用户ID
const generateUserId = () => {
  const timestamp = Date.now().toString().slice(-6); // 取时间戳后6位
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4位随机数
  return timestamp + random; // 组合成10位ID
};

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
 极 const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [极isLoading, setIsLoading] = useState(false);
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
      }