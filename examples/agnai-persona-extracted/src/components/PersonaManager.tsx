/**
 * Iraqi AI Persona Manager Component  
 * Professional domain filtering with Arabic/English support and cultural compliance monitoring
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Globe,
  Shield,
  Heart,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Download,
  Upload,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react';

import {
  IraqiPersona,
  PersonaFilter,
  PersonaMetrics,
  IraqiProfessionalDomain,
  IraqiGovernorate,
  PersonaID
} from '../types/persona';

interface PersonaManagerProps {
  personas: IraqiPersona[];
  metrics: PersonaMetrics;
  onCreatePersona: () => void;
  onEditPersona: (persona: IraqiPersona) => void;
  onDeletePersona: (personaId: PersonaID) => void;
  onPersonaSelect: (persona: IraqiPersona) => void;
  onRefresh: () => void;
  onExportPersona: (personaId: PersonaID) => void;
  onImportPersona: (file: File) => void;
  isRTL: boolean;
  language: 'ar' | 'en';
  isLoading?: boolean;
}

interface FilterState extends PersonaFilter {
  sortBy: 'name' | 'domain' | 'created' | 'compliance' | 'usage';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list' | 'table';
}

const PersonaManager: React.FC<PersonaManagerProps> = ({
  personas,
  metrics,
  onCreatePersona,
  onEditPersona,
  onDeletePersona,
  onPersonaSelect,
  onRefresh,
  onExportPersona,
  onImportPersona,
  isRTL,
  language,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'grid',
    professionalDomain: [],
    governorate: [],
    culturalCompliance: 95,
    islamicCompliance: 96,
    isActive: undefined,
    tags: [],
    searchTerm: ''
  });

  const [selectedPersonas, setSelectedPersonas] = useState<PersonaID[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showMetrics, setShowMetrics] = useState(true);

  // Professional domain options with icons
  const professionalDomains = useMemo(() => [
    { value: 'legal' as IraqiProfessionalDomain, label: 'Legal Professional', labelAr: 'متخصص قانوني', icon: '⚖️' },
    { value: 'medical' as IraqiProfessionalDomain, label: 'Medical Professional', labelAr: 'متخصص طبي', icon: '🏥' },
    { value: 'educational' as IraqiProfessionalDomain, label: 'Educational Professional', labelAr: 'متخصص تعليمي', icon: '📚' },
    { value: 'engineering' as IraqiProfessionalDomain, label: 'Engineering Professional', labelAr: 'مهندس متخصص', icon: '🔧' },
    { value: 'business' as IraqiProfessionalDomain, label: 'Business Professional', labelAr: 'متخصص أعمال', icon: '💼' },
    { value: 'government' as IraqiProfessionalDomain, label: 'Government Official', labelAr: 'موظف حكومي', icon: '🏛️' },
    { value: 'religious' as IraqiProfessionalDomain, label: 'Religious Scholar', labelAr: 'عالم دين', icon: '🕌' },
    { value: 'cultural' as IraqiProfessionalDomain, label: 'Cultural Expert', labelAr: 'خبير ثقافي', icon: '🎭' },
    { value: 'technology' as IraqiProfessionalDomain, label: 'Technology Professional', labelAr: 'متخصص تقني', icon: '💻' },
    { value: 'general' as IraqiProfessionalDomain, label: 'General Assistant', labelAr: 'مساعد عام', icon: '🤝' }
  ], []);

  // Governorate options with Arabic names
  const governorates = useMemo(() => [
    { value: 'baghdad' as IraqiGovernorate, label: 'Baghdad', labelAr: 'بغداد' },
    { value: 'basra' as IraqiGovernorate, label: 'Basra', labelAr: 'البصرة' },
    { value: 'mosul' as IraqiGovernorate, label: 'Mosul', labelAr: 'الموصل' },
    { value: 'erbil' as IraqiGovernorate, label: 'Erbil', labelAr: 'أربيل' },
    { value: 'najaf' as IraqiGovernorate, label: 'Najaf', labelAr: 'النجف' },
    { value: 'karbala' as IraqiGovernorate, label: 'Karbala', labelAr: 'كربلاء' },
    { value: 'hillah' as IraqiGovernorate, label: 'Hillah', labelAr: 'الحلة' },
    { value: 'ramadi' as IraqiGovernorate, label: 'Ramadi', labelAr: 'الرمادي' },
    { value: 'kirkuk' as IraqiGovernorate, label: 'Kirkuk', labelAr: 'كركوك' },
    { value: 'dohuk' as IraqiGovernorate, label: 'Dohuk', labelAr: 'دهوك' },
    { value: 'samarra' as IraqiGovernorate, label: 'Samarra', labelAr: 'سامراء' },
    { value: 'kut' as IraqiGovernorate, label: 'Kut', labelAr: 'الكوت' },
    { value: 'amarah' as IraqiGovernorate, label: 'Amarah', labelAr: 'العمارة' },
    { value: 'nasiriyah' as IraqiGovernorate, label: 'Nasiriyah', labelAr: 'الناصرية' },
    { value: 'diwaniyah' as IraqiGovernorate, label: 'Diwaniyah', labelAr: 'الديوانية' }
  ], []);

  // Filter and sort personas
  const filteredPersonas = useMemo(() => {
    let filtered = [...personas];

    // Text search
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(persona => 
        persona.name.toLowerCase().includes(searchLower) ||
        persona.nameArabic?.toLowerCase().includes(searchLower) ||
        persona.description.toLowerCase().includes(searchLower) ||
        persona.descriptionArabic?.toLowerCase().includes(searchLower) ||
        persona.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Professional domain filter
    if (filters.professionalDomain && filters.professionalDomain.length > 0) {
      filtered = filtered.filter(persona => 
        filters.professionalDomain!.includes(persona.professionalDomain)
      );
    }

    // Governorate filter
    if (filters.governorate && filters.governorate.length > 0) {
      filtered = filtered.filter(persona => 
        filters.governorate!.includes(persona.governorate)
      );
    }

    // Cultural compliance filter
    if (filters.culturalCompliance) {
      filtered = filtered.filter(persona => 
        persona.culturalProfile.culturalSensitivity >= filters.culturalCompliance!
      );
    }

    // Islamic compliance filter
    if (filters.islamicCompliance) {
      filtered = filtered.filter(persona => 
        persona.islamicCompliance.islamicValuesCompliance >= filters.islamicCompliance!
      );
    }

    // Active status filter
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(persona => persona.isActive === filters.isActive);
    }

    // Tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(persona =>
        filters.tags!.some(tag => persona.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = language === 'ar' && a.nameArabic ? a.nameArabic : a.name;
          bValue = language === 'ar' && b.nameArabic ? b.nameArabic : b.name;
          break;
        case 'domain':
          aValue = a.professionalDomain;
          bValue = b.professionalDomain;
          break;
        case 'created':
          aValue = a.createdAt;
          bValue = b.createdAt;
          break;
        case 'compliance':
          aValue = (a.culturalProfile.culturalSensitivity + a.islamicCompliance.islamicValuesCompliance) / 2;
          bValue = (b.culturalProfile.culturalSensitivity + b.islamicCompliance.islamicValuesCompliance) / 2;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [personas, filters, language]);

  // Update filter state
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Toggle domain filter
  const toggleDomainFilter = useCallback((domain: IraqiProfessionalDomain) => {
    setFilters(prev => ({
      ...prev,
      professionalDomain: prev.professionalDomain?.includes(domain)
        ? prev.professionalDomain.filter(d => d !== domain)
        : [...(prev.professionalDomain || []), domain]
    }));
  }, []);

  // Toggle governorate filter
  const toggleGovernorateFilter = useCallback((governorate: IraqiGovernorate) => {
    setFilters(prev => ({
      ...prev,
      governorate: prev.governorate?.includes(governorate)
        ? prev.governorate.filter(g => g !== governorate)
        : [...(prev.governorate || []), governorate]
    }));
  }, []);

  // Handle persona selection
  const togglePersonaSelection = useCallback((personaId: PersonaID) => {
    setSelectedPersonas(prev =>
      prev.includes(personaId)
        ? prev.filter(id => id !== personaId)
        : [...prev, personaId]
    );
  }, []);

  // Select all filtered personas
  const selectAllFiltered = useCallback(() => {
    const allIds = filteredPersonas.map(p => p.id);
    setSelectedPersonas(
      selectedPersonas.length === allIds.length ? [] : allIds
    );
  }, [filteredPersonas, selectedPersonas]);

  // Get compliance status color
  const getComplianceColor = (cultural: number, islamic: number) => {
    const average = (cultural + islamic) / 2;
    if (average >= 95) return 'text-green-600 bg-green-100';
    if (average >= 90) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Handle file import
  const handleFileImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportPersona(file);
      event.target.value = '';
    }
  }, [onImportPersona]);

  // Render metrics dashboard
  const renderMetrics = () => {
    if (!showMetrics) return null;

    return (
      <div className="bg-white rounded-lg shadow mb-6">
        <div className={`flex items-center justify-between p-6 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'إحصائيات الشخصيات' : 'Persona Metrics'}
            </h3>
          </div>
          <button
            onClick={() => setShowMetrics(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalPersonas}</div>
              <div className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'إجمالي الشخصيات' : 'Total Personas'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.activePersonas}</div>
              <div className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'الشخصيات النشطة' : 'Active Personas'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.averageCulturalCompliance)}%
              </div>
              <div className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'الامتثال الثقافي' : 'Cultural Compliance'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {Math.round(metrics.averageIslamicCompliance)}%
              </div>
              <div className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'الامتثال الإسلامي' : 'Islamic Compliance'}
              </div>
            </div>
          </div>

          {/* Domain Distribution */}
          <div className="mt-6">
            <h4 className={`text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'توزيع المجالات المهنية' : 'Professional Domain Distribution'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.domainDistribution).map(([domain, count]) => {
                const domainInfo = professionalDomains.find(d => d.value === domain);
                return (
                  <div
                    key={domain}
                    className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    <span className="mr-2">{domainInfo?.icon}</span>
                    <span className={isRTL ? 'font-arabic' : ''}>
                      {language === 'ar' ? domainInfo?.labelAr : domainInfo?.label}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render filters panel
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="bg-white rounded-lg shadow mb-6">
        <div className={`flex items-center justify-between p-6 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Filter className="w-5 h-5 text-blue-600 mr-3" />
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'تصفية الشخصيات' : 'Filter Personas'}
            </h3>
          </div>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Professional Domains */}
          <div>
            <h4 className={`text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'المجالات المهنية' : 'Professional Domains'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {professionalDomains.map(domain => (
                <button
                  key={domain.value}
                  onClick={() => toggleDomainFilter(domain.value)}
                  className={`
                    flex items-center px-3 py-2 rounded-lg border text-sm transition-colors
                    ${filters.professionalDomain?.includes(domain.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    ${isRTL ? 'flex-row-reverse font-arabic' : ''}
                  `}
                >
                  <span className="mr-2">{domain.icon}</span>
                  {language === 'ar' ? domain.labelAr : domain.label}
                </button>
              ))}
            </div>
          </div>

          {/* Governorates */}
          <div>
            <h4 className={`text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'المحافظات' : 'Governorates'}
            </h4>
            <div className="flex flex-wrap gap-2">
              {governorates.map(gov => (
                <button
                  key={gov.value}
                  onClick={() => toggleGovernorateFilter(gov.value)}
                  className={`
                    px-3 py-2 rounded-lg border text-sm transition-colors
                    ${filters.governorate?.includes(gov.value)
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }
                    ${isRTL ? 'font-arabic' : ''}
                  `}
                >
                  {language === 'ar' ? gov.labelAr : gov.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Sliders */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' ? 'الحد الأدنى للامتثال الثقافي' : 'Min Cultural Compliance'}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.culturalCompliance || 95}
                onChange={(e) => updateFilter('culturalCompliance', parseInt(e.target.value))}
                className="w-full"
              />
              <div className={`text-xs text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>
                {filters.culturalCompliance || 95}%
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' ? 'الحد الأدنى للامتثال الإسلامي' : 'Min Islamic Compliance'}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.islamicCompliance || 96}
                onChange={(e) => updateFilter('islamicCompliance', parseInt(e.target.value))}
                className="w-full"
              />
              <div className={`text-xs text-gray-500 mt-1 ${isRTL ? 'text-right' : ''}`}>
                {filters.islamicCompliance || 96}%
              </div>
            </div>
          </div>

          {/* Active Status */}
          <div>
            <h4 className={`text-sm font-medium text-gray-700 mb-3 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'حالة النشاط' : 'Active Status'}
            </h4>
            <div className={`flex space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
              {[
                { value: undefined, label: language === 'ar' ? 'الكل' : 'All' },
                { value: true, label: language === 'ar' ? 'نشط' : 'Active' },
                { value: false, label: language === 'ar' ? 'غير نشط' : 'Inactive' }
              ].map(option => (
                <button
                  key={String(option.value)}
                  onClick={() => updateFilter('isActive', option.value)}
                  className={`
                    px-4 py-2 rounded-lg text-sm transition-colors
                    ${filters.isActive === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                    ${isRTL ? 'font-arabic' : ''}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render persona card
  const renderPersonaCard = (persona: IraqiPersona) => {
    const domainInfo = professionalDomains.find(d => d.value === persona.professionalDomain);
    const governorateInfo = governorates.find(g => g.value === persona.governorate);
    const culturalScore = persona.culturalProfile.culturalSensitivity;
    const islamicScore = persona.islamicCompliance.islamicValuesCompliance;
    const isSelected = selectedPersonas.includes(persona.id);

    return (
      <div
        key={persona.id}
        className={`
          bg-white rounded-lg shadow hover:shadow-md transition-shadow border
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => togglePersonaSelection(persona.id)}
              className="mr-3"
            />
            <div className="text-2xl mr-3">{domainInfo?.icon}</div>
            <div>
              <h3 className={`font-semibold text-gray-900 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' && persona.nameArabic ? persona.nameArabic : persona.name}
              </h3>
              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right font-arabic' : ''}`}>
                {language === 'ar' ? domainInfo?.labelAr : domainInfo?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${persona.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
            `}>
              {persona.isActive 
                ? (language === 'ar' ? 'نشط' : 'Active')
                : (language === 'ar' ? 'غير نشط' : 'Inactive')
              }
            </div>

            <div className="relative">
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className={`text-gray-600 text-sm mb-4 line-clamp-2 ${isRTL ? 'text-right font-arabic' : ''}`}>
            {language === 'ar' && persona.descriptionArabic 
              ? persona.descriptionArabic 
              : persona.description}
          </p>

          {/* Compliance Scores */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${getComplianceColor(culturalScore, 0).split(' ')[0]}`}>
                {Math.round(culturalScore)}%
              </div>
              <div className={`text-xs text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'ثقافي' : 'Cultural'}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-lg font-bold ${getComplianceColor(0, islamicScore).split(' ')[0]}`}>
                {Math.round(islamicScore)}%
              </div>
              <div className={`text-xs text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'إسلامي' : 'Islamic'}
              </div>
            </div>
          </div>

          {/* Location & Tags */}
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center text-sm text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Globe className="w-4 h-4 mr-1" />
              <span className={isRTL ? 'font-arabic' : ''}>
                {language === 'ar' ? governorateInfo?.labelAr : governorateInfo?.label}
              </span>
            </div>
            
            {persona.tags.length > 0 && (
              <div className="flex space-x-1">
                {persona.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {persona.tags.length > 2 && (
                  <span className="text-xs text-gray-400">
                    +{persona.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center justify-between p-4 bg-gray-50 border-t ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => onPersonaSelect(persona)}
              className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            >
              <Eye className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'عرض' : 'View'}
            </button>
            
            <button
              onClick={() => onEditPersona(persona)}
              className="flex items-center px-3 py-1 text-green-600 hover:bg-green-100 rounded transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              {language === 'ar' ? 'تعديل' : 'Edit'}
            </button>
          </div>

          <div className={`flex space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={() => onExportPersona(persona.id)}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onDeletePersona(persona.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Users className="w-6 h-6 text-blue-600 mr-3" />
          <div>
            <h1 className={`text-2xl font-bold text-gray-900 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' ? 'إدارة الشخصيات العراقية' : 'Iraqi Persona Manager'}
            </h1>
            <p className={`text-gray-600 ${isRTL ? 'text-right font-arabic' : ''}`}>
              {language === 'ar' 
                ? 'إدارة وتخصيص الشخصيات الذكية للمهنيين العراقيين'
                : 'Manage and customize AI personas for Iraqi professionals'
              }
            </p>
          </div>
        </div>

        <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </button>

          <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'استيراد' : 'Import'}
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            onClick={onCreatePersona}
            className={`flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'شخصية جديدة' : 'New Persona'}
          </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {renderMetrics()}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className={`flex items-center space-x-4 mb-4 ${isRTL ? 'space-x-reverse' : ''}`}>
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                placeholder={language === 'ar' ? 'البحث في الشخصيات...' : 'Search personas...'}
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right font-arabic pr-10 pl-4' : ''}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'text-gray-700'} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'تصفية' : 'Filter'}
            </button>

            {/* View Mode */}
            <div className={`flex items-center border border-gray-300 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              {(['grid', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => updateFilter('viewMode', mode)}
                  className={`px-3 py-2 text-sm transition-colors ${
                    filters.viewMode === mode 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode === 'grid' 
                    ? (language === 'ar' ? 'شبكة' : 'Grid')
                    : (language === 'ar' ? 'قائمة' : 'List')
                  }
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder];
                updateFilter('sortBy', sortBy);
                updateFilter('sortOrder', sortOrder);
              }}
              className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'text-right font-arabic' : ''}`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="name-asc">{language === 'ar' ? 'الاسم (أ-ي)' : 'Name (A-Z)'}</option>
              <option value="name-desc">{language === 'ar' ? 'الاسم (ي-أ)' : 'Name (Z-A)'}</option>
              <option value="created-desc">{language === 'ar' ? 'الأحدث' : 'Newest'}</option>
              <option value="created-asc">{language === 'ar' ? 'الأقدم' : 'Oldest'}</option>
              <option value="compliance-desc">{language === 'ar' ? 'الامتثال (عالي)' : 'Compliance (High)'}</option>
              <option value="compliance-asc">{language === 'ar' ? 'الامتثال (منخفض)' : 'Compliance (Low)'}</option>
            </select>
          </div>

          {/* Active Filters Display */}
          {(filters.professionalDomain?.length || filters.governorate?.length || filters.tags?.length) && (
            <div className={`flex flex-wrap items-center gap-2 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
                {language === 'ar' ? 'التصفيات النشطة:' : 'Active filters:'}
              </span>
              
              {filters.professionalDomain?.map(domain => {
                const domainInfo = professionalDomains.find(d => d.value === domain);
                return (
                  <span
                    key={domain}
                    className="flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                  >
                    <span className="mr-1">{domainInfo?.icon}</span>
                    {language === 'ar' ? domainInfo?.labelAr : domainInfo?.label}
                    <button
                      onClick={() => toggleDomainFilter(domain)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              
              {filters.governorate?.map(gov => {
                const govInfo = governorates.find(g => g.value === gov);
                return (
                  <span
                    key={gov}
                    className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                  >
                    {language === 'ar' ? govInfo?.labelAr : govInfo?.label}
                    <button
                      onClick={() => toggleGovernorateFilter(gov)}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Bulk Actions */}
          {selectedPersonas.length > 0 && (
            <div className={`flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`text-sm text-blue-800 mr-4 ${isRTL ? 'font-arabic' : ''}`}>
                  {language === 'ar' 
                    ? `تم تحديد ${selectedPersonas.length} شخصية`
                    : `${selectedPersonas.length} personas selected`
                  }
                </span>
                
                <button
                  onClick={selectAllFiltered}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  {selectedPersonas.length === filteredPersonas.length
                    ? (language === 'ar' ? 'إلغاء تحديد الكل' : 'Deselect all')
                    : (language === 'ar' ? 'تحديد الكل' : 'Select all')
                  }
                </button>
              </div>

              <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                <button className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                  <Download className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'تصدير' : 'Export'}
                </button>
                
                <button className="flex items-center px-3 py-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                  <Trash2 className="w-4 h-4 mr-1" />
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {renderFilters()}

      {/* Results */}
      <div>
        <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`text-sm text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
            {language === 'ar'
              ? `عرض ${filteredPersonas.length} من أصل ${personas.length} شخصية`
              : `Showing ${filteredPersonas.length} of ${personas.length} personas`
            }
          </div>
        </div>

        {/* Personas Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-3" />
            <span className={`text-gray-600 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'تحميل الشخصيات...' : 'Loading personas...'}
            </span>
          </div>
        ) : filteredPersonas.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' ? 'لم يتم العثور على شخصيات' : 'No personas found'}
            </h3>
            <p className={`text-gray-600 mb-4 ${isRTL ? 'font-arabic' : ''}`}>
              {language === 'ar' 
                ? 'جرب تعديل معايير البحث أو إنشاء شخصية جديدة'
                : 'Try adjusting your search criteria or create a new persona'
              }
            </p>
            <button
              onClick={onCreatePersona}
              className={`inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'إنشاء شخصية جديدة' : 'Create New Persona'}
            </button>
          </div>
        ) : (
          <div className={`
            grid gap-6
            ${filters.viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
            }
          `}>
            {filteredPersonas.map(renderPersonaCard)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonaManager;