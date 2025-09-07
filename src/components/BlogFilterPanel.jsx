// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Card, CardContent, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge, Button } from '@/components/ui';
// @ts-ignore;
import { Search, Filter, ArrowUpDown, Tag, Hash, X } from 'lucide-react';

// @ts-ignore;
import { RippleEffect } from '@/components/RippleEffect';
export function BlogFilterPanel({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  showTagFilter,
  onToggleTagFilter
}) {
  return <Card className="bg-slate-800/40 backdrop-blur-md border-slate-700/50">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* 搜索框 */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="搜索文章标题、标签、分类或内容..." value={searchQuery} onChange={onSearchChange} className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white" />
              {searchQuery && <button onClick={() => onSearchChange({
              target: {
                value: ''
              }
            })} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300">
                  <X className="h-4 w-4" />
                </button>}
            </div>
          </div>

          {/* 分类筛选 */}
          <div>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="所有分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* 排序 */}
          <div>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新发布</SelectItem>
                <SelectItem value="oldest">最早发布</SelectItem>
                <SelectItem value="mostViews">最多阅读</SelectItem>
                <SelectItem value="mostLikes">最多点赞</SelectItem>
                <SelectItem value="mostFavorites">最多收藏</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 标签筛选区域 */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">标签筛选</span>
              <span className="text-slate-500 text-sm ml-2">({allTags.length} 个标签)</span>
            </div>
            {selectedTags.length > 0 && <RippleEffect>
                <Button variant="ghost" size="sm" onClick={onClearTags} className="text-slate-400 hover:text-slate-300 text-xs">
                  <X className="h-3 w-3 mr-1" />
                  清除
                </Button>
              </RippleEffect>}
          </div>

          {/* 标签列表 */}
          {allTags.length > 0 ? <div className="flex flex-wrap gap-2">
              {allTags.slice(0, showTagFilter ? allTags.length : 8).map(tag => <RippleEffect key={tag}>
                  <Badge variant={selectedTags.includes(tag) ? "default" : "outline"} className={`cursor-pointer transition-all hover-lift click-scale ${selectedTags.includes(tag) ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50'}`} onClick={() => onTagToggle(tag)}>
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                </RippleEffect>)}
              
              {allTags.length > 8 && <RippleEffect>
                  <Badge variant="outline" className="cursor-pointer bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50" onClick={onToggleTagFilter}>
                    {showTagFilter ? '收起' : `查看更多 (${allTags.length - 8})`}
                  </Badge>
                </RippleEffect>}
            </div> : <p className="text-slate-500 text-sm">暂无标签</p>}

          {/* 已选标签提示 */}
          {selectedTags.length > 0 && <div className="mt-3">
              <span className="text-sm text-slate-400 mr-2">已选标签:</span>
              {selectedTags.map(tag => <Badge key={tag} variant="default" className="bg-blue-500/20 text-blue-300 mr-2 mb-2 inline-flex items-center">
                  {tag}
                  <button onClick={() => onTagToggle(tag)} className="ml-1 hover:text-blue-200">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>)}
            </div>}
        </div>
      </CardContent>
    </Card>;
}