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
const generateUniqueUserId = () => {
  const timestamp = Date.now().toString().slice(-6); // 取时间戳后6位
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // 4位随机数
  return timestamp + random; // 总共10位数字
};

// 检查用户ID是否唯一
const checkUserIdUnique = async ($w, userId) => {
  try {
    const result = await $w.cloud.callDataSource({
      dataSourceName: 'users',
      methodName: 'wedaGetRecordsV2',
      params: {
        filter: {
          where: {
            userId: {
              $eq: userId
            }
          }
        },
        select: {
          $master: true
        },
        pageSize: 1,
        pageNumber: 1
      }
    });
    return result.records.length === 0;
  } catch (error) {
    console.error('检查用户ID唯一性失败:', error);
    return false;
  }
};

// 生成唯一用户ID（重试机制）
const generateUniqueUserIdWithRetry = async ($w, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    const userId = generateUniqueUserId();
    const isUnique = await checkUserIdUnique($w, userId);
    if (isUnique) {
      return userId;
    }
  }
  throw new Error('无法生成唯一用户ID，请稍后重试');
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [inputStatus, setInputStatus] = useState({
    email: 'default',
    password: 'default',
    confirmPassword极狐 : 'default',
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