<template>
  <div 
    class="node-panel"
    :class="[
      `panel-${layoutDirection}`,
      { 'panel-arabic': arabicMode },
      { 'panel-ministry': ministryMode },
      `panel-${culturalTheme}`
    ]"
    :dir="layoutDirection"
  >
    <!-- Panel Header -->
    <div class="panel-header">
      <div class="header-title">
        <Icon name="nodes" />
        <h3>{{ arabicMode ? 'مكتبة العقد' : 'Node Library' }}</h3>
      </div>
      
      <div class="header-controls">
        <!-- Search -->
        <div class="search-container">
          <Icon name="search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="arabicMode ? 'البحث في العقد...' : 'Search nodes...'"
            class="search-input"
            :dir="arabicMode ? 'rtl' : 'ltr'"
            @input="onSearchInput"
          />
          <Button
            v-if="searchQuery"
            variant="ghost"
            size="sm"
            @click="clearSearch"
            class="search-clear"
          >
            <Icon name="x" />
          </Button>
        </div>
        
        <!-- Filters -->
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" class="filter-trigger">
              <Icon name="filter" />
              <span class="sr-only">{{ arabicMode ? 'فلترة' : 'Filter' }}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :align="layoutDirection === 'rtl' ? 'end' : 'start'">
            <DropdownMenuLabel>
              {{ arabicMode ? 'فلترة العقد' : 'Filter Nodes' }}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <!-- Ministry Filter -->
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Icon name="ministry" />
                {{ arabicMode ? 'الوزارة' : 'Ministry' }}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  v-for="ministry in availableMinistries"
                  :key="ministry.id"
                  :checked="selectedMinistries.includes(ministry.id)"
                  @update:checked="toggleMinistryFilter(ministry.id)"
                >
                  {{ arabicMode ? ministry.arabicName : ministry.name }}
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <!-- Compliance Filter -->
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
              {{ arabicMode ? 'يدعم العربية فقط' : 'Arabic Supported Only' }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <!-- View Toggle -->
        <Button
          variant="outline"
          size="sm"
          @click="toggleView"
          :title="arabicMode ? 'تغيير العرض' : 'Toggle View'"
        >
          <Icon :name="viewMode === 'grid' ? 'list' : 'grid'" />
        </Button>
      </div>
    </div>
    
    <!-- Quick Access Tabs -->
    <div class="quick-tabs">
      <Button
        v-for="tab in quickTabs"
        :key="tab.id"
        :variant="activeTab === tab.id ? 'default' : 'ghost'"
        size="sm"
        @click="setActiveTab(tab.id)"
        class="quick-tab"
      >
        <Icon :name="tab.icon" />
        <span>{{ arabicMode ? tab.arabicLabel : tab.label }}</span>
        <Badge v-if="tab.count" variant="secondary" class="tab-count">
          {{ tab.count }}
        </Badge>
      </Button>
    </div>
    
    <!-- Categories -->
    <ScrollArea class="categories-container">
      <div class="categories-list">
        <Collapsible
          v-for="category in filteredCategories"
          :key="category.id"
          :open="expandedCategories.includes(category.id)"
          @update:open="toggleCategory(category.id)"
        >
          <CollapsibleTrigger class="category-header">
            <div class="category-info">
              <Icon :name="category.icon" class="category-icon" />
              <div class="category-text">
                <span class="category-name">
                  {{ arabicMode ? category.arabicName : category.name }}
                </span>
                <span class="category-description">
                  {{ arabicMode ? category.arabicDescription : category.description }}
                </span>
              </div>
            </div>
            
            <div class="category-meta">
              <!-- Cultural indicators -->
              <Icon
                v-if="category.cultural.islamicCompliant"
                name="islamic-certified"
                class="compliance-badge success"
                :title="arabicMode ? 'متوافق إسلامياً' : 'Islamic Compliant'"
              />
              <Icon
                v-if="category.cultural.arabicOptimized"
                name="arabic-supported"
                class="compliance-badge info"
                :title="arabicMode ? 'محسن للعربية' : 'Arabic Optimized'"
              />
              <Icon
                v-if="category.cultural.ministrySpecific"
                name="ministry"
                class="compliance-badge warning"
                :title="arabicMode ? 'خاص بالوزارة' : 'Ministry Specific'"
              />
              
              <Badge variant="outline" class="node-count">
                {{ category.nodes.length }}
              </Badge>
              
              <Icon 
                name="chevron-down" 
                class="expand-icon"
                :class="{ 'expanded': expandedCategories.includes(category.id) }"
              />
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent class="category-content">
            <div 
              class="nodes-grid"
              :class="{ 'nodes-list': viewMode === 'list' }"
            >
              <NodeItem
                v-for="node in category.nodes"
                :key="node.type"
                :node="node"
                :view-mode="viewMode"
                :arabic-mode="arabicMode"
                :layout-direction="layoutDirection"
                :cultural-theme="culturalTheme"
                :draggable="!readonly"
                @drag-start="onNodeDragStart"
                @click="onNodeClick"
                @cultural-validate="onNodeCulturalValidate"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollArea>
    
    <!-- Panel Footer -->
    <div class="panel-footer">
      <div class="footer-stats">
        <span class="stat-item">
          {{ filteredNodeCount }} {{ arabicMode ? 'عقدة' : 'nodes' }}
        </span>
        <span v-if="compliantNodeCount" class="stat-item success">
          {{ compliantNodeCount }} {{ arabicMode ? 'متوافقة' : 'compliant' }}
        </span>
      </div>
      
      <div class="footer-actions">
        <Button
          variant="outline"
          size="sm"
          @click="refreshLibrary"
          :loading="refreshing"
          :title="arabicMode ? 'تحديث المكتبة' : 'Refresh Library'"
        >
          <Icon name="refresh" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          @click="openCustomNodes"
          :title="arabicMode ? 'عقد مخصصة' : 'Custom Nodes'"
        >
          <Icon name="plus" />
          {{ arabicMode ? 'مخصص' : 'Custom' }}
        </Button>
      </div>
    </div>
    
    <!-- Cultural Validation Dialog -->
    <NodeCulturalValidationDialog
      v-if="showValidationDialog"
      :node="selectedNodeForValidation"
      :validation-result="nodeValidationResult"
      :arabic-mode="arabicMode"
      @close="showValidationDialog = false"
      @apply-fixes="applyNodeValidationFixes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNodeLibrary } from '../../composables/useNodeLibrary'
import { useCulturalValidation } from '../../composables/useCulturalValidation'
import type { 
  NodeLibraryCategory, 
  NodeDefinition, 
  IraqiWorkflowNode 
} from '../../types/workflow.types'
import type { 
  CulturalValidationResult,
  MinistryConfiguration 
} from '../../types/cultural.types'

// Components
import NodeItem from './NodeItem.vue'
import NodeCulturalValidationDialog from './NodeCulturalValidationDialog.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

// Props
interface Props {
  categories?: NodeLibraryCategory[]
  readonly?: boolean
  arabicMode?: boolean
  layoutDirection?: 'ltr' | 'rtl'
  culturalTheme?: string
  ministryFilter?: string
  showComplianceOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  arabicMode: false,
  layoutDirection: 'ltr',
  culturalTheme: 'default'
})

// Emits
const emit = defineEmits<{
  'node-selected': [node: NodeDefinition]
  'node-drag-start': [node: NodeDefinition, event: DragEvent]
  'cultural-validation': [node: NodeDefinition, result: CulturalValidationResult]
}>()

// Composables
const { t } = useI18n()
const { 
  categories, 
  loadCategories, 
  searchNodes, 
  filterByMinistry, 
  filterByCompliance 
} = useNodeLibrary()
const { validateNodeCulturalCompliance } = useCulturalValidation()

// Reactive data
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const activeTab = ref('all')
const expandedCategories = ref<string[]>(['basic', 'government'])
const selectedMinistries = ref<string[]>([])
const showOnlyCompliant = ref(false)
const showOnlyArabic = ref(false)
const refreshing = ref(false)

// Validation dialog
const showValidationDialog = ref(false)
const selectedNodeForValidation = ref<NodeDefinition | null>(null)
const nodeValidationResult = ref<CulturalValidationResult | null>(null)

// Computed properties
const ministryMode = computed(() => 
  props.ministryFilter && props.ministryFilter !== 'general'
)

const availableMinistries = computed(() => [
  { id: 'health', name: 'Health Ministry', arabicName: 'وزارة الصحة' },
  { id: 'education', name: 'Education Ministry', arabicName: 'وزارة التربية' },
  { id: 'interior', name: 'Interior Ministry', arabicName: 'وزارة الداخلية' },
  { id: 'justice', name: 'Justice Ministry', arabicName: 'وزارة العدل' },
  { id: 'finance', name: 'Finance Ministry', arabicName: 'وزارة المالية' }
])

const quickTabs = computed(() => {
  const allCount = filteredCategories.value.reduce((sum, cat) => sum + cat.nodes.length, 0)
  const compliantCount = filteredCategories.value.reduce((sum, cat) => 
    sum + cat.nodes.filter(node => node.cultural.islamicCompliant).length, 0
  )
  const ministryCount = filteredCategories.value.reduce((sum, cat) => 
    sum + cat.nodes.filter(node => node.cultural.ministryRestricted?.length).length, 0
  )
  
  return [
    {
      id: 'all',
      label: 'All Nodes',
      arabicLabel: 'جميع العقد',
      icon: 'nodes',
      count: allCount
    },
    {
      id: 'compliant',
      label: 'Islamic Compliant',
      arabicLabel: 'متوافقة إسلامياً',
      icon: 'islamic-certified',
      count: compliantCount
    },
    {
      id: 'ministry',
      label: 'Ministry Specific',
      arabicLabel: 'خاصة بالوزارة',
      icon: 'ministry',
      count: ministryCount
    },
    {
      id: 'recent',
      label: 'Recently Used',
      arabicLabel: 'مستخدمة مؤخراً',
      icon: 'clock',
      count: 0
    }
  ]
})

const filteredCategories = computed(() => {
  let filtered = props.categories || categories.value
  
  // Apply search filter
  if (searchQuery.value) {
    filtered = filtered.map(category => ({
      ...category,
      nodes: category.nodes.filter(node => 
        node.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        node.arabicName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        node.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        node.arabicDescription?.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })).filter(category => category.nodes.length > 0)
  }
  
  // Apply ministry filter
  if (selectedMinistries.value.length > 0) {
    filtered = filtered.map(category => ({
      ...category,
      nodes: category.nodes.filter(node => 
        !node.cultural.ministryRestricted ||
        node.cultural.ministryRestricted.some(ministry => 
          selectedMinistries.value.includes(ministry)
        )
      )
    })).filter(category => category.nodes.length > 0)
  }
  
  // Apply compliance filters
  if (showOnlyCompliant.value) {
    filtered = filtered.map(category => ({
      ...category,
      nodes: category.nodes.filter(node => node.cultural.islamicCompliant)
    })).filter(category => category.nodes.length > 0)
  }
  
  if (showOnlyArabic.value) {
    filtered = filtered.map(category => ({
      ...category,
      nodes: category.nodes.filter(node => node.visual.arabicLabelSupported)
    })).filter(category => category.nodes.length > 0)
  }
  
  // Apply active tab filter
  if (activeTab.value !== 'all') {
    switch (activeTab.value) {
      case 'compliant':
        filtered = filtered.map(category => ({
          ...category,
          nodes: category.nodes.filter(node => node.cultural.islamicCompliant)
        })).filter(category => category.nodes.length > 0)
        break
      case 'ministry':
        filtered = filtered.map(category => ({
          ...category,
          nodes: category.nodes.filter(node => node.cultural.ministryRestricted?.length)
        })).filter(category => category.nodes.length > 0)
        break
      case 'recent':
        // Implement recent nodes filter
        break
    }
  }
  
  return filtered
})

const filteredNodeCount = computed(() => 
  filteredCategories.value.reduce((sum, cat) => sum + cat.nodes.length, 0)
)

const compliantNodeCount = computed(() => 
  filteredCategories.value.reduce((sum, cat) => 
    sum + cat.nodes.filter(node => node.cultural.islamicCompliant).length, 0
  )
)

// Methods
const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const setActiveTab = (tabId: string) => {
  activeTab.value = tabId
}

const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const toggleMinistryFilter = (ministryId: string) => {
  const index = selectedMinistries.value.indexOf(ministryId)
  if (index > -1) {
    selectedMinistries.value.splice(index, 1)
  } else {
    selectedMinistries.value.push(ministryId)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

const onSearchInput = () => {
  // Debounced search logic could be added here
}

const refreshLibrary = async () => {
  refreshing.value = true
  try {
    await loadCategories()
  } finally {
    refreshing.value = false
  }
}

const openCustomNodes = () => {
  // Implement custom nodes dialog
  console.log('Open custom nodes dialog')
}

const onNodeDragStart = (node: NodeDefinition, event: DragEvent) => {
  if (props.readonly) return
  
  // Set drag data
  const dragData = {
    type: node.type,
    name: node.name,
    arabicName: node.arabicName,
    parameters: node.parameters,
    culturalSettings: {
      islamicCompliant: node.cultural.islamicCompliant,
      professionalDomain: node.cultural.professionalDomain,
      arabicLabel: node.arabicName
    },
    visual: node.visual
  }
  
  event.dataTransfer?.setData('application/json', JSON.stringify(dragData))
  event.dataTransfer!.effectAllowed = 'copy'
  
  emit('node-drag-start', node, event)
}

const onNodeClick = (node: NodeDefinition) => {
  emit('node-selected', node)
}

const onNodeCulturalValidate = async (node: NodeDefinition) => {
  try {
    selectedNodeForValidation.value = node
    const result = await validateNodeCulturalCompliance(node)
    nodeValidationResult.value = result
    showValidationDialog.value = true
    
    emit('cultural-validation', node, result)
  } catch (error) {
    console.error('Node cultural validation failed:', error)
  }
}

const applyNodeValidationFixes = async (fixes: any[]) => {
  // Apply cultural validation fixes to node
  console.log('Apply node validation fixes:', fixes)
}

// Lifecycle
onMounted(async () => {
  if (!props.categories) {
    await loadCategories()
  }
  
  // Auto-expand relevant categories based on ministry filter
  if (props.ministryFilter && props.ministryFilter !== 'general') {
    const ministryCategories = categories.value
      .filter(cat => cat.cultural.ministrySpecific?.includes(props.ministryFilter!))
      .map(cat => cat.id)
    
    expandedCategories.value.push(...ministryCategories)
  }
})

// Watch for props changes
watch(() => props.ministryFilter, (newFilter) => {
  if (newFilter && newFilter !== 'general') {
    selectedMinistries.value = [newFilter]
  }
})

watch(() => props.showComplianceOnly, (show) => {
  showOnlyCompliant.value = show || false
})
</script>

<style scoped>
.node-panel {
  @apply w-80 h-full flex flex-col bg-background border-r border-border;
}

.node-panel.panel-rtl {
  @apply border-r-0 border-l;
  direction: rtl;
}

.node-panel.panel-arabic {
  font-family: var(--font-arabic), var(--font-system);
}

.node-panel.panel-ministry {
  border-color: var(--ministry-border);
}

/* Header */
.panel-header {
  @apply flex flex-col gap-2 p-4 border-b border-border;
}

.header-title {
  @apply flex items-center gap-2;
}

.header-title h3 {
  @apply text-lg font-semibold;
}

.header-controls {
  @apply flex items-center gap-2;
}

.search-container {
  @apply relative flex-1;
}

.search-icon {
  @apply absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground;
}

.node-panel.panel-rtl .search-icon {
  @apply left-auto right-3;
}

.search-input {
  @apply w-full pl-9 pr-9 py-2 text-sm bg-background border border-input rounded-md;
  @apply focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent;
}

.node-panel.panel-rtl .search-input {
  @apply pl-9 pr-9;
}

.search-clear {
  @apply absolute right-1 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0;
}

.node-panel.panel-rtl .search-clear {
  @apply right-auto left-1;
}

.filter-trigger {
  @apply w-8 h-8 p-0;
}

/* Quick Tabs */
.quick-tabs {
  @apply flex overflow-x-auto p-2 gap-1 border-b border-border;
}

.quick-tab {
  @apply flex-shrink-0 flex items-center gap-1 text-xs;
}

.tab-count {
  @apply ml-1 text-xs;
}

.node-panel.panel-rtl .tab-count {
  @apply ml-0 mr-1;
}

/* Categories */
.categories-container {
  @apply flex-1;
}

.categories-list {
  @apply p-2 space-y-1;
}

.category-header {
  @apply w-full flex items-center justify-between p-2 rounded-md;
  @apply hover:bg-accent hover:text-accent-foreground;
  @apply transition-colors cursor-pointer;
}

.category-info {
  @apply flex items-center gap-2 flex-1 min-w-0;
}

.category-icon {
  @apply w-5 h-5 flex-shrink-0;
}

.category-text {
  @apply flex flex-col items-start min-w-0;
}

.category-name {
  @apply font-medium text-sm truncate;
}

.category-description {
  @apply text-xs text-muted-foreground truncate;
}

.category-meta {
  @apply flex items-center gap-1 flex-shrink-0;
}

.compliance-badge {
  @apply w-4 h-4;
}

.compliance-badge.success {
  @apply text-green-600 dark:text-green-400;
}

.compliance-badge.info {
  @apply text-blue-600 dark:text-blue-400;
}

.compliance-badge.warning {
  @apply text-orange-600 dark:text-orange-400;
}

.node-count {
  @apply text-xs;
}

.expand-icon {
  @apply w-4 h-4 transition-transform;
}

.expand-icon.expanded {
  @apply rotate-180;
}

.category-content {
  @apply pl-7 pr-2 pb-2;
}

.node-panel.panel-rtl .category-content {
  @apply pl-2 pr-7;
}

/* Nodes Grid/List */
.nodes-grid {
  @apply grid grid-cols-2 gap-2;
}

.nodes-list {
  @apply grid grid-cols-1 gap-1;
}

/* Footer */
.panel-footer {
  @apply flex items-center justify-between p-2 border-t border-border text-xs;
}

.footer-stats {
  @apply flex items-center gap-2 text-muted-foreground;
}

.stat-item {
  @apply flex items-center gap-1;
}

.stat-item.success {
  @apply text-green-600 dark:text-green-400;
}

.footer-actions {
  @apply flex items-center gap-1;
}

/* Cultural Themes */
.panel-ministry-health {
  --ministry-border: #059669;
}

.panel-ministry-education {
  --ministry-border: #0284c7;
}

.panel-ministry-interior {
  --ministry-border: #dc2626;
}

.panel-ministry-justice {
  --ministry-border: #7c3aed;
}

.panel-islamic {
  --ministry-border: #16a34a;
}

/* RTL Adjustments */
.node-panel.panel-rtl .category-info {
  flex-direction: row-reverse;
}

.node-panel.panel-rtl .category-text {
  align-items: end;
  text-align: right;
}

.node-panel.panel-rtl .footer-stats {
  flex-direction: row-reverse;
}

.node-panel.panel-rtl .footer-actions {
  flex-direction: row-reverse;
}

/* Scrollbar styling */
.categories-container {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--muted-foreground)) transparent;
}

.categories-container::-webkit-scrollbar {
  width: 4px;
}

.categories-container::-webkit-scrollbar-track {
  background: transparent;
}

.categories-container::-webkit-scrollbar-thumb {
  background-color: rgb(var(--muted-foreground));
  border-radius: 2px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .category-header {
    border: 1px solid transparent;
  }
  
  .category-header:hover {
    border-color: currentColor;
  }
}

/* Print styles */
@media print {
  .node-panel {
    display: none;
  }
}
</style>