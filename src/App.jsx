// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Toaster } from '@/components/ui';

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
    navigateTo: ({
      pageId,
      params
    }) => {
      console.log('Navigate to:', pageId, params);
      // 使用 hash 路由
      window.location.hash = `#${pageId}`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        window.location.search = searchParams.toString();
      }
    },
    redirectTo: ({
      pageId,
      params
    }) => {
      console.log('Redirect to:', pageId, params);
      window.location.hash = `#${pageId}`;
      if (params) {
        const searchParams = new URLSearchParams(params);
        window.location.search = searchParams.toString();
      }
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
    callDataSource: async ({
      dataSourceName,
      methodName,
      params
    }) => {
      console.log('Call data source:', dataSourceName, methodName, params);
      // 模拟数据源调用
      return {
        success: true,
        data: []
      };
    },
    getCloudInstance: async () => {
      return {
        // 模拟云开发实例
      };
    }
  }
};
function App() {
  const [currentPage, setCurrentPage] = useState('index');
  const [pageParams, setPageParams] = useState({});

  // 监听 hash 变化来切换页面
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('index');
      }
    };

    // 初始加载时检查 hash
    handleHashChange();

    // 监听 hash 变化
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // 根据当前页面渲染对应组件
  const renderPage = () => {
    const pageProps = {
      $w: {
        ...mockW,
        page: {
          dataset: {
            params: pageParams
          }
        }
      }
    };
    switch (currentPage) {
      case 'index':
        return <HomePage {...pageProps} />;
      case 'blog':
        return <BlogListPage {...pageProps} />;
      case 'blog-detail':
        return <BlogDetailPage {...pageProps} />;
      case 'editor':
        return <EditorPage {...pageProps} />;
      case 'repository':
        return <RepositoryPage {...pageProps} />;
      case 'profile':
        return <ProfilePage {...pageProps} />;
      case 'register':
        return <RegisterPage {...pageProps} />;
      default:
        return <HomePage {...pageProps} />;
    }
  };
  return <div className="App">
      {renderPage()}
      <Toaster />
    </div>;
}
export default App;