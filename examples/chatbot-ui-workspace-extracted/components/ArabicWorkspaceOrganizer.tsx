/**
 * Arabic-First Workspace Organizer Component
 * Enhanced workspace organization with RTL support and Iraqi cultural patterns
 * Supports Arabic workspace names, categories, and cultural organization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Grid,
  List,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Globe,
  Shield,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  Eye,
  EyeOff,
  Archive,
  Settings
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// ====================== Types ======================

interface WorkspaceItem {
  id: string;
  name: string;
  nameAr: string;
  type: 'personal' | 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  category: string;
  categoryAr: string;
  description?: string;
  descriptionAr?: string;
  members: number;
  maxMembers: number;
  lastActivity: Date;
  isStarred: boolean;
  isArchived: boolean;
  visibility: 'private' | 'organization' | 'public';
  culturalCompliance: number;
  arabicSupport: boolean;
  dialectPreference: 'baghdad' | 'basra' | 'mosul' | 'general';
  owner: {
    id: string;
    name: string;
    nameAr: string;
  };
}

interface OrganizationCategory {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  workspaceCount: number;
  description?: string;
  descriptionAr?: string;
}

interface WorkspaceOrganizerProps {
  workspaces: WorkspaceItem[];
  onWorkspaceSelect: (workspace: WorkspaceItem) => void;
  onCreateWorkspace: () => void;
  onWorkspaceAction: (workspaceId: string, action: 'star' | 'unstar' | 'archive' | 'unarchive' | 'settings') => void;
  currentUserId: string;
  locale: 'ar' | 'en';
  viewMode?: 'grid' | 'list';
  showArchived?: boolean;
}

// ====================== Default Categories ======================

const DEFAULT_CATEGORIES: OrganizationCategory[] = [
  {
    id: 'recent',
    name: 'Recent',
    nameAr: 'الأحدث',
    icon: '⏰',
    color: 'blue',
    workspaceCount: 0,
    description: 'Recently accessed workspaces',
    descriptionAr: 'مساحات العمل التي تم الوصول إليها مؤخرًا'
  },
  {
    id: 'starred',
    name: 'Starred',
    nameAr: 'المفضلة',
    icon: '⭐',
    color: 'yellow',
    workspaceCount: 0,
    description: 'Your favorite workspaces',
    descriptionAr: 'مساحات العمل المفضلة لديك'
  },
  {
    id: 'professional',
    name: 'Professional',
    nameAr: 'مهني',
    icon: '🏢',
    color: 'green',
    workspaceCount: 0,
    description: 'Legal, medical, and educational workspaces',
    descriptionAr: 'مساحات العمل القانونية والطبية والتعليمية'
  },
  {
    id: 'business',
    name: 'Business',
    nameAr: 'تجاري',
    icon: '💼',
    color: 'purple',
    workspaceCount: 0,
    description: 'Commercial and business workspaces',
    descriptionAr: 'مساحات العمل التجارية والأعمال'
  },
  {
    id: 'personal',
    name: 'Personal',
    nameAr: 'شخصي',
    icon: '👤',
    color: 'gray',
    workspaceCount: 0,
    description: 'Personal and private workspaces',
    descriptionAr: 'مساحات العمل الشخصية والخاصة'
  },
  {
    id: 'shared',
    name: 'Shared',
    nameAr: 'مشتركة',
    icon: '👥',
    color: 'indigo',
    workspaceCount: 0,
    description: 'Workspaces shared with teams',
    descriptionAr: 'مساحات العمل المشتركة مع الفرق'
  }
];

// ====================== Component ======================

export default function ArabicWorkspaceOrganizer({
  workspaces,
  onWorkspaceSelect,
  onCreateWorkspace,
  onWorkspaceAction,
  currentUserId,
  locale = 'ar',
  viewMode = 'grid',
  showArchived = false
}: WorkspaceOrganizerProps) {
  const [currentViewMode, setCurrentViewMode] = useState<'grid' | 'list'>(viewMode);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('recent');
  const [sortBy, setSortBy] = useState<'name' | 'activity' | 'members' | 'compliance'>('activity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showArchivedWorkspaces, setShowArchivedWorkspaces] = useState(showArchived);
  const [categories, setCategories] = useState<OrganizationCategory[]>(DEFAULT_CATEGORIES);

  const isRTL = locale === 'ar';

  const text = {
    ar: {
      title: 'منظم مساحات العمل',
      search: 'البحث في مساحات العمل...',
      createNew: 'إنشاء مساحة عمل جديدة',
      sortBy: 'ترتيب حسب',
      sortName: 'الاسم',
      sortActivity: 'آخر نشاط',
      sortMembers: 'الأعضاء',
      sortCompliance: 'الامتثال الثقافي',
      filterAll: 'الكل',
      showArchived: 'إظهار المؤرشفة',
      noWorkspaces: 'لا توجد مساحات عمل',
      noWorkspacesDesc: 'ابدأ بإنشاء مساحة العمل الأولى',
      members: 'عضو',
      owner: 'المالك',
      lastActivity: 'آخر نشاط',
      compliance: 'الامتثال',
      dialects: {
        general: 'عام',
        baghdad: 'بغداد',
        basra: 'البصرة',
        mosul: 'الموصل'
      },
      types: {
        personal: 'شخصي',
        legal: 'قانوني',
        medical: 'طبي',
        educational: 'تعليمي',
        business: 'تجاري',
        engineering: 'هندسي'
      },
      visibility: {
        private: 'خاص',
        organization: 'منظمة',
        public: 'عام'
      },
      actions: {
        star: 'إضافة للمفضلة',
        unstar: 'إزالة من المفضلة',
        archive: 'أرشفة',
        unarchive: 'إلغاء الأرشفة',
        settings: 'الإعدادات',
        view: 'عرض'
      },
      timeAgo: {
        now: 'الآن',
        minute: 'دقيقة',
        minutes: 'دقائق',
        hour: 'ساعة',
        hours: 'ساعات',
        day: 'يوم',
        days: 'أيام',
        week: 'أسبوع',
        weeks: 'أسابيع',
        month: 'شهر',
        months: 'أشهر',
        year: 'سنة',
        years: 'سنوات'
      }
    },
    en: {
      title: 'Workspace Organizer',
      search: 'Search workspaces...',
      createNew: 'Create New Workspace',
      sortBy: 'Sort by',
      sortName: 'Name',
      sortActivity: 'Last Activity',
      sortMembers: 'Members',
      sortCompliance: 'Cultural Compliance',
      filterAll: 'All',
      showArchived: 'Show Archived',
      noWorkspaces: 'No workspaces',
      noWorkspacesDesc: 'Start by creating your first workspace',
      members: 'members',
      owner: 'Owner',
      lastActivity: 'Last Activity',
      compliance: 'Compliance',
      dialects: {
        general: 'General',
        baghdad: 'Baghdad',
        basra: 'Basra',
        mosul: 'Mosul'
      },
      types: {
        personal: 'Personal',
        legal: 'Legal',
        medical: 'Medical',
        educational: 'Educational',
        business: 'Business',
        engineering: 'Engineering'
      },
      visibility: {
        private: 'Private',
        organization: 'Organization',
        public: 'Public'
      },
      actions: {
        star: 'Add to Favorites',
        unstar: 'Remove from Favorites',
        archive: 'Archive',
        unarchive: 'Unarchive',
        settings: 'Settings',
        view: 'View'
      },
      timeAgo: {
        now: 'now',
        minute: 'minute',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        day: 'day',
        days: 'days',
        week: 'week',
        weeks: 'weeks',
        month: 'month',
        months: 'months',
        year: 'year',
        years: 'years'
      }
    }
  };

  const t = text[locale];

  // ====================== Effects ======================

  useEffect(() => {
    updateCategoryCounts();
  }, [workspaces, showArchivedWorkspaces]);

  // ====================== Helper Functions ======================

  const updateCategoryCounts = () => {
    const filteredWorkspaces = showArchivedWorkspaces 
      ? workspaces 
      : workspaces.filter(w => !w.isArchived);

    const now = new Date();
    const recentThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const updatedCategories = categories.map(cat => {
      let count = 0;
      
      switch (cat.id) {
        case 'recent':
          count = filteredWorkspaces.filter(w => w.lastActivity > recentThreshold).length;
          break;
        case 'starred':
          count = filteredWorkspaces.filter(w => w.isStarred).length;
          break;
        case 'professional':
          count = filteredWorkspaces.filter(w => ['legal', 'medical', 'educational'].includes(w.type)).length;
          break;
        case 'business':
          count = filteredWorkspaces.filter(w => ['business', 'engineering'].includes(w.type)).length;
          break;
        case 'personal':
          count = filteredWorkspaces.filter(w => w.type === 'personal').length;
          break;
        case 'shared':
          count = filteredWorkspaces.filter(w => w.visibility !== 'private' && w.members > 1).length;
          break;
        default:
          count = cat.workspaceCount;
      }
      
      return { ...cat, workspaceCount: count };
    });

    setCategories(updatedCategories);
  };

  const filterWorkspaces = () => {
    let filtered = showArchivedWorkspaces 
      ? workspaces 
      : workspaces.filter(w => !w.isArchived);

    // Apply category filter
    if (selectedCategory !== 'recent') {
      const now = new Date();
      const recentThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      switch (selectedCategory) {
        case 'recent':
          filtered = filtered.filter(w => w.lastActivity > recentThreshold);
          break;
        case 'starred':
          filtered = filtered.filter(w => w.isStarred);
          break;
        case 'professional':
          filtered = filtered.filter(w => ['legal', 'medical', 'educational'].includes(w.type));
          break;
        case 'business':
          filtered = filtered.filter(w => ['business', 'engineering'].includes(w.type));
          break;
        case 'personal':
          filtered = filtered.filter(w => w.type === 'personal');
          break;
        case 'shared':
          filtered = filtered.filter(w => w.visibility !== 'private' && w.members > 1);
          break;
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(query) ||
        w.nameAr.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query) ||
        w.descriptionAr?.toLowerCase().includes(query) ||
        w.category.toLowerCase().includes(query) ||
        w.categoryAr.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = locale === 'ar' 
            ? a.nameAr.localeCompare(b.nameAr, 'ar')
            : a.name.localeCompare(b.name);
          break;
        case 'activity':
          comparison = b.lastActivity.getTime() - a.lastActivity.getTime();
          break;
        case 'members':
          comparison = b.members - a.members;
          break;
        case 'compliance':
          comparison = b.culturalCompliance - a.culturalCompliance;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return t.timeAgo.now;
    if (minutes < 60) return `${minutes} ${minutes === 1 ? t.timeAgo.minute : t.timeAgo.minutes}`;
    if (hours < 24) return `${hours} ${hours === 1 ? t.timeAgo.hour : t.timeAgo.hours}`;
    if (days < 7) return `${days} ${days === 1 ? t.timeAgo.day : t.timeAgo.days}`;
    if (weeks < 4) return `${weeks} ${weeks === 1 ? t.timeAgo.week : t.timeAgo.weeks}`;
    if (months < 12) return `${months} ${months === 1 ? t.timeAgo.month : t.timeAgo.months}`;
    return `${years} ${years === 1 ? t.timeAgo.year : t.timeAgo.years}`;
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <EyeOff className="h-3 w-3" />;
      case 'organization': return <Users className="h-3 w-3" />;
      case 'public': return <Globe className="h-3 w-3" />;
      default: return <Eye className="h-3 w-3" />;
    }
  };

  // ====================== Render Methods ======================

  const renderCategoryFilter = () => (
    <div className={`flex flex-wrap gap-2 mb-4 ${isRTL ? 'justify-end' : ''}`}>
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}
        >
          <span>{category.icon}</span>
          <span>{locale === 'ar' ? category.nameAr : category.name}</span>
          {category.workspaceCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {category.workspaceCount}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );

  const renderWorkspaceCard = (workspace: WorkspaceItem) => (
    <Card 
      key={workspace.id} 
      className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${workspace.isArchived ? 'opacity-60' : ''}`}
      onClick={() => onWorkspaceSelect(workspace)}
    >
      <CardHeader className="pb-2">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
            <CardTitle className={`text-lg leading-tight ${isRTL ? 'font-arabic' : ''}`}>
              {locale === 'ar' ? workspace.nameAr : workspace.name}
            </CardTitle>
            {workspace.description && (
              <p className={`text-sm text-gray-600 mt-1 line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                {locale === 'ar' ? workspace.descriptionAr : workspace.description}
              </p>
            )}
          </div>
          
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {workspace.isStarred && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
            {workspace.isArchived && (
              <Archive className="h-4 w-4 text-gray-500" />
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className={isRTL ? 'font-arabic' : ''}>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, workspace.isStarred ? 'unstar' : 'star');
                  }}
                >
                  {workspace.isStarred ? t.actions.unstar : t.actions.star}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, workspace.isArchived ? 'unarchive' : 'archive');
                  }}
                >
                  {workspace.isArchived ? t.actions.unarchive : t.actions.archive}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, 'settings');
                  }}
                >
                  {t.actions.settings}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3">
          {/* Type and Visibility Badges */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <Badge variant="secondary" className={isRTL ? 'font-arabic' : ''}>
              {t.types[workspace.type as keyof typeof t.types]}
            </Badge>
            <Badge variant="outline" className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
              {getVisibilityIcon(workspace.visibility)}
              {t.visibility[workspace.visibility as keyof typeof t.visibility]}
            </Badge>
            {workspace.arabicSupport && (
              <Badge variant="outline" className={`text-xs ${isRTL ? 'font-arabic' : ''}`}>
                {t.dialects[workspace.dialectPreference]}
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className={`flex items-center justify-between text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
                <Users className="h-3 w-3" />
                {workspace.members}/{workspace.maxMembers} {t.members}
              </span>
              <span className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
                <Clock className="h-3 w-3" />
                {formatTimeAgo(workspace.lastActivity)}
              </span>
            </div>
            
            <Badge 
              className={`text-xs ${getComplianceColor(workspace.culturalCompliance)} ${isRTL ? 'font-arabic' : ''}`}
            >
              <Shield className="h-3 w-3 mr-1" />
              {workspace.culturalCompliance}% {t.compliance}
            </Badge>
          </div>

          {/* Owner */}
          <div className={`text-xs text-gray-500 ${isRTL ? 'text-right font-arabic' : ''}`}>
            {t.owner}: {locale === 'ar' ? workspace.owner.nameAr : workspace.owner.name}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderWorkspaceList = (workspace: WorkspaceItem) => (
    <Card 
      key={workspace.id} 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 mb-2 ${workspace.isArchived ? 'opacity-60' : ''}`}
      onClick={() => onWorkspaceSelect(workspace)}
    >
      <CardContent className="py-3">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {workspace.isStarred && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {workspace.isArchived && (
                <Archive className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
              <h3 className={`font-semibold truncate ${isRTL ? 'font-arabic' : ''}`}>
                {locale === 'ar' ? workspace.nameAr : workspace.name}
              </h3>
              <p className={`text-sm text-gray-600 truncate ${isRTL ? 'font-arabic' : ''}`}>
                {locale === 'ar' ? workspace.descriptionAr : workspace.description}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Badge variant="secondary" className={isRTL ? 'font-arabic' : ''}>
              {t.types[workspace.type as keyof typeof t.types]}
            </Badge>
            
            <div className={`text-sm text-gray-600 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {workspace.members}/{workspace.maxMembers} {t.members}
            </div>
            
            <div className={`text-sm text-gray-600 w-20 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {formatTimeAgo(workspace.lastActivity)}
            </div>
            
            <Badge 
              className={`text-xs ${getComplianceColor(workspace.culturalCompliance)} ${isRTL ? 'font-arabic' : ''}`}
            >
              {workspace.culturalCompliance}%
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className={isRTL ? 'font-arabic' : ''}>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, workspace.isStarred ? 'unstar' : 'star');
                  }}
                >
                  {workspace.isStarred ? t.actions.unstar : t.actions.star}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, workspace.isArchived ? 'unarchive' : 'archive');
                  }}
                >
                  {workspace.isArchived ? t.actions.unarchive : t.actions.archive}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceAction(workspace.id, 'settings');
                  }}
                >
                  {t.actions.settings}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const filteredWorkspaces = filterWorkspaces();

  // ====================== Main Render ======================

  return (
    <div className={`max-w-7xl mx-auto p-6 ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h1 className={`text-3xl font-bold ${isRTL ? 'font-arabic' : ''}`}>{t.title}</h1>
        <Button onClick={onCreateWorkspace} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
          <Plus className="h-4 w-4" />
          {t.createNew}
        </Button>
      </div>

      {/* Search and Controls */}
      <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className={`relative flex-1 ${isRTL ? 'text-right' : ''}`}>
          <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isRTL ? 'pr-10 text-right font-arabic' : 'pl-10'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </div>

        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className={`w-40 ${isRTL ? 'text-right font-arabic' : ''}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activity">{t.sortActivity}</SelectItem>
              <SelectItem value="name">{t.sortName}</SelectItem>
              <SelectItem value="members">{t.sortMembers}</SelectItem>
              <SelectItem value="compliance">{t.sortCompliance}</SelectItem>
            </SelectContent>
          </Select>

          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Switch
              checked={showArchivedWorkspaces}
              onCheckedChange={setShowArchivedWorkspaces}
            />
            <Label className={isRTL ? 'font-arabic' : ''}>{t.showArchived}</Label>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Workspaces */}
      {filteredWorkspaces.length === 0 ? (
        <div className={`text-center py-12 ${isRTL ? 'text-right' : ''}`}>
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-lg font-semibold text-gray-600 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
            {t.noWorkspaces}
          </h3>
          <p className={`text-gray-500 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
            {t.noWorkspacesDesc}
          </p>
          <Button onClick={onCreateWorkspace} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse font-arabic' : ''}`}>
            <Plus className="h-4 w-4" />
            {t.createNew}
          </Button>
        </div>
      ) : (
        <div className={`${
          currentViewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-2'
        }`}>
          {filteredWorkspaces.map(workspace => 
            currentViewMode === 'grid' 
              ? renderWorkspaceCard(workspace)
              : renderWorkspaceList(workspace)
          )}
        </div>
      )}
    </div>
  );
}