<template>
  <div 
    class="template-library"
    :class="[
      `library-${layoutDirection}`,
      { 'library-arabic': arabicMode },
      { 'library-ministry': ministryMode },
      `library-${culturalTheme}`
    ]"
    :dir="layoutDirection"
  >
    <!-- Library Header -->
    <div class="library-header">
      <div class="header-title">
        <Icon name="templates" />
        <h3>{{ arabicMode ? 'مكتبة القوالب' : 'Template Library' }}</h3>
        <Badge variant="secondary" class="template-count">
          {{ filteredTemplates.length }}
        </Badge>
      </div>
      
      <div class="header-actions">
        <Button
          variant="outline"
          size="sm"
          @click="createCustomTemplate"
          :title="arabicMode ? 'إنشاء قالب مخصص' : 'Create Custom Template'"
        >
          <Icon name="plus" />
          {{ arabicMode ? 'جديد' : 'New' }}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          @click="refreshLibrary"
          :loading="loading"
          :title="arabicMode ? 'تحديث المكتبة' : 'Refresh Library'"
        >
          <Icon name="refresh" />
        </Button>
      </div>
    </div>
    
    <!-- Search and Filters -->
    <div class="library-filters">
      <div class="search-section">
        <div class="search-input-wrapper">
          <Icon name="search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="arabicMode ? 'البحث في القوالب...' : 'Search templates...'"
            class="search-input"
            :dir="arabicMode ? 'rtl' : 'ltr'"
          />
        </div>
      </div>
      
      <div class="filter-section">
        <!-- Category Filter -->
        <Select v-model="selectedCategory">
          <SelectTrigger class="filter-select">
            <SelectValue 
              :placeholder="arabicMode ? 'جميع الفئات' : 'All Categories'"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {{ arabicMode ? 'جميع الفئات' : 'All Categories' }}
            </SelectItem>
            <SelectItem
              v-for="category in categories"
              :key="category.value"
              :value="category.value"
            >
              {{ arabicMode ? category.arabicLabel : category.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <!-- Ministry Filter -->
        <Select v-model="selectedMinistry">
          <SelectTrigger class="filter-select">
            <SelectValue 
              :placeholder="arabicMode ? 'جميع الوزارات' : 'All Ministries'"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {{ arabicMode ? 'جميع الوزارات' : 'All Ministries' }}
            </SelectItem>
            <SelectItem
              v-for="ministry in ministries"
              :key="ministry.value"
              :value="ministry.value"
            >
              {{ arabicMode ? ministry.arabicLabel : ministry.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <!-- Compliance Filter -->
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" class="filter-button">
              <Icon name="filter" />
              {{ arabicMode ? 'فلترة' : 'Filter' }}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :align="layoutDirection === 'rtl' ? 'end' : 'start'">
            <DropdownMenuLabel>
              {{ arabicMode ? 'فلترة التوافق' : 'Compliance Filter' }}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              :checked="showOnlyCompliant"
              @update:checked="showOnlyCompliant = $event"
            >
              <Icon name="islamic-certified" />
              {{ arabicMode ? 'متوافق إسلامياً فقط' : 'Islamic Compliant Only' }}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              :checked="showOnlyArabic"
              @update:checked="showOnlyArabic = $event"
            >
              <Icon name="arabic-supported" />
              {{ arabicMode ? 'يدعم العربية فقط' : 'Arabic Optimized Only' }}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              :checked="showOnlyPopular"
              @update:checked="showOnlyPopular = $event"
            >
              <Icon name="star" />
              {{ arabicMode ? 'الشائع فقط' : 'Popular Only' }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    
    <!-- Quick Categories -->
    <div class="quick-categories">
      <Button
        v-for="quickCat in quickCategories"
        :key="quickCat.id"
        :variant="selectedCategory === quickCat.id ? 'default' : 'ghost'"
        size="sm"
        @click="setQuickCategory(quickCat.id)"
        class="quick-category-btn"
      >
        <Icon :name="quickCat.icon" />
        <span>{{ arabicMode ? quickCat.arabicLabel : quickCat.label }}</span>
        <Badge v-if="quickCat.count" variant="secondary" class="category-count">
          {{ quickCat.count }}
        </Badge>
      </Button>
    </div>
    
    <!-- Templates Grid -->
    <ScrollArea class="templates-container">
      <div 
        v-if="loading" 
        class="loading-state"
      >
        <div class="loading-spinner">
          <Icon name="loader" class="animate-spin" />
        </div>
        <p>{{ arabicMode ? 'جاري تحميل القوالب...' : 'Loading templates...' }}</p>
      </div>
      
      <div 
        v-else-if="filteredTemplates.length === 0" 
        class="empty-state"
      >
        <Icon name="template-empty" class="empty-icon" />
        <h4>{{ arabicMode ? 'لا توجد قوالب' : 'No Templates Found' }}</h4>
        <p>
          {{ arabicMode 
            ? 'لم يتم العثور على قوالب تطابق معايير البحث الخاصة بك'
            : 'No templates match your search criteria'
          }}
        </p>
        <Button @click="clearFilters" variant="outline">
          {{ arabicMode ? 'مسح الفلاتر' : 'Clear Filters' }}
        </Button>
      </div>
      
      <div v-else class="templates-grid">
        <TemplateCard
          v-for="template in filteredTemplates"
          :key="template.id"
          :template="template"
          :arabic-mode="arabicMode"
          :layout-direction="layoutDirection"
          :cultural-theme="culturalTheme"
          @select="selectTemplate"
          @preview="previewTemplate"
          @star="toggleTemplateStar"
          @delete="deleteTemplate"
          @duplicate="duplicateTemplate"
          @export="exportTemplate"
        />
      </div>
    </ScrollArea>
    
    <!-- Library Footer -->
    <div class="library-footer">
      <div class="footer-stats">
        <span class="stat-item">
          {{ templates.length }} {{ arabicMode ? 'قالب' : 'templates' }}
        </span>
        <span class="stat-item">
          {{ compliantCount }} {{ arabicMode ? 'متوافق' : 'compliant' }}
        </span>
        <span class="stat-item">
          {{ popularCount }} {{ arabicMode ? 'شائع' : 'popular' }}
        </span>
      </div>
      
      <div class="footer-actions">
        <Button
          variant="ghost"
          size="sm"
          @click="showImportDialog = true"
          :title="arabicMode ? 'استيراد قوالب' : 'Import Templates'"
        >
          <Icon name="import" />
          {{ arabicMode ? 'استيراد' : 'Import' }}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          @click="exportSelected"
          :disabled="selectedTemplates.length === 0"
          :title="arabicMode ? 'تصدير محدد' : 'Export Selected'"
        >
          <Icon name="export" />
          {{ arabicMode ? 'تصدير' : 'Export' }}
        </Button>
      </div>
    </div>
    
    <!-- Template Preview Dialog -->
    <TemplatePreviewDialog
      v-if="showPreviewDialog"
      :template="previewingTemplate"
      :arabic-mode="arabicMode"
      :layout-direction="layoutDirection"
      @close="showPreviewDialog = false"
      @select="selectFromPreview"
      @edit="editTemplate"
    />
    
    <!-- Template Import Dialog -->
    <TemplateImportDialog
      v-if="showImportDialog"
      :arabic-mode="arabicMode"
      @close="showImportDialog = false"
      @import="importTemplates"
    />
    
    <!-- Custom Template Creator -->
    <CustomTemplateDialog
      v-if="showCustomDialog"
      :arabic-mode="arabicMode"
      :layout-direction="layoutDirection"
      :ministry-context="ministryContext"
      @close="showCustomDialog = false"
      @create="createTemplate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMinistryTemplates } from '../../composables/useMinistryTemplates'
import { useCulturalValidation } from '../../composables/useCulturalValidation'
import type { 
  WorkflowTemplate,
  MinistryWorkflowTemplate 
} from '../../types/workflow.types'
import type { MinistryConfiguration } from '../../types/ministry.types'

// Components
import TemplateCard from './TemplateCard.vue'
import TemplatePreviewDialog from './TemplatePreviewDialog.vue'
import TemplateImportDialog from './TemplateImportDialog.vue'
import CustomTemplateDialog from './CustomTemplateDialog.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem
} from '@/components/ui/dropdown-menu'

// Props
interface Props {
  arabicMode?: boolean
  layoutDirection?: 'ltr' | 'rtl'
  culturalTheme?: string
  ministryContext?: MinistryConfiguration
}

const props = withDefaults(defineProps<Props>(), {
  arabicMode: false,
  layoutDirection: 'ltr',
  culturalTheme: 'default'
})

// Emits
const emit = defineEmits<{
  'template-selected': [template: WorkflowTemplate]
  'template-created': [template: WorkflowTemplate]
  'template-updated': [template: WorkflowTemplate]
  'template-deleted': [templateId: string]
}>()

// Composables
const { t } = useI18n()
const {
  templates,
  loadTemplates,
  createMinistryTemplate,
  updateTemplate,
  deleteTemplate: removeTemplate,
  getTemplatesByCategory,
  getTemplatesByMinistry,
  starTemplate,
  unstarTemplate
} = useMinistryTemplates()

const { validateTemplateCompliance } = useCulturalValidation()

// Reactive data
const loading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedMinistry = ref('all')
const showOnlyCompliant = ref(false)
const showOnlyArabic = ref(false)
const showOnlyPopular = ref(false)
const selectedTemplates = ref<string[]>([])

// Dialog states
const showPreviewDialog = ref(false)
const showImportDialog = ref(false)
const showCustomDialog = ref(false)
const previewingTemplate = ref<WorkflowTemplate | null>(null)

// Computed properties
const ministryMode = computed(() => 
  props.ministryContext && props.ministryContext.id !== 'general'
)

const categories = computed(() => [
  { value: 'government', label: 'Government Services', arabicLabel: 'الخدمات الحكومية' },
  { value: 'healthcare', label: 'Healthcare', arabicLabel: 'الرعاية الصحية' },
  { value: 'education', label: 'Education', arabicLabel: 'التعليم' },
  { value: 'finance', label: 'Finance', arabicLabel: 'المالية' },
  { value: 'legal', label: 'Legal Services', arabicLabel: 'الخدمات القانونية' },
  { value: 'citizen-services', label: 'Citizen Services', arabicLabel: 'خدمات المواطنين' },
  { value: 'internal', label: 'Internal Processes', arabicLabel: 'العمليات الداخلية' }
])

const ministries = computed(() => [
  { value: 'health', label: 'Ministry of Health', arabicLabel: 'وزارة الصحة' },
  { value: 'education', label: 'Ministry of Education', arabicLabel: 'وزارة التربية' },
  { value: 'interior', label: 'Ministry of Interior', arabicLabel: 'وزارة الداخلية' },
  { value: 'justice', label: 'Ministry of Justice', arabicLabel: 'وزارة العدل' },
  { value: 'finance', label: 'Ministry of Finance', arabicLabel: 'وزارة المالية' },
  { value: 'transport', label: 'Ministry of Transport', arabicLabel: 'وزارة النقل' }
])

const quickCategories = computed(() => {
  const counts = getCategoryCounts()
  
  return [
    {
      id: 'all',
      label: 'All Templates',
      arabicLabel: 'جميع القوالب',
      icon: 'templates',
      count: templates.value.length
    },
    {
      id: 'government',
      label: 'Government',
      arabicLabel: 'حكومي',
      icon: 'government',
      count: counts.government || 0
    },
    {
      id: 'healthcare',
      label: 'Healthcare',
      arabicLabel: 'صحة',
      icon: 'health',
      count: counts.healthcare || 0
    },
    {
      id: 'education',
      label: 'Education',
      arabicLabel: 'تعليم',
      icon: 'education',
      count: counts.education || 0
    },
    {
      id: 'popular',
      label: 'Popular',
      arabicLabel: 'شائع',
      icon: 'star',
      count: templates.value.filter(t => t.usage.popularity > 0.8).length
    },
    {
      id: 'recent',
      label: 'Recent',
      arabicLabel: 'حديث',
      icon: 'clock',
      count: templates.value.filter(t => isRecent(t.metadata.createdAt)).length
    }
  ]
})

const filteredTemplates = computed(() => {
  let filtered = [...templates.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.arabicName?.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.arabicDescription?.toLowerCase().includes(query) ||
      template.metadata.tags.some(tag => tag.toLowerCase().includes(query)) ||
      template.metadata.arabicTags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply category filter
  if (selectedCategory.value !== 'all') {
    if (selectedCategory.value === 'popular') {
      filtered = filtered.filter(template => template.usage.popularity > 0.8)
    } else if (selectedCategory.value === 'recent') {
      filtered = filtered.filter(template => isRecent(template.metadata.createdAt))
    } else {
      filtered = filtered.filter(template => template.category === selectedCategory.value)
    }
  }

  // Apply ministry filter
  if (selectedMinistry.value !== 'all') {
    filtered = filtered.filter(template => template.ministry === selectedMinistry.value)
  }

  // Apply compliance filters
  if (showOnlyCompliant.value) {
    filtered = filtered.filter(template => template.cultural.islamicCompliant)
  }

  if (showOnlyArabic.value) {
    filtered = filtered.filter(template => template.cultural.arabicOptimized)
  }

  if (showOnlyPopular.value) {
    filtered = filtered.filter(template => template.usage.popularity > 0.7)
  }

  // Sort by relevance
  return filtered.sort((a, b) => {
    // Prioritize ministry-specific templates if in ministry context
    if (props.ministryContext) {
      const aMinistryMatch = a.ministry === props.ministryContext.id
      const bMinistryMatch = b.ministry === props.ministryContext.id
      if (aMinistryMatch && !bMinistryMatch) return -1
      if (!aMinistryMatch && bMinistryMatch) return 1
    }

    // Then by popularity
    if (a.usage.popularity !== b.usage.popularity) {
      return b.usage.popularity - a.usage.popularity
    }

    // Then by success rate
    if (a.usage.successRate !== b.usage.successRate) {
      return b.usage.successRate - a.usage.successRate
    }

    // Finally by creation date (newest first)
    return new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
  })
})

const compliantCount = computed(() => 
  templates.value.filter(t => t.cultural.islamicCompliant).length
)

const popularCount = computed(() => 
  templates.value.filter(t => t.usage.popularity > 0.8).length
)

// Methods
const getCategoryCounts = () => {
  const counts: Record<string, number> = {}
  
  templates.value.forEach(template => {
    counts[template.category] = (counts[template.category] || 0) + 1
  })
  
  return counts
}

const isRecent = (date: Date): boolean => {
  const now = new Date()
  const daysDiff = (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  return daysDiff <= 7 // Within last 7 days
}

const setQuickCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedMinistry.value = 'all'
  showOnlyCompliant.value = false
  showOnlyArabic.value = false
  showOnlyPopular.value = false
}

const refreshLibrary = async () => {
  loading.value = true
  try {
    await loadTemplates()
  } finally {
    loading.value = false
  }
}

const selectTemplate = (template: WorkflowTemplate) => {
  emit('template-selected', template)
}

const previewTemplate = (template: WorkflowTemplate) => {
  previewingTemplate.value = template
  showPreviewDialog.value = true
}

const selectFromPreview = (template: WorkflowTemplate) => {
  showPreviewDialog.value = false
  emit('template-selected', template)
}

const editTemplate = (template: WorkflowTemplate) => {
  // Implement template editing
  console.log('Edit template:', template.id)
}

const toggleTemplateStar = async (template: WorkflowTemplate) => {
  try {
    if (template.usage.popularity > 0.8) {
      await unstarTemplate(template.id)
    } else {
      await starTemplate(template.id)
    }
  } catch (error) {
    console.error('Failed to toggle template star:', error)
  }
}

const deleteTemplate = async (template: WorkflowTemplate) => {
  try {
    await removeTemplate(template.id)
    emit('template-deleted', template.id)
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}

const duplicateTemplate = async (template: WorkflowTemplate) => {
  try {
    const duplicatedTemplate: WorkflowTemplate = {
      ...template,
      id: `${template.id}_copy_${Date.now()}`,
      name: `${template.name} Copy`,
      arabicName: template.arabicName ? `${template.arabicName} نسخة` : undefined,
      metadata: {
        ...template.metadata,
        createdAt: new Date(),
        version: '1.0.0',
        author: 'Current User' // Would come from auth context
      }
    }

    const newTemplate = await createMinistryTemplate(duplicatedTemplate)
    emit('template-created', newTemplate)
  } catch (error) {
    console.error('Failed to duplicate template:', error)
  }
}

const exportTemplate = (template: WorkflowTemplate) => {
  // Implement template export
  const dataStr = JSON.stringify(template, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${template.name.replace(/\s+/g, '_')}_template.json`
  link.click()
  URL.revokeObjectURL(url)
}

const exportSelected = () => {
  if (selectedTemplates.value.length === 0) return

  const selected = templates.value.filter(t => selectedTemplates.value.includes(t.id))
  const dataStr = JSON.stringify(selected, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `selected_templates_${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const importTemplates = async (importedTemplates: WorkflowTemplate[]) => {
  try {
    for (const template of importedTemplates) {
      // Validate template before importing
      const validation = await validateTemplateCompliance(template)
      
      if (validation.overall.isValid) {
        await createMinistryTemplate(template)
        emit('template-created', template)
      } else {
        console.warn('Template failed validation:', template.name, validation)
      }
    }
    
    showImportDialog.value = false
    await refreshLibrary()
  } catch (error) {
    console.error('Failed to import templates:', error)
  }
}

const createCustomTemplate = () => {
  showCustomDialog.value = true
}

const createTemplate = async (templateData: Partial<WorkflowTemplate>) => {
  try {
    const newTemplate = await createMinistryTemplate(templateData as WorkflowTemplate)
    emit('template-created', newTemplate)
    showCustomDialog.value = false
    await refreshLibrary()
  } catch (error) {
    console.error('Failed to create template:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await refreshLibrary()
  
  // Auto-filter by ministry if in ministry context
  if (props.ministryContext && props.ministryContext.id !== 'general') {
    selectedMinistry.value = props.ministryContext.id
  }
})

// Watch for ministry context changes
watch(() => props.ministryContext, (newContext) => {
  if (newContext && newContext.id !== 'general') {
    selectedMinistry.value = newContext.id
  }
}, { deep: true })
</script>

<style scoped>
.template-library {
  @apply w-full h-full flex flex-col bg-background border border-border rounded-lg;
}

.template-library.library-rtl {
  direction: rtl;
}

.template-library.library-arabic {
  font-family: var(--font-arabic), var(--font-system);
}

/* Header */
.library-header {
  @apply flex items-center justify-between p-4 border-b border-border;
}

.header-title {
  @apply flex items-center gap-2;
}

.header-title h3 {
  @apply text-lg font-semibold;
}

.template-count {
  @apply text-xs;
}

.header-actions {
  @apply flex items-center gap-2;
}

/* Filters */
.library-filters {
  @apply flex flex-col gap-3 p-4 border-b border-border;
}

.search-section {
  @apply w-full;
}

.search-input-wrapper {
  @apply relative;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground;
}

.template-library.library-rtl .search-icon {
  @apply left-auto right-3;
}

.search-input {
  @apply w-full pl-9 pr-3 py-2 text-sm bg-background border border-input rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent;
}

.template-library.library-rtl .search-input {
  @apply pl-3 pr-9;
}

.filter-section {
  @apply flex items-center gap-2 flex-wrap;
}

.filter-select {
  @apply min-w-[140px];
}

.filter-button {
  @apply h-9;
}

/* Quick Categories */
.quick-categories {
  @apply flex items-center gap-1 p-2 border-b border-border overflow-x-auto;
}

.quick-category-btn {
  @apply flex-shrink-0 flex items-center gap-1;
}

.category-count {
  @apply text-xs;
}

/* Templates Container */
.templates-container {
  @apply flex-1 p-4;
}

.loading-state, .empty-state {
  @apply flex flex-col items-center justify-center h-64 space-y-4;
}

.loading-spinner {
  @apply w-8 h-8;
}

.empty-icon {
  @apply w-16 h-16 text-muted-foreground;
}

.empty-state h4 {
  @apply text-lg font-semibold;
}

.empty-state p {
  @apply text-sm text-muted-foreground text-center max-w-md;
}

.templates-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

/* Footer */
.library-footer {
  @apply flex items-center justify-between p-3 border-t border-border text-sm;
}

.footer-stats {
  @apply flex items-center gap-4 text-muted-foreground;
}

.stat-item {
  @apply flex items-center gap-1;
}

.footer-actions {
  @apply flex items-center gap-2;
}

/* Cultural Themes */
.library-ministry-health {
  --ministry-border: #059669;
  --ministry-accent: #10b981;
}

.library-ministry-education {
  --ministry-border: #0284c7;
  --ministry-accent: #0ea5e9;
}

.library-ministry-interior {
  --ministry-border: #dc2626;
  --ministry-accent: #ef4444;
}

.library-ministry-justice {
  --ministry-border: #7c3aed;
  --ministry-accent: #8b5cf6;
}

.library-islamic {
  --ministry-border: #16a34a;
  --ministry-accent: #22c55e;
}

/* RTL Adjustments */
.template-library.library-rtl .header-title {
  flex-direction: row-reverse;
}

.template-library.library-rtl .header-actions {
  flex-direction: row-reverse;
}

.template-library.library-rtl .filter-section {
  flex-direction: row-reverse;
}

.template-library.library-rtl .footer-stats {
  flex-direction: row-reverse;
}

.template-library.library-rtl .footer-actions {
  flex-direction: row-reverse;
}

/* Scrollbar styling */
.templates-container,
.quick-categories {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--muted-foreground)) transparent;
}

.templates-container::-webkit-scrollbar,
.quick-categories::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.templates-container::-webkit-scrollbar-track,
.quick-categories::-webkit-scrollbar-track {
  background: transparent;
}

.templates-container::-webkit-scrollbar-thumb,
.quick-categories::-webkit-scrollbar-thumb {
  background-color: rgb(var(--muted-foreground));
  border-radius: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .template-library {
    border-width: 2px;
  }
  
  .search-input,
  .filter-select {
    border-width: 2px;
  }
}

/* Print styles */
@media print {
  .library-header,
  .library-filters,
  .library-footer {
    display: none;
  }
  
  .template-library {
    border: none;
  }
}
</style>