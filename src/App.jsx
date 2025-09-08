// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Toaster } from '@/components/ui';

// @ts-ignore;
import { MouseEffects } from '@/components/MouseEffects';
// @ts-ignore;
import { BackgroundParticles } from '@/components/BackgroundParticles';
// @ts-ignore;
import Index from '@/pages/index';
// @ts-ignore;
import Editor from '@/pages/editor';
// @ts-ignore;
import Repository from '@/pages/repository';
// @ts-ignore;
import Blog from '@/pages/blog';
// @ts-ignore;
import BlogDetail from '@/pages/blog-detail';
// @ts-ignore;
import Profile from '@/pages/profile';
// @ts-ignore;
import Register from '@/pages/register';
export default function App() {
  return <div className="App">
      <MouseEffects />
      <BackgroundParticles />
      <Index />
      <Toaster />
    </div>;
}