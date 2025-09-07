// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
// @ts-ignore;
import { Badge } from '@/components/ui';

export function SyncHistory({
  syncHistory,
  formatSyncTime
}) {
  if (syncHistory.length === 0) {
    return <div className="text-center py-8 text-gray-400">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>暂无同步记录</p>
      </div>;
  }
  return <div className="space-y-3">
      {syncHistory.map(record => <div key={record._id || record.id} className="p-3 bg-[#0d1117] rounded-lg border border-[#30363d]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {record.status === 'success' ? <CheckCircle className="h-5 w-5 text-green-400" /> : <AlertCircle className="h-5 w-5 text-red-400" />}
              <div>
                <h4 className="text-white font-medium">{record.message}</h4>
                <p className="text-sm text-[#8b949e] mt-1">
                  {formatSyncTime(record.timestamp)} • {record.repositoriesUpdated} 个仓库更新
                </p>
              </div>
            </div>
            <Badge variant={record.status === 'success' ? 'success' : 'destructive'}>
              {record.status === 'success' ? '成功' : '失败'}
            </Badge>
          </div>
        </div>)}
    </div>;
}