// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Switch, Label } from '@/components/ui';
// @ts-ignore;
import { Save, Upload, Bold, Italic, Code, Link, Image, List, Quote, Eye, Edit, Copy, Download, ArrowLeft, Tag, BookOpen, Send, FileText, X, Calendar, EyeOff, EyeIcon } from 'lucide-react';

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
export default function MarkdownEditor(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# 欢迎使用Markdown编辑器\n\n这是一个示例内容，开始编写你的博客吧！\n\n## 功能特性\n- 实时预览\n- 代码高亮\n- 图片上传\n- 自动保存\n\n```javascript\nconsole.log(\"Hello, World!\");\n```');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft');
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [activeTab, setActiveTab] = useState('edit');
  const [uploadedImages, setUploadedImages] = useState([]);
 极 const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState(['前端开发', 'TypeScript', 'CSS', 'JavaScript', 'React', 'Vue', 'Node.js']);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputStatus, set极InputStatus] = useState({
    title: 'default',
    content: 'default',
    tags: 'default',
    category: 'default'
  });
  const [inputMessages, setInputMessages] = useState({
    title: '',
    content: '',
    tags: '',
    category: ''
  });
  const [saveStatus, setSaveStatus] = useState('default');
  const [publishStatus, setPublishStatus] = useState('default');
  const [saveMessage, setSaveMessage] = useState('');
  const [publishMessage, setPublishMessage] = useState('');

  // 从URL参数获取文章ID，判断是编辑还是新建
  const postId = $w.page.dataset.params?.id;
  const isNewPost = $w.page.dataset.params?.new === 'true';
  useEffect(() => {
    setIsLoaded(true);
    if (postId && !isNewPost) {
      loadPostData();
    }
    return () => setIsLoaded(false);
  }, [postId, isNewPost]);
  const validateInput = (field, value) => {
    switch (field) {
      case 'title':
        if (!value.trim()) {
          setInputStatus(prev => ({
            ...prev,
            title: 'error'
          }));
          setInputMessages(prev => ({
            ...prev,
            title: '标题不能为空'
          }));
          return false;
        } else if (value.trim().length < 2) {
          setInputStatus(prev => ({
            ...prev,
            title: 'warning'
          }));
          setInputMessages(prev => ({
            ...prev,
            title: '标题太短'
          }));
          return true;
        } else {
          setInputStatus(prev => ({
            ...极prev,
            title: 'success'
          }));
          setInputMessages(prev => ({
            ...prev,
            title: ''
          }));
          return true;
        }
      case 'content':
        if (!value.trim()) {
          setInputStatus(prev => ({
            ...prev,
            content: 'error'
          }));
          setInputMessages(prev => ({
            ...prev,
            content: '内容不能为空'
          }));
          return false;
        } else if (value.trim().length < 10) {
          setInputStatus(prev => ({
            ...prev,
            content: 'warning'
          }));
          setInputMessages(prev => ({
            ...prev,
            content: '内容太短'
          }));
          return true;
        } else {
          setInputStatus(prev => ({
            ...prev,
            content: 'success'
          }));
          setInputMessages(prev => ({
            ...prev,
            content: ''
          }));
          return true;
        }
      case 'tags':
        if (value && !/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
          setInputStatus(prev => ({
            ...prev,
            tags: 'error'
          }));
          setInputMessages(prev => ({
            ...prev,
            tags: '标签只能包含字母、数字和中文'
          }));
          return false;
        } else {
          setInputStatus(prev => ({
            ...prev,
            tags: 'default'
          }));
          setInputMessages(prev => ({
            ...prev,
            tags: ''
          }));
          return true;
        }
      case 'category':
        if (!value) {
          setInputStatus(prev => ({
            ...prev,
            category: 'warning'
          }));
          setInputMessages(prev => (