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
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState(['前端开发', 'TypeScript', 'CSS', 'JavaScript', 'React', 'Vue', 'Node.js']);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputStatus, setInputStatus] = useState({
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
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState('');

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

  // 加载文章数据
  const loadPostData = async () => {
    setIsLoading(true);
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'blog_posts',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              $and: [{
                _id: {
                  $eq: postId
                }
              }]
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setTitle(result.title || '');
        setContent(result.content || '');
        setTags(result.tags || []);
        setCategory(result.category || '');
        setExcerpt(result.excerpt || '');
        setStatus(result.status || 'draft');
        setIsPublished(result.isPublished || false);
        setCoverImage(result.coverImage || '');
        setCoverPreview(result.coverImage || '');
        setUploadedCoverImageUrl(result.coverImage || '');
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载文章数据',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 验证输入
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
            ...prev,
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
          setInputMessages(prev => ({
            ...prev,
            category: '请选择分类'
          }));
          return false;
        } else {
          setInputStatus(prev => ({
            ...prev,
            category: 'success'
          }));
          setInputMessages(prev => ({
            ...prev,
            category: ''
          }));
          return true;
        }
      default:
        return true;
    }
  };

  // 添加标签
  const handleAddTag = () => {
    if (tagInput.trim() && validateInput('tags', tagInput)) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  // 移除标签
  const handleRemoveTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 处理标签输入
  const handleTagInput = e => {
    setTagInput(e.target.value);
    validateInput('tags', e.target.value);
  };

  // 处理标题变化
  const handleTitleChange = e => {
    setTitle(e.target.value);
    validateInput('title', e.target.value);
  };

  // 处理内容变化
  const handleContentChange = e => {
    setContent(e.target.value);
    validateInput('content', e.target.value);
  };

  // 处理分类变化
  const handleCategoryChange = value => {
    setCategory(value);
    validateInput('category', value);
  };

  // 处理摘要变化
  const handleExcerptChange = e => {
    setExcerpt(e.target.value);
  };

  // 处理状态变化
  const handleStatusChange = checked => {
    setIsPublished(checked);
    setStatus(checked ? 'published' : 'draft');
  };

  // 上传图片到云存储
  const uploadImageToCloud = async file => {
    try {
      const tcb = await $w.cloud.getCloudInstance();
      const timestamp = new Date().getTime();
      const fileName = `blog-covers/${timestamp}-${file.name}`;
      const uploadResult = await tcb.uploadFile({
        cloudPath: fileName,
        filePath: file
      });
      if (uploadResult.fileID) {
        const tempUrlResult = await tcb.getTempFileURL({
          fileList: [uploadResult.fileID]
        });
        if (tempUrlResult.fileList && tempUrlResult.fileList[0]) {
          return tempUrlResult.fileList[0].tempFileURL;
        }
      }
      return null;
    } catch (error) {
      console.error('图片上传失败:', error);
      throw new Error('图片上传失败');
    }
  };

  // 处理封面图片选择
  const handleCoverImageSelect = async e => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: '文件类型错误',
          description: '请选择图片文件',
          variant: 'destructive'
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: '文件过大',
          description: '请选择小于5MB的图片',
          variant: 'destructive'
        });
        return;
      }

      // 显示预览
      const reader = new FileReader();
      reader.onload = e => {
        setCoverPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // 上传到云存储
      try {
        setIsLoading(true);
        const imageUrl = await uploadImageToCloud(file);
        if (imageUrl) {
          setCoverImage(imageUrl);
          setUploadedCoverImageUrl(imageUrl);
          toast({
            title: '上传成功',
            description: '封面图片已上传',
            variant: 'default'
          });
        }
      } catch (error) {
        console.error('封面图片上传失败:', error);
        toast({
          title: '上传失败',
          description: error.message || '封面图片上传失败',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 移除封面图片
  const handleRemoveCoverImage = () => {
    setCoverImage('');
    setCoverPreview('');
    setUploadedCoverImageUrl('');
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    // 验证必填字段
    const isTitleValid = validateInput('title', title);
    const isContentValid = validateInput('content', content);
    if (!isTitleValid || !isContentValid) {
      toast({
        title: '验证失败',
        description: '请检查必填字段',
        variant: 'destructive'
      });
      return;
    }
    setIsSaving(true);
    setSaveStatus('loading');
    setSaveMessage('正在保存草稿...');
    try {
      const currentUser = $w.auth.currentUser;
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        category: category,
        excerpt: excerpt.trim(),
        status: 'draft',
        isPublished: false,
        isDraft: true,
        coverImage: uploadedCoverImageUrl,
        author: {
          name: currentUser?.name || '匿名用户',
          avatarUrl: currentUser?.avatarUrl || ''
        },
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      let result;
      if (postId && !isNewPost) {
        // 更新现有文章
        result = await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaUpdateV2',
          params: {
            data: postData,
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: postId
                  }
                }]
              }
            }
          }
        });
        console.log('更新草稿成功:', result);
      } else {
        // 创建新文章
        result = await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaCreateV2',
          params: {
            data: postData
          }
        });
        console.log('创建草稿成功:', result);
      }
      setSaveStatus('success');
      setSaveMessage('草稿保存成功！');
      toast({
        title: '保存成功',
        description: '文章已保存为草稿',
        variant: 'default'
      });

      // 如果是新文章，更新URL参数
      if (isNewPost && result && result.id) {
        $w.utils.navigateTo({
          pageId: 'editor',
          params: {
            id: result.id,
            new: 'false'
          }
        });
      }
    } catch (error) {
      console.error('保存草稿失败:', error);
      setSaveStatus('error');
      setSaveMessage('保存失败，请重试');
      toast({
        title: '保存失败',
        description: error.message || '保存过程中出现错误',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 发布文章
  const handlePublish = async () => {
    // 验证所有必填字段
    const isTitleValid = validateInput('title', title);
    const isContentValid = validateInput('content', content);
    const isCategoryValid = validateInput('category', category);
    if (!isTitleValid || !isContentValid || !isCategoryValid) {
      toast({
        title: '验证失败',
        description: '请检查所有必填字段',
        variant: 'destructive'
      });
      return;
    }
    setIsPublishing(true);
    setPublishStatus('loading');
    setPublishMessage('正在发布文章...');
    try {
      const currentUser = $w.auth.currentUser;
      const postData = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        category: category,
        excerpt: excerpt.trim(),
        status: 'published',
        isPublished: true,
        isDraft: false,
        coverImage: uploadedCoverImageUrl,
        author: {
          name: currentUser?.name || '匿名用户',
          avatarUrl: currentUser?.avatarUrl || ''
        },
        publishedAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      let result;
      if (postId && !isNewPost) {
        // 更新现有文章
        result = await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaUpdateV2',
          params: {
            data: postData,
            filter: {
              where: {
                $and: [{
                  _id: {
                    $eq: postId
                  }
                }]
              }
            }
          }
        });
        console.log('更新发布成功:', result);
      } else {
        // 创建新文章
        result = await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaCreateV2',
          params: {
            data: postData
          }
        });
        console.log('创建发布成功:', result);
      }
      setPublishStatus('success');
      setPublishMessage('文章发布成功！');
      toast({
        title: '发布成功',
        description: '文章已成功发布',
        variant: 'default'
      });

      // 跳转到博客列表页面
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'blog',
          params: {}
        });
      }, 2000);
    } catch (error) {
      console.error('发布文章失败:', error);
      setPublishStatus('error');
      setPublishMessage('发布失败，请重试');
      toast({
        title: '发布失败',
        description: error.message || '发布过程中出现错误',
        variant: 'destructive'
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // 返回上一页
  const handleBack = () => {
    $w.utils.navigateBack();
  };

  // 渲染Markdown预览
  const renderMarkdownPreview = () => {
    // 简单的Markdown渲染逻辑
    const html = content.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>').replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mb-3">$1</h2>').replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mb-2">$1</h3>').replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-slate-400 mb-4">$1</blockquote>').replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>').replace(/\*(.*)\*/gim, '<em class="italic">$1</em>').replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" class="rounded-lg my-4 max-w-full" />').replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>').replace(/\n/gim, '<br />').replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre class="bg-slate-800 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm">$2</code></pre>').replace(/`([^`]+)`/gim, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>').replace(/\-\s(.*$)/gim, '<li class="ml-4">$1</li>').replace(/(\<li.*\>.*\<\/li\>)/gim, '<ul class="list-disc pl-6 mb-4">$1</ul>');
    return {
      __html: html
    };
  };
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <LoadingSpinner size="xl" text="加载文章中..." />
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="editor" />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* 返回按钮 */}
          <RippleEffect>
            <Button variant="ghost" className="text-slate-300 hover:text-white mb-6 hover-lift click-scale" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
          </RippleEffect>

          {/* 编辑器卡片 */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                {isNewPost ? '新建文章' : '编辑文章'}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {/* 基本信息表单 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 左侧表单 */}
                <div className="space-y-4">
                  {/* 标题 */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">
                      文章标题
                    </Label>
                    <Input id="title" value={title} onChange={handleTitleChange} placeholder="请输入文章标题" className={`bg-slate-700/50 border-slate-600 text-white focus-ring ${inputStatus.title === 'error' ? 'input-invalid' : inputStatus.title === 'success' ? 'input-valid' : ''}`} />
                    <InputFeedback status={inputStatus.title} message={inputMessages.title} />
                  </div>

                  {/* 分类 */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-slate-300">
                      文章分类
                    </Label>
                    <Select value={category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={`bg-slate-700/50 border-slate-600 text-white ${inputStatus.category === 'error' ? 'input-invalid' : inputStatus.category === 'success' ? 'input-valid' : ''}`}>
                        <SelectValue placeholder="选择文章分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <InputFeedback status={inputStatus.category} message={inputMessages.category} />
                  </div>

                  {/* 标签 */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-slate-300">
                      文章标签
                    </Label>
                    <div className="flex space-x-2">
                      <Input id="tags" value={tagInput} onChange={handleTagInput} onKeyPress={e => e.key === 'Enter' && handleAddTag()} placeholder="输入标签后按回车" className={`flex-1 bg-slate-700/50 border-slate-600 text-white ${inputStatus.tags === 'error' ? 'input-invalid' : ''}`} />
                      <RippleEffect>
                        <Button onClick={handleAddTag} className="bg-blue-600 hover:bg-blue-700">
                          添加
                        </Button>
                      </RippleEffect>
                    </div>
                    <InputFeedback status={inputStatus.tags} message={inputMessages.tags} />
                    
                    {/* 标签显示 */}
                    {tags.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map(tag => <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 flex items-center">
                            {tag}
                            <button onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-blue-200">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>)}
                      </div>}
                  </div>
                </div>

                {/* 右侧表单 */}
                <div className="space-y-4">
                  {/* 封面图片 */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">封面图片</Label>
                    {coverPreview ? <div className="relative">
                        <img src={coverPreview} alt="封面预览" className="w-full h-32 object-cover rounded-lg" />
                        <RippleEffect>
                          <button onClick={handleRemoveCoverImage} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full">
                            <X className="h-4 w-4" />
                          </button>
                        </RippleEffect>
                      </div> : <RippleEffect>
                        <button onClick={() => coverImageInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-300 hover:border-slate-500 transition-colors">
                          <Image className="h-8 w-8 mr-2" />
                          选择封面图片
                        </button>
                      </RippleEffect>}
                    <input ref={coverImageInputRef} type="file" accept="image/*" onChange={handleCoverImageSelect} className="hidden" />
                    {isLoading && <div className="text-sm text-slate-400">图片上传中...</div>}
                  </div>

                  {/* 发布状态 */}
                  <div className="flex items-center space-x-2">
                    <Switch id="publish-status" checked={isPublished} onCheckedChange={handleStatusChange} />
                    <Label htmlFor="publish-status" className="text-slate-300">
                      立即发布
                    </Label>
                    <Badge variant={isPublished ? "default" : "secondary"} className="ml-2">
                      {isPublished ? '已发布' : '草稿'}
                    </Badge>
                  </div>

                  {/* 文章摘要 */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-slate-300">
                      文章摘要（可选）
                    </Label>
                    <Textarea id="excerpt" value={excerpt} onChange={handleExcerptChange} placeholder="输入文章摘要，用于SEO和列表展示" className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]" />
                  </div>
                </div>
              </div>

              {/* 编辑/预览选项卡 */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50">
                  <TabsTrigger value="edit" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                    <Edit className="h-4 w-4 mr-2" />
                    编辑
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                    <Eye className="h-4 w-4 mr-2" />
                    预览
                  </TabsTrigger>
                </TabsList>

                {/* 编辑选项卡 */}
                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-slate-300">
                      文章内容（Markdown格式）
                    </Label>
                    <Textarea id="content" value={content} onChange={handleContentChange} placeholder="开始编写你的文章内容，支持Markdown语法..." className={`bg-slate-700/50 border-slate-600 text-white min-h-[400px] font-mono text-sm ${inputStatus.content === 'error' ? 'input-invalid' : inputStatus.content === 'success' ? 'input-valid' : ''}`} />
                    <InputFeedback status={inputStatus.content} message={inputMessages.content} />
                  </div>
                </TabsContent>

                {/* 预览选项卡 */}
                <TabsContent value="preview" className="mt-4">
                  <div className="bg-slate-800/50 rounded-lg p-6 min-h-[400px]">
                    <h3 className="text-lg font-semibold text-slate-300 mb-4">文章预览</h3>
                    <div className="prose prose-invert prose-slate max-w-none" dangerouslySetInnerHTML={renderMarkdownPreview()} />
                  </div>
                </TabsContent>
              </Tabs>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-700/50">
                {/* 保存状态提示 */}
                {(saveMessage || publishMessage) && <div className="w-full mb-4">
                    <FormStatus status={saveStatus === 'loading' || publishStatus === 'loading' ? 'loading' : saveStatus === 'error' || publishStatus === 'error' ? 'error' : 'success'} message={saveMessage || publishMessage} />
                  </div>}

                <div className="flex-1 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* 保存草稿按钮 */}
                  <RippleEffect>
                    <Button onClick={handleSaveDraft} disabled={isSaving || isPublishing} variant="outline" className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                      {isSaving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                      保存草稿
                    </Button>
                  </RippleEffect>

                  {/* 发布按钮 */}
                  <RippleEffect>
                    <SubmitButton onClick={handlePublish} isLoading={isPublishing} isSuccess={publishStatus === 'success'} isError={publishStatus === 'error'} successText="发布成功" errorText="发布失败" disabled={isSaving || isPublishing} className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      {isPublished ? '更新发布' : '发布文章'}
                    </SubmitButton>
                  </RippleEffect>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
}