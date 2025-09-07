// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// @ts-ignore;
import { Toaster } from '@/components/ui/toaster';

// 导入页面组件
// @ts-ignore;
import HomePage from './pages/index.jsx';
// @ts-ignore;
import BlogListPage from './pages/blog.jsx';
// @ts-ignore;
import BlogDetailPage from './pages/blog-detail.jsx';
// @ts-ignore;
import EditorPage from './pages/editor.jsx';
// @ts-ignore;
import RepositoryPage from './pages/repository.jsx';
// @ts-ignore;
import ProfilePage from './pages/profile.jsx';
// @ts-ignore;
import RegisterPage from './pages/register.jsx';

// 导入样式
import './index.css';

// 模拟的 $w 对象结构
const mockW = {
  auth: {
    currentUser: {
      userId: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
    }
  },
  utils: {
    navigateTo: ({ pageId, params }) => {
      console.log('Navigate to:', pageId, params);
      // 在实际应用中这里会使用 react-router 进行导航
      window.location.hash = `#/${pageId}`;
    },
    redirectTo: ({ pageId, params }) => {
      console.log('Redirect to:', pageId, params);
      window.location.hash = `#/${pageId}`;
    },
    navigateBack: () => {
      console.log('Navigate back');
      window.history.back();
    }
  },
  page: {
    dataset: {
      params: {}
    }
  },
  cloud: {
    callDataSource: async ({ dataSourceName, methodName, params }) => {
      console.log('Call data source:', dataSourceName, methodName, params);
      // 模拟数据源调用
      return { success: true, data: [] };
    },
    getCloudInstance: async () => {
      return {
        // 模拟云开发实例
      };
    }
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* 路由配置 */}
        <Routes>
          <Route 
            path="/" 
            element={<HomePage $w={mockW} />} 
          />
          <Route 
            path="/index" 
            element={<HomePage $w={mockW} />} 
          />
          <Route 
            path="/blog" 
            element={<BlogListPage $w={mockW} />} 
          />
          <Route 
            path="/blog-detail" 
            element={<BlogDetailPage $w={mockW} />} 
          />
          <Route 
            path="/editor" 
            element={<EditorPage $w={mockW} />} 
          />
          <Route 
            path="/repository" 
            element={<RepositoryPage $w={mockW} />} 
          />
          <Route 
            path="/profile" 
            element={<ProfilePage $w={mockW} />} 
          />
          <Route 
            path="/register" 
            element={<RegisterPage $w={mockW} />} 
          />
        </Routes>
        
        {/* Toast 通知组件 */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;