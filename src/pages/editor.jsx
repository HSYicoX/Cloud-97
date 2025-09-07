// @ts-ignore;
import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore;
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea, Tabs, TabsContent, TabsList, TabsTrigger, useToast, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Switch, Label } from '@/components/ui';
// @ts-ignore;
import { Save, Upload, Bold, Italic, Code, Link, Image, List, Quote, Eye, Edit, Copy, Download, ArrowLeft, Tag, BookOpen, Send, FileText, X, Calendar, EyeOff, EyeIcon } from 'lucide-react';

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

  // 从URL参数获取文章ID，判断是编辑还是新建
  const postId = $w.page.dataset.params?.id;
  const isNewPost = $w.page.dataset.params?.new === 'true';

  // 加载文章数据（如果是编辑模式）
  useEffect(() => {
    if (postId && !isNewPost) {
      loadPostData();
    }
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
       极 setCoverImage(result.coverImage || '');
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