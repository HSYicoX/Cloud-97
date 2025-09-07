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
  const [content, setContent] = useState('# 欢迎使用Markdown编辑器\n\n这是一个示例内容，开始编写你的博客吧！\n\n## 功能特性\n- 实时预览\n- 代码高亮\n- 图片上传\n- 自动保存\n\n```javascript\nconsole.log("Hello, World!");\n```');
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
  const loadPostData = async () => {
    try {
      setIsLoading(true);
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
        if (result.coverImage) {
          setCoverPreview(result.coverImage);
        }
      }
    } catch (error) {
      console.error('加载文章数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载文章内容，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const insertText = (before, after = '', defaultText = '') => {
    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);
    textarea.focus();
    textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
  };
  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({
        title: '错误',
        description: '请选择图片文件',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsLoading(true);
      toast({
        title: '上传中',
        description: '图片正在上传...'
      });

      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      const newImage = {
        id: Date.now(),
        name: file.name,
        url: imageUrl,
        size: file.size
      };
      setUploadedImages(prev => [...prev, newImage]);
      toast({
        title: '成功',
        description: '图片上传成功'
      });

      // 插入Markdown图片语法
      insertText('', '', `![${file.name}](${imageUrl})`);
    } catch (error) {
      toast({
        title: '上传失败',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleTagInput = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 5) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };
  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: '已复制',
        description: '内容已复制到剪贴板'
      });
    } catch (error) {
      toast({
        title: '复制失败',
        description: '请手动复制内容',
        variant: 'destructive'
      });
    }
  };
  const downloadMarkdown = () => {
    const blob = new Blob([content], {
      type: 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title ? `${title}.md` : 'blog.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const saveDraft = async () => {
    if (!title.trim()) {
      toast({
        title: '警告',
        description: '请输入文章标题',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsSaving(true);
      toast({
        title: '保存中',
        description: '正在保存草稿...'
      });
      const currentUser = $w.auth.currentUser;
      const postData = {
        title: title.trim(),
        content: content,
        tags: tags,
        category: category,
        excerpt: excerpt,
        status: 'draft',
        isPublished: false,
        author: {
          name: currentUser?.name || 'Haokir',
          avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          bio: currentUser?.bio || '前端开发工程师 | React爱好者'
        },
        readTime: `${Math.ceil(content.length / 500)} min read`,
        likes: 0,
        favoriteCount: 0,
        isFavorite: false
      };
      if (postId && !isNewPost) {
        // 更新现有文章
        await $w.cloud.callDataSource({
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
      } else {
        // 创建新文章
        await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaCreateV2',
          params: {
            data: postData
          }
        });
      }
      toast({
        title: '保存成功',
        description: '草稿已成功保存'
      });
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: '保存失败',
        description: error.message || '保存失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  const publishArticle = async () => {
    if (!title.trim()) {
      toast({
        title: '警告',
        description: '请输入文章标题',
        variant: 'destructive'
      });
      return;
    }
    if (!content.trim()) {
      toast({
        title: '警告',
        description: '请输入文章内容',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsPublishing(true);
      toast({
        title: '发布中',
        description: '文章正在发布...'
      });
      const currentUser = $w.auth.currentUser;
      const postData = {
        title: title.trim(),
        content: content,
        tags: tags,
        category: category,
        excerpt: excerpt,
        status: 'published',
        isPublished: true,
        author: {
          name: currentUser?.name || 'Haokir',
          avatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h极150&fit=crop&crop=face',
          bio: currentUser?.bio || '前端开发工程师 | React爱好者'
        },
        readTime: `${Math.ceil(content.length / 500)} min read`,
        likes: 0,
        favoriteCount: 0,
        isFavorite: false,
        publishedAt: new Date().getTime(),
        createdAt: new Date().getTime()
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
      } else {
        // 创建新文章
        result = await $w.cloud.callDataSource({
          dataSourceName: 'blog_posts',
          methodName: 'wedaCreateV2',
          params: {
            data: postData
          }
        });
      }
      toast({
        title: '发布成功',
        description: '文章已成功发布'
      });

      // 发布成功后跳转到博客页面
      setTimeout(() => {
        $w.utils.navigateTo({
          pageId: 'blogs',
          params: {}
        });
      }, 1000);
    } catch (error) {
      console.error('发布失败:', error);
      toast({
        title: '发布失败',
        description: error.message || '发布失败，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsPublishing(false);
    }
  };
  const handleNavigateBack = () => {
    $w.utils.navigateBack();
  };
  const renderMarkdown = text => {
    // 简单的Markdown解析
    return text.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>').replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-6">$1</h2>').replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic">$1</em>').replace(/`(.*?)`/g, '<code class="bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>').replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg max-w-full h-auto my-4" />').replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>').replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>').replace(/\n/g, '<br/>');
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 relative">
      {/* 鼠标特效 */}
      <MouseEffects />
      
      {/* Navigation */}
      <Navigation $w={$w} currentPage="editor" />
      
      <div className="container mx-auto max-w-7xl pt-16">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-slate-700/50 glass-dark animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover-lift" onClick={handleNavigateBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              返回
            </Button>
            <div className="text-sm text-slate-400">
              {postId && !isNewPost ? '编辑文章' : '新建文章'}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Input placeholder="输入文章标题..." value={title} onChange={e => setTitle(e.target.value)} className="bg-slate-700/50 border-slate-600 text-white text-xl font-bold flex-1 focus-ring" />
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={copyToClipboard} disabled={isLoading}>
                <Copy className="h-4 w-4 mr-2" />
                复制
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={downloadMarkdown} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                下载
              </Button>
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tags Input */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                标签
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input placeholder="输入标签并按回车添加 (最多5个)" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyPress={handleTagInput} className="bg-slate-700/50 border-slate-600 text-white focus-ring" disabled={tags.length >= 5} />
                {tags.length > 0 && <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover-lift">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-blue-100">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>)}
                  </div>}
              </div>
            </CardContent>
          </Card>

          {/* Category Select */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                分类
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus-ring">
                  <SelectValue placeholder="选择文章分类" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {existingCategories.map(cat => <SelectItem key={cat} value={cat} className="text-white hover:bg-slate-700">
                      {cat}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Status Toggle */}
          <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark animate-fade-in" style={{
          animationDelay: '0.3s'
        }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Send className="h-4 w-4 mr-2" />
                发布状态
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch id="publish-status" checked={isPublished} onCheckedChange={setIsPublished} />
                <Label htmlFor="publish-status" className="text-slate-300">
                  {isPublished ? '已发布' : '草稿'}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor and Preview */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 glass-dark">
            <TabsTrigger value="edit" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white hover-lift">
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white hover-lift">
              <Eye className="h-4 w-4 mr-2" />
              预览
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="mt-0 animate-fade-in">
            <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
              <CardContent className="p-0">
                {/* Toolbar */}
                <div className="flex flex-wrap gap-2 p-4 border-b border-slate-700/50">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('**', '**', '粗体文字')} disabled={isLoading}>
                    <Bold className="h-4 w-4 mr-2" />
                    粗体
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('*', '*', '斜体文字')} disabled={isLoading}>
                    <Italic className="h-4 w-4 mr-2" />
                    斜体
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('`', '`', '代码')} disabled={isLoading}>
                    <Code className="h-4 w-4 mr-2" />
                    代码
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('[', '](url)', '链接文字')} disabled={isLoading}>
                    <Link className="h-4 w-4 mr-2" />
                    链接
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                    <Image className="h-4 w-4 mr-2" />
                    图片
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('```\n', '\n```', '代码块')} disabled={isLoading}>
                    <Code className="h-4 w-4 mr-2" />
                    代码块
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('> ', '', '引用文字')} disabled={isLoading}>
                    <Quote className="h-4 w-4 mr-2" />
                    引用
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover-lift" onClick={() => insertText('- ', '', '列表项')} disabled={isLoading}>
                    <List className="h-4 w-4 mr-2" />
                    列表
                  </Button>
                </div>

                {/* Editor */}
                <Textarea id="markdown-editor" value={content} onChange={e => setContent(e.target.value)} className="w-full h-96 bg-slate-800 border-0 text-white resize-none focus:ring-0 p-4 font-mono text-sm focus-ring" placeholder="开始编写你的博客内容..." />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="mt-0 animate-fade-in" style={{
          animationDelay: '0.1s'
        }}>
            <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50 glass-dark">
              <CardContent className="p-6">
                <div className="prose prose-invert prose-slate max-w-none">
                  <div dangerouslySetInnerHTML={{
                  __html: renderMarkdown(content)
                }} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end animate-fade-in" style={{
        animationDelay: '0.2s'
      }}>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 px-8 hover-lift" onClick={handleNavigateBack}>
            取消
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 px-8 hover-lift" onClick={saveDraft} disabled={isSaving || isPublishing} isLoading={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            保存草稿
          </Button>
          <Button className="bg-green-500 hover:bg-green-600 px-8 hover-lift" onClick={publishArticle} disabled={isSaving || isPublishing} isLoading={isPublishing}>
            <Send className="h-4 w-4 mr-2" />
            发布文章
          </Button>
        </div>

        {/* Hidden file input for image upload */}
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>
    </div>;
}