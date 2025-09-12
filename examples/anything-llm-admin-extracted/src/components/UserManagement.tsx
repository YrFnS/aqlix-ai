/**
 * Iraqi AI User Management Component
 * Advanced user management with Iraqi professional roles and cultural compliance
 * 
 * Features:
 * - Arabic-first user interface
 * - Iraqi professional role management (lawyer, doctor, teacher, etc.)
 * - Cultural compliance tracking per user
 * - Governorate-based user organization
 * - Professional license validation
 * - Role-based permission management
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  Settings,
  UserCheck,
  UserX,
  Globe,
  Languages,
  Building2,
  GraduationCap,
  Briefcase,
  Activity
} from 'lucide-react';

import {
  IraqiUser,
  AdminRole,
  IraqiProfessionalRole,
  ComplianceLevel,
  FilterOptions,
  SortOptions,
  PaginatedResponse
} from '../types/admin';
import { useUserManagement } from '../hooks/useUserManagement';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import UserForm from './forms/UserForm';
import BulkActions from './BulkActions';
import ExportDialog from './ExportDialog';

interface UserManagementProps {
  language: 'ar' | 'en';
  isRTL: boolean;
}

const UserManagement: React.FC<UserManagementProps> = ({ language, isRTL }) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IraqiUser | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    role: undefined,
    professionalRole: undefined,
    complianceLevel: undefined,
    status: undefined,
    governorate: undefined
  });

  // Sorting
  const [sort, setSort] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Custom hook for user management
  const {
    users,
    totalCount,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    assignRole,
    bulkUpdateUsers,
    exportUsers,
    refreshUsers
  } = useUserManagement();

  // Translations
  const t = {
    ar: {
      userManagement: 'إدارة المستخدمين',
      addUser: 'إضافة مستخدم',
      editUser: 'تعديل المستخدم',
      deleteUser: 'حذف المستخدم',
      searchUsers: 'البحث في المستخدمين...',
      filters: 'المرشحات',
      export: 'تصدير',
      import: 'استيراد',
      bulkActions: 'إجراءات جماعية',
      refresh: 'تحديث',
      selectAll: 'تحديد الكل',
      selected: 'محدد',
      users: 'مستخدمين',
      name: 'الاسم',
      arabicName: 'الاسم بالعربية',
      email: 'البريد الإلكتروني',
      role: 'الدور',
      professionalRole: 'الدور المهني',
      organization: 'المؤسسة',
      department: 'القسم',
      governorate: 'المحافظة',
      status: 'الحالة',
      complianceScore: 'درجة الالتزام',
      lastActivity: 'آخر نشاط',
      createdAt: 'تاريخ الإنشاء',
      actions: 'الإجراءات',
      active: 'نشط',
      inactive: 'غير نشط',
      suspended: 'معلق',
      view: 'عرض',
      edit: 'تعديل',
      delete: 'حذف',
      activate: 'تفعيل',
      deactivate: 'إلغاء التفعيل',
      suspend: 'تعليق',
      assignRole: 'تعيين دور',
      viewProfile: 'عرض الملف الشخصي',
      sendMessage: 'إرسال رسالة',
      resetPassword: 'إعادة تعيين كلمة المرور',
      // Iraqi Professional Roles
      lawyer: 'محامي',
      doctor: 'طبيب',
      teacher: 'معلم',
      engineer: 'مهندس',
      administrator: 'إداري',
      manager: 'مدير',
      analyst: 'محلل',
      // Admin Roles
      superAdmin: 'مدير عام',
      organizationAdmin: 'مدير مؤسسة',
      departmentAdmin: 'مدير قسم',
      supervisor: 'مشرف',
      userAdmin: 'مدير مستخدمين',
      viewer: 'مشاهد',
      // Compliance Levels
      fullCompliance: 'التزام كامل',
      standardCompliance: 'التزام قياسي',
      basicCompliance: 'التزام أساسي',
      nonCompliant: 'غير ملتزم',
      // Governorates
      baghdad: 'بغداد',
      basra: 'البصرة',
      mosul: 'الموصل',
      erbil: 'أربيل',
      najaf: 'النجف',
      karbala: 'كربلاء',
      hillah: 'الحلة',
      ramadi: 'الرمادي',
      kirkuk: 'كركوك',
      dohuk: 'دهوك',
      samarra: 'سامراء',
      kut: 'الكوت',
      amarah: 'العمارة',
      nasiriyah: 'الناصرية',
      diwaniyah: 'الديوانية',
      // Messages
      confirmDelete: 'هل أنت متأكد من حذف هذا المستخدم؟',
      userDeleted: 'تم حذف المستخدم بنجاح',
      userUpdated: 'تم تحديث المستخدم بنجاح',
      userCreated: 'تم إنشاء المستخدم بنجاح',
      selectUsersForBulkAction: 'يرجى تحديد مستخدمين للإجراء الجماعي',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      noUsers: 'لا توجد مستخدمين',
      noUsersFound: 'لم يتم العثور على مستخدمين',
      showingResults: 'عرض النتائج',
      of: 'من',
      page: 'الصفحة',
      rowsPerPage: 'صفوف في الصفحة',
      next: 'التالي',
      previous: 'السابق',
      clearFilters: 'مسح المرشحات',
      applyFilters: 'تطبيق المرشحات'
    },
    en: {
      userManagement: 'User Management',
      addUser: 'Add User',
      editUser: 'Edit User',
      deleteUser: 'Delete User',
      searchUsers: 'Search users...',
      filters: 'Filters',
      export: 'Export',
      import: 'Import',
      bulkActions: 'Bulk Actions',
      refresh: 'Refresh',
      selectAll: 'Select All',
      selected: 'selected',
      users: 'users',
      name: 'Name',
      arabicName: 'Arabic Name',
      email: 'Email',
      role: 'Role',
      professionalRole: 'Professional Role',
      organization: 'Organization',
      department: 'Department',
      governorate: 'Governorate',
      status: 'Status',
      complianceScore: 'Compliance Score',
      lastActivity: 'Last Activity',
      createdAt: 'Created Date',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      suspended: 'Suspended',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      activate: 'Activate',
      deactivate: 'Deactivate',
      suspend: 'Suspend',
      assignRole: 'Assign Role',
      viewProfile: 'View Profile',
      sendMessage: 'Send Message',
      resetPassword: 'Reset Password',
      // Iraqi Professional Roles
      lawyer: 'Lawyer',
      doctor: 'Doctor',
      teacher: 'Teacher',
      engineer: 'Engineer',
      administrator: 'Administrator',
      manager: 'Manager',
      analyst: 'Analyst',
      // Admin Roles
      superAdmin: 'Super Admin',
      organizationAdmin: 'Organization Admin',
      departmentAdmin: 'Department Admin',
      supervisor: 'Supervisor',
      userAdmin: 'User Admin',
      viewer: 'Viewer',
      // Compliance Levels
      fullCompliance: 'Full Compliance',
      standardCompliance: 'Standard Compliance',
      basicCompliance: 'Basic Compliance',
      nonCompliant: 'Non-Compliant',
      // Governorates
      baghdad: 'Baghdad',
      basra: 'Basra',
      mosul: 'Mosul',
      erbil: 'Erbil',
      najaf: 'Najaf',
      karbala: 'Karbala',
      hillah: 'Hillah',
      ramadi: 'Ramadi',
      kirkuk: 'Kirkuk',
      dohuk: 'Dohuk',
      samarra: 'Samarra',
      kut: 'Kut',
      amarah: 'Amarah',
      nasiriyah: 'Nasiriyah',
      diwaniyah: 'Diwaniyah',
      // Messages
      confirmDelete: 'Are you sure you want to delete this user?',
      userDeleted: 'User deleted successfully',
      userUpdated: 'User updated successfully',
      userCreated: 'User created successfully',
      selectUsersForBulkAction: 'Please select users for bulk action',
      loading: 'Loading...',
      error: 'An error occurred',
      noUsers: 'No users found',
      noUsersFound: 'No users found',
      showingResults: 'Showing results',
      of: 'of',
      page: 'Page',
      rowsPerPage: 'Rows per page',
      next: 'Next',
      previous: 'Previous',
      clearFilters: 'Clear Filters',
      applyFilters: 'Apply Filters'
    }
  };

  const translations = t[language];

  // Update search filter when search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Refresh users when filters or sort change
  useEffect(() => {
    refreshUsers(currentPage, pageSize, filters, sort);
  }, [filters, sort, currentPage, pageSize]);

  // Memoized filtered and sorted users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users;
  }, [users, filters, sort]);

  // Handle user selection
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(user => user.id) || []);
    }
  };

  // Handle user actions
  const handleCreateUser = async (userData: Partial<IraqiUser>) => {
    try {
      await createUser(userData);
      setShowUserForm(false);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<IraqiUser>) => {
    try {
      await updateUser(userId, updates);
      setEditingUser(null);
      setShowUserForm(false);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm(translations.confirmDelete)) {
      try {
        await deleteUser(userId);
        setSelectedUsers(prev => prev.filter(id => id !== userId));
        // Show success message
      } catch (error) {
        // Show error message
      }
    }
  };

  const handleStatusChange = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      if (status === 'active') {
        await activateUser(userId);
      } else if (status === 'inactive') {
        await deactivateUser(userId);
      } else {
        // Handle suspend action
      }
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: XCircle },
      suspended: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || XCircle;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-800'}`}>
        <Icon className="h-3 w-3 mr-1" />
        {translations[status as keyof typeof translations] || status}
      </span>
    );
  };

  // Render compliance score
  const renderComplianceScore = (score: number) => {
    let color = 'text-red-600';
    if (score >= 95) color = 'text-green-600';
    else if (score >= 85) color = 'text-yellow-600';
    else if (score >= 70) color = 'text-orange-600';

    return (
      <span className={`font-medium ${color}`}>
        {score}%
      </span>
    );
  };

  // Render user row
  const renderUserRow = (user: IraqiUser) => (
    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => handleSelectUser(user.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
            <div className="text-sm font-medium text-gray-900">
              {user.name}
            </div>
            {user.arabicName && (
              <div className="text-sm text-gray-500 font-arabic">
                {user.arabicName}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
        <div className="text-sm text-gray-500">
          {translations[user.role as keyof typeof translations] || user.role}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Briefcase className="h-3 w-3 mr-1" />
          {user.professionalRole ? translations[user.professionalRole as keyof typeof translations] : '-'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.organizationId}</div>
        {user.departmentId && (
          <div className="text-sm text-gray-500">{user.departmentId}</div>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {user.governorateCode ? translations[user.governorateCode as keyof typeof translations] : '-'}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {renderStatusBadge(user.isActive ? 'active' : 'inactive')}
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        {renderComplianceScore(
          user.complianceStatus === 'full_compliance' ? 95 :
          user.complianceStatus === 'standard_compliance' ? 85 :
          user.complianceStatus === 'basic_compliance' ? 70 : 50
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>{new Date(user.lastActivity).toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US')}</div>
        <div className="text-xs">{new Date(user.lastActivity).toLocaleTimeString(language === 'ar' ? 'ar-IQ' : 'en-US')}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.createdAt).toLocaleDateString(language === 'ar' ? 'ar-IQ' : 'en-US')}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setEditingUser(user);
              setShowUserForm(true);
            }}
            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
            title={translations.edit}
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
            title={translations.delete}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => {
              if (user.isActive) {
                handleStatusChange(user.id, 'inactive');
              } else {
                handleStatusChange(user.id, 'active');
              }
            }}
            className={`p-1 rounded-full hover:bg-opacity-50 ${
              user.isActive 
                ? 'text-orange-600 hover:bg-orange-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
            title={user.isActive ? translations.deactivate : translations.activate}
          >
            {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
          </button>

          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50"
            title={translations.actions}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  if (loading && !users) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="large" message={translations.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">{translations.userManagement}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {translations.showingResults} {users?.length || 0} {translations.of} {totalCount} {translations.users}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowExportDialog(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            {translations.export}
          </button>

          <button
            onClick={() => setShowUserForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            {translations.addUser}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={translations.searchUsers}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            showFilters ? 'ring-2 ring-blue-500 border-blue-500' : ''
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          {translations.filters}
        </button>

        {/* Refresh */}
        <button
          onClick={() => refreshUsers()}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {translations.refresh}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Role Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translations.role}
              </label>
              <select
                value={filters.role || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value as AdminRole || undefined }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="super_admin">{translations.superAdmin}</option>
                <option value="organization_admin">{translations.organizationAdmin}</option>
                <option value="department_admin">{translations.departmentAdmin}</option>
                <option value="supervisor">{translations.supervisor}</option>
                <option value="user_admin">{translations.userAdmin}</option>
                <option value="viewer">{translations.viewer}</option>
              </select>
            </div>

            {/* Professional Role Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translations.professionalRole}
              </label>
              <select
                value={filters.professionalRole || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, professionalRole: e.target.value as IraqiProfessionalRole || undefined }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Professions</option>
                <option value="lawyer">{translations.lawyer}</option>
                <option value="doctor">{translations.doctor}</option>
                <option value="teacher">{translations.teacher}</option>
                <option value="engineer">{translations.engineer}</option>
                <option value="administrator">{translations.administrator}</option>
                <option value="manager">{translations.manager}</option>
                <option value="analyst">{translations.analyst}</option>
              </select>
            </div>

            {/* Compliance Level Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translations.complianceScore}
              </label>
              <select
                value={filters.complianceLevel || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, complianceLevel: e.target.value as ComplianceLevel || undefined }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="full_compliance">{translations.fullCompliance}</option>
                <option value="standard_compliance">{translations.standardCompliance}</option>
                <option value="basic_compliance">{translations.basicCompliance}</option>
                <option value="non_compliant">{translations.nonCompliant}</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translations.status}
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any || undefined }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">{translations.active}</option>
                <option value="inactive">{translations.inactive}</option>
                <option value="suspended">{translations.suspended}</option>
              </select>
            </div>

            {/* Governorate Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translations.governorate}
              </label>
              <select
                value={filters.governorate || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, governorate: e.target.value || undefined }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Governorates</option>
                <option value="baghdad">{translations.baghdad}</option>
                <option value="basra">{translations.basra}</option>
                <option value="mosul">{translations.mosul}</option>
                <option value="erbil">{translations.erbil}</option>
                <option value="najaf">{translations.najaf}</option>
                <option value="karbala">{translations.karbala}</option>
                <option value="hillah">{translations.hillah}</option>
                <option value="ramadi">{translations.ramadi}</option>
                <option value="kirkuk">{translations.kirkuk}</option>
                <option value="dohuk">{translations.dohuk}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setFilters({
                  search: '',
                  role: undefined,
                  professionalRole: undefined,
                  complianceLevel: undefined,
                  status: undefined,
                  governorate: undefined
                });
                setSearchTerm('');
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {translations.clearFilters}
            </button>
            
            <button
              onClick={() => setShowFilters(false)}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              {translations.applyFilters}
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-blue-900">
                {selectedUsers.length} {translations.selected}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <BulkActions
                selectedUserIds={selectedUsers}
                onComplete={() => setSelectedUsers([])}
                language={language}
              />
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users?.length && users?.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.name}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.email} / {translations.role}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.professionalRole}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.organization}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.governorate}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.status}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.complianceScore}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.lastActivity}
                </th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.createdAt}
                </th>
                
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {translations.actions}
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map(renderUserRow)}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users?.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">{translations.noUsers}</h3>
            <p className="mt-1 text-sm text-gray-500">{translations.noUsersFound}</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {translations.previous}
            </button>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage * pageSize >= totalCount}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              {translations.next}
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {translations.showingResults} <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> {translations.of} <span className="font-medium">{Math.min(currentPage * pageSize, totalCount)}</span> {translations.of} <span className="font-medium">{totalCount}</span> {translations.users}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">{translations.rowsPerPage}</span>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {translations.previous}
                </button>
                
                {/* Page numbers would go here */}
                
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= totalCount}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  {translations.next}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showUserForm && (
        <Modal
          isOpen={showUserForm}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          title={editingUser ? translations.editUser : translations.addUser}
          size="large"
        >
          <UserForm
            user={editingUser}
            onSave={editingUser ? 
              (updates) => handleUpdateUser(editingUser.id, updates) :
              handleCreateUser
            }
            onCancel={() => {
              setShowUserForm(false);
              setEditingUser(null);
            }}
            language={language}
            isRTL={isRTL}
          />
        </Modal>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          onExport={exportUsers}
          filters={filters}
          language={language}
        />
      )}
    </div>
  );
};

export default UserManagement;