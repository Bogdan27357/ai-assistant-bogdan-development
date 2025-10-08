import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortOption } from './types';

interface SessionFiltersProps {
  searchQuery: string;
  filterTag: string;
  sortBy: SortOption;
  availableTags: string[];
  onSearchChange: (value: string) => void;
  onFilterTagChange: (value: string) => void;
  onSortByChange: (value: SortOption) => void;
  onExportAll: () => void;
  onClearAll: () => void;
}

const SessionFilters = ({
  searchQuery,
  filterTag,
  sortBy,
  availableTags,
  onSearchChange,
  onFilterTagChange,
  onSortByChange,
  onExportAll,
  onClearAll
}: SessionFiltersProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-4">
      <div className="space-y-3">
        <div className="relative">
          <Icon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по диалогам..."
            className="bg-slate-800 border-slate-700 pl-10"
          />
        </div>

        <Select value={filterTag} onValueChange={onFilterTagChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700">
            <SelectValue placeholder="Фильтр по тегам" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">Все теги</SelectItem>
            {availableTags.map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v: any) => onSortByChange(v)}>
          <SelectTrigger className="bg-slate-800 border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="date">По дате</SelectItem>
            <SelectItem value="title">По названию</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            onClick={onExportAll}
            className="flex-1 bg-violet-600 hover:bg-violet-700"
            size="sm"
          >
            <Icon name="Download" size={14} className="mr-1" />
            Экспорт всех
          </Button>
          <Button
            onClick={onClearAll}
            variant="destructive"
            size="sm"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SessionFilters;
