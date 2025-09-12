/**
 * Arabic-First Admin Interface with RTL Support
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Complete RTL layout system for admin interface
 * - Arabic-first navigation and menus
 * - Cultural adaptation of admin components
 * - Iraqi professional terminology
 * - Seamless Arabic-English switching
 * - Islamic-compliant design principles
 */

'use client';

import React, { useState, useContext, createContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Shield,
  Users,
  Settings,
  BarChart3,
  FileText,
  Globe,
  Building,
  Scale,
  Stethoscope,
  GraduationCap,
  Briefcase,
  Wrench,
  Menu,
  Bell,
  User,
  LogOut,
  Languages,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { UserRole, ProfessionalDomain } from '../types/admin';

// Arabic Admin Context
interface ArabicAdminContextType {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  direction: 'ltr' | 'rtl';
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const ArabicAdminContext = createContext<ArabicAdminContextType | null>(null);

export const useArabicAdmin = () => {
  const context = useContext(ArabicAdminContext);
  if (!context) {
    throw new Error('useArabicAdmin must be used within ArabicAdminProvider');
  }
  return context;
};

// Arabic Admin Provider
export const ArabicAdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <ArabicAdminContext.Provider value={{
      language,
      setLanguage,
      direction,
      theme,
      setTheme
    }}>
      <div dir={direction} className={`arabic-admin-interface ${language}`}>
        {children}
      </div>
    </ArabicAdminContext.Provider>
  );
};

// Navigation items with Arabic translations
const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    icon: BarChart3,
    label: { en: 'Dashboard', ar: 'لوحة التحكم' },
    href: '/admin'
  },
  {
    id: 'users',
    icon: Users,
    label: { en: 'User Management', ar: 'إدارة المستخدمين' },
    href: '/admin/users'
  },
  {
    id: 'compliance',
    icon: Shield,
    label: { en: 'Compliance Monitoring', ar: 'مراقبة الامتثال' },
    href: '/admin/compliance'
  },
  {
    id: 'domains',
    icon: Building,
    label: { en: 'Professional Domains', ar: 'المجالات المهنية' },
    href: '/admin/domains',
    children: [
      { icon: Scale, label: { en: 'Legal', ar: 'قانوني' }, href: '/admin/domains/legal' },
      { icon: Stethoscope, label: { en: 'Medical', ar: 'طبي' }, href: '/admin/domains/medical' },
      { icon: GraduationCap, label: { en: 'Educational', ar: 'تعليمي' }, href: '/admin/domains/educational' },
      { icon: Briefcase, label: { en: 'Business', ar: 'تجاري' }, href: '/admin/domains/business' },
      { icon: Wrench, label: { en: 'Engineering', ar: 'هندسي' }, href: '/admin/domains/engineering' }
    ]
  },
  {
    id: 'reports',
    icon: FileText,
    label: { en: 'Reports & Analytics', ar: 'التقارير والتحليلات' },
    href: '/admin/reports'
  },
  {
    id: 'settings',
    icon: Settings,
    label: { en: 'System Settings', ar: 'إعدادات النظام' },
    href: '/admin/settings'
  }
];

// Role badges with Arabic translations
const ROLE_LABELS: Record<UserRole, { en: string; ar: string; color: string }> = {
  'super-admin': { en: 'Super Admin', ar: 'مدير عام', color: 'bg-red-100 text-red-800' },
  'organization-admin': { en: 'Organization Admin', ar: 'مدير منظمة', color: 'bg-blue-100 text-blue-800' },
  'cultural-validator': { en: 'Cultural Validator', ar: 'محقق ثقافي', color: 'bg-green-100 text-green-800' },
  'domain-expert': { en: 'Domain Expert', ar: 'خبير مختص', color: 'bg-purple-100 text-purple-800' },
  'workspace-admin': { en: 'Workspace Admin', ar: 'مدير مساحة عمل', color: 'bg-orange-100 text-orange-800' },
  'user': { en: 'User', ar: 'مستخدم', color: 'bg-gray-100 text-gray-800' },
  'guest': { en: 'Guest', ar: 'ضيف', color: 'bg-gray-50 text-gray-600' }
};

interface ArabicAdminLayoutProps {
  children: React.ReactNode;
  currentUser?: {
    name: string;
    arabicName?: string;
    role: UserRole;
    avatar?: string;
  };
}

// Arabic Admin Sidebar
const ArabicAdminSidebar: React.FC<{ currentPath?: string }> = ({ currentPath = '/admin' }) => {
  const { language } = useArabicAdmin();
  const isArabic = language === 'ar';

  return (
    <Sidebar side={isArabic ? 'right' : 'left'} className="arabic-admin-sidebar">
      <SidebarContent className={isArabic ? 'text-right' : 'text-left'}>
        {/* Logo Section */}
        <div className={`p-4 border-b ${isArabic ? 'text-right' : 'text-left'}`}>
          <h2 className="text-lg font-bold">
            {isArabic ? 'النظام الذكي العراقي' : 'Iraqi AI System'}
          </h2>
          <p className="text-sm text-gray-600">
            {isArabic ? 'لوحة الإدارة' : 'Admin Panel'}
          </p>
        </div>

        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {isArabic ? 'التنقل الرئيسي' : 'Main Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.href}
                    className={isArabic ? 'flex-row-reverse' : ''}
                  >
                    <a href={item.href} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label[language]}</span>
                      {item.children && (
                        isArabic ? <ChevronLeft className="w-4 h-4 mr-auto" /> 
                                : <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </a>
                  </SidebarMenuButton>
                  
                  {/* Submenu */}
                  {item.children && (
                    <div className={`ml-4 mt-2 space-y-1 ${isArabic ? 'mr-4 ml-0' : ''}`}>
                      {item.children.map((child, index) => (
                        <SidebarMenuButton 
                          key={index} 
                          asChild
                          size="sm"
                          className={isArabic ? 'flex-row-reverse' : ''}
                        >
                          <a href={child.href} className="flex items-center gap-2">
                            <child.icon className="w-3 h-3" />
                            <span className="text-sm">{child.label[language]}</span>
                          </a>
                        </SidebarMenuButton>
                      ))}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Cultural Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>
            {isArabic ? 'الإعدادات الثقافية' : 'Cultural Settings'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="p-2 space-y-2">
              <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm">{isArabic ? 'الامتثال الإسلامي' : 'Islamic Compliance'}</span>
                <Badge className="bg-green-100 text-green-800">
                  {isArabic ? 'نشط' : 'Active'}
                </Badge>
              </div>
              <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-sm">{isArabic ? 'الحياد السياسي' : 'Political Neutrality'}</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {isArabic ? 'نشط' : 'Active'}
                </Badge>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

// Arabic Admin Header
const ArabicAdminHeader: React.FC<{ 
  currentUser?: ArabicAdminLayoutProps['currentUser'] 
}> = ({ currentUser }) => {
  const { language, setLanguage, theme, setTheme } = useArabicAdmin();
  const isArabic = language === 'ar';

  const roleInfo = currentUser?.role ? ROLE_LABELS[currentUser.role] : null;

  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center px-4">
        {/* Sidebar Trigger */}
        <SidebarTrigger className={isArabic ? 'ml-2 order-last' : 'mr-2'} />

        {/* Breadcrumb / Title */}
        <div className={`flex-1 ${isArabic ? 'text-right' : 'text-left'}`}>
          <h1 className="text-lg font-semibold">
            {isArabic ? 'لوحة التحكم الإدارية' : 'Admin Dashboard'}
          </h1>
        </div>

        {/* Header Actions */}
        <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Languages className="w-4 h-4" />
                <span className="ml-1">{isArabic ? 'العربية' : 'English'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isArabic ? 'start' : 'end'}>
              <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500" />
          </Button>

          {/* User Menu */}
          {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`text-left ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className="text-sm font-medium">
                      {isArabic ? currentUser.arabicName || currentUser.name : currentUser.name}
                    </div>
                    {roleInfo && (
                      <Badge className={`text-xs ${roleInfo.color}`}>
                        {roleInfo[language]}
                      </Badge>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isArabic ? 'start' : 'end'}>
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  {isArabic ? 'الملف الشخصي' : 'Profile'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  {isArabic ? 'الإعدادات' : 'Settings'}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  {isArabic ? 'تسجيل الخروج' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

// Main Arabic Admin Layout
export const ArabicAdminLayout: React.FC<ArabicAdminLayoutProps> = ({
  children,
  currentUser
}) => {
  return (
    <ArabicAdminProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full arabic-admin-layout">
          <ArabicAdminSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <ArabicAdminHeader currentUser={currentUser} />
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ArabicAdminProvider>
  );
};

// Specialized Arabic Admin Components
export const ArabicAdminCard: React.FC<{
  title: string;
  arabicTitle?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, arabicTitle, children, className = '' }) => {
  const { language } = useArabicAdmin();
  const isArabic = language === 'ar';

  return (
    <Card className={`arabic-admin-card ${className}`}>
      <CardHeader className={isArabic ? 'text-right' : 'text-left'}>
        <CardTitle>{isArabic ? arabicTitle || title : title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export const ArabicAdminButton: React.FC<{
  children: React.ReactNode;
  arabicChildren?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  className?: string;
}> = ({ 
  children, 
  arabicChildren, 
  variant = 'default', 
  size = 'default',
  onClick,
  className = '' 
}) => {
  const { language } = useArabicAdmin();
  const isArabic = language === 'ar';

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={onClick}
      className={`arabic-admin-button ${className}`}
    >
      {isArabic ? arabicChildren || children : children}
    </Button>
  );
};

export const ArabicAdminInput: React.FC<{
  placeholder: string;
  arabicPlaceholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  className?: string;
}> = ({ 
  placeholder, 
  arabicPlaceholder, 
  value, 
  onChange, 
  type = 'text',
  className = '' 
}) => {
  const { language } = useArabicAdmin();
  const isArabic = language === 'ar';

  return (
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={isArabic ? arabicPlaceholder || placeholder : placeholder}
      className={`arabic-admin-input ${isArabic ? 'text-right' : 'text-left'} ${className}`}
    />
  );
};