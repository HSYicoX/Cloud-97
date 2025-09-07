// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

// @ts-ignore;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
export function UserStatsCard({
  statsData
}) {
  if (!statsData) {
    return <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">数据统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            数据加载中...
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">数据统计</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-700/30 p-4 rounded-lg text-center hover:bg-slate-700/50 transition-colors duration-200">
            <div className="text-2xl font-bold text-blue-400">{statsData.totalViews}</div>
            <div className="text-sm text-slate-400">总阅读量</div>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg text-center hover:bg-slate-700/50 transition-colors duration-200">
            <div className="text-2xl font-bold text-green-400">{statsData.totalLikes}</div>
            <div className="text-sm text-slate-400">总点赞数</div>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg text-center hover:bg-slate-700/50 transition-colors duration-200">
            <div className="text-2xl font-bold text-purple-400">{statsData.totalPosts}</div>
            <div className="text-sm text-slate-400">文章总数</div>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg text-center hover:bg-slate-700/50 transition-colors duration-200">
            <div className="text-2xl font-bold text-yellow-400">{statsData.totalFollowers}</div>
            <div className="text-sm text-slate-400">粉丝数量</div>
          </div>
        </div>

        {statsData.monthlyStats && statsData.monthlyStats.length > 0 && <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }} itemStyle={{
              color: '#f1f5f9'
            }} labelStyle={{
              color: '#f1f5f9'
            }} />
                <Bar dataKey="views" fill="#3b82f6" name="阅读量" radius={[4, 4, 0, 0]} />
                <Bar dataKey="likes" fill="#10b981" name="点赞数" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>}
      </CardContent>
    </Card>;
}