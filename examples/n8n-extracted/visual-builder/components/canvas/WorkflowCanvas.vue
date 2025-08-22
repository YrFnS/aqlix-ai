<template>
  <div 
    ref="canvasContainer"
    class="workflow-canvas"
    :class="[
      `canvas-${layout.direction}`,
      `canvas-${culturalTheme}`,
      { 'canvas-arabic': layout.primaryLanguage === 'arabic' || layout.primaryLanguage === 'bilingual' },
      { 'canvas-ministry': domain?.type !== 'general' },
      { 'canvas-islamic-mode': cultural.islamicCompliant }
    ]"
    :dir="layout.direction"
  >
    <!-- Canvas Header with Cultural Controls -->
    <div class="canvas-header" :class="{ 'rtl-header': layout.direction === 'rtl' }">
      <div class="header-section header-left">
        <!-- Workflow Info -->
        <div class="workflow-info">
          <h2 class="workflow-title" :class="{ 'arabic-title': showArabicLabels }">
            {{ showArabicLabels && workflow.arabicName ? workflow.arabicName : workflow.name }}
          </h2>
          <div class="workflow-meta">
            <span class="meta-item">
              <Icon name="nodes" />
              {{ workflow.nodes.length }} {{ t('canvas.nodes') }}
            </span>
            <span class="meta-item">
              <Icon name="connections" />
              {{ workflow.connections.length }} {{ t('canvas.connections') }}
            </span>
            <span v-if="cultural.islamicCompliant" class="meta-item islamic-badge">
              <Icon name="islamic-certified" />
              {{ t('canvas.islamicCompliant') }}
            </span>
          </div>
        </div>
      </div>

      <div class="header-section header-center">
        <!-- Canvas Controls -->
        <div class="canvas-controls">
          <Button
            variant="ghost"
            size="sm"
            @click="centerCanvas"
            :title="t('canvas.center')"
          >
            <Icon name="center" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="fitToContent"
            :title="t('canvas.fitToContent')"
          >
            <Icon name="fit" />
          </Button>
          <div class="zoom-controls">
            <Button
              variant="ghost"
              size="sm"
              @click="zoomOut"
              :disabled="layout.zoomLevel <= 0.1"
              :title="t('canvas.zoomOut')"
            >
              <Icon name="zoom-out" />
            </Button>
            <span class="zoom-level">{{ Math.round(layout.zoomLevel * 100) }}%</span>
            <Button
              variant="ghost"
              size="sm"
              @click="zoomIn"
              :disabled="layout.zoomLevel >= 3"
              :title="t('canvas.zoomIn')"
            >
              <Icon name="zoom-in" />
            </Button>
          </div>
        </div>
      </div>

      <div class="header-section header-right">
        <!-- Cultural and Display Controls -->
        <div class="display-controls">
          <Button
            variant="ghost"
            size="sm"
            @click="toggleLanguageDisplay"
            :title="t('canvas.toggleLanguage')"
            :class="{ 'active': showArabicLabels }"
          >
            <Icon :name="showArabicLabels ? 'arabic' : 'english'" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="toggleComplianceView"
            :title="t('canvas.toggleCompliance')"
            :class="{ 'active': showComplianceIndicators }"
          >
            <Icon name="islamic-compliance" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="togglePrayerTimeView"
            :title="t('canvas.togglePrayerTimes')"
            :class="{ 'active': showPrayerTimeIndicators }"
          >
            <Icon name="prayer-time" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Prayer Time Indicator (if enabled) -->
    <PrayerTimeIndicator
      v-if="showPrayerTimeIndicators && prayerTimeContext"
      :prayer-times="prayerTimeContext"
      :workflow-timing="workflowTiming"
      @prayer-conflict="onPrayerConflict"
    />

    <!-- Main Canvas Area -->
    <div 
      class="canvas-main"
      @drop="onCanvasDrop"
      @dragover.prevent
      @contextmenu.prevent="onCanvasContextMenu"
    >
      <!-- Canvas Background Grid -->
      <div 
        class="canvas-background"
        :style="canvasBackgroundStyle"
      >
        <svg class="grid-pattern" :class="{ 'rtl-grid': layout.direction === 'rtl' }">
          <defs>
            <pattern 
              id="grid" 
              :width="gridSize" 
              :height="gridSize" 
              patternUnits="userSpaceOnUse"
            >
              <path 
                :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`" 
                fill="none" 
                stroke="var(--grid-color)" 
                stroke-width="1"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Canvas Content -->
      <div 
        ref="canvasContent"
        class="canvas-content"
        :style="canvasContentStyle"
        @mousedown="onCanvasMouseDown"
        @mousemove="onCanvasMouseMove"
        @mouseup="onCanvasMouseUp"
        @wheel="onCanvasWheel"
      >
        <!-- Workflow Connections -->
        <svg class="connections-layer" :class="{ 'rtl-connections': layout.direction === 'rtl' }">
          <WorkflowConnection
            v-for="connection in workflow.connections"
            :key="connection.id"
            :connection="connection"
            :source-node="getNodeById(connection.sourceNodeId)"
            :target-node="getNodeById(connection.targetNodeId)"
            :layout-direction="layout.direction"
            :arabic-mode="showArabicLabels"
            :cultural-theme="culturalTheme"
            :selected="selectedConnections.includes(connection.id)"
            @select="selectConnection"
            @delete="deleteConnection"
            @edit="editConnection"
          />
          
          <!-- Temporary connection (while dragging) -->
          <WorkflowConnection
            v-if="temporaryConnection"
            :connection="temporaryConnection"
            :source-node="getNodeById(temporaryConnection.sourceNodeId)"
            :target-node="null"
            :mouse-position="mousePosition"
            :layout-direction="layout.direction"
            :cultural-theme="culturalTheme"
            temporary
          />
        </svg>

        <!-- Workflow Nodes -->
        <div class="nodes-layer" :class="{ 'rtl-nodes': layout.direction === 'rtl' }">
          <WorkflowNode
            v-for="node in workflow.nodes"
            :key="node.id"
            :node="node"
            :layout-direction="layout.direction"
            :arabic-mode="showArabicLabels"
            :cultural-theme="culturalTheme"
            :compliance-view="showComplianceIndicators"
            :selected="selectedNodes.includes(node.id)"
            :dragging="draggedNode?.id === node.id"
            :zoom="layout.zoomLevel"
            @select="selectNode"
            @deselect="deselectNode"
            @move="moveNode"
            @delete="deleteNode"
            @edit="editNode"
            @start-connection="startConnection"
            @cultural-validation="onNodeCulturalValidation"
            @islamic-compliance="onNodeIslamicCompliance"
          />
        </div>

        <!-- Selection Rectangle -->
        <div
          v-if="selectionRect"
          class="selection-rectangle"
          :style="selectionRectStyle"
        />

        <!-- Cultural Overlay Indicators -->
        <IraqiCanvasOverlay
          v-if="showComplianceIndicators || showPrayerTimeIndicators"
          :workflow="workflow"
          :cultural-validation="culturalValidation"
          :prayer-context="prayerTimeContext"
          :layout-direction="layout.direction"
          @cultural-issue="onCulturalIssue"
          @prayer-conflict="onPrayerConflict"
        />
      </div>
    </div>

    <!-- Canvas Footer -->
    <div class="canvas-footer" :class="{ 'rtl-footer': layout.direction === 'rtl' }">
      <div class="footer-left">
        <span class="canvas-info">
          {{ t('canvas.position') }}: {{ Math.round(viewport.x) }}, {{ Math.round(viewport.y) }}
        </span>
        <span class="canvas-info">
          {{ t('canvas.zoom') }}: {{ Math.round(layout.zoomLevel * 100) }}%
        </span>
      </div>
      
      <div class="footer-center">
        <!-- Cultural Status -->
        <div class="cultural-status" v-if="cultural.islamicCompliant">
          <Icon name="islamic-certified" class="status-icon success" />
          <span class="status-text">{{ t('canvas.islamicCompliant') }}</span>
        </div>
        <div class="cultural-status" v-if="workflow.cultural.arabicSupported">
          <Icon name="arabic-supported" class="status-icon success" />
          <span class="status-text">{{ t('canvas.arabicSupported') }}</span>
        </div>
        <div class="cultural-status" v-if="domain?.type && domain.type !== 'general'">
          <Icon :name="`ministry-${domain.type}`" class="status-icon info" />
          <span class="status-text">{{ t(`ministry.${domain.type}`) }}</span>
        </div>
      </div>
      
      <div class="footer-right">
        <Button
          variant="ghost"
          size="sm"
          @click="validateWorkflow"
          :loading="validating"
          :title="t('canvas.validate')"
        >
          <Icon name="validate" />
          {{ t('canvas.validate') }}
        </Button>
      </div>
    </div>

    <!-- Context Menu -->
    <CanvasContextMenu
      v-if="contextMenu.visible"
      :x="contextMenu.x"
      :y="contextMenu.y"
      :layout-direction="layout.direction"
      :arabic-mode="showArabicLabels"
      @close="closeContextMenu"
      @add-node="onAddNode"
      @paste="onPaste"
      @cultural-validate="validateWorkflow"
    />

    <!-- Cultural Validation Dialog -->
    <CulturalValidationDialog
      v-if="showValidationDialog"
      :validation-result="culturalValidation"
      :arabic-mode="showArabicLabels"
      @close="showValidationDialog = false"
      @apply-fixes="applyCulturalFixes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkflowCanvas } from '../../composables/useWorkflowCanvas'
import { useArabicProcessing } from '../../composables/useArabicProcessing'
import { useIslamicCompliance } from '../../composables/useIslamicCompliance'
import { useCulturalValidation } from '../../composables/useCulturalValidation'
import type { 
  IraqiWorkflow, 
  IraqiWorkflowNode, 
  IraqiWorkflowConnection,
  CanvasViewport,
  WorkflowValidationResult
} from '../../types/workflow.types'
import type { 
  CulturalValidationResult,
  PrayerTimeContext,
  CulturalDisplaySettings
} from '../../types/cultural.types'

// Components
import WorkflowNode from './WorkflowNode.vue'
import WorkflowConnection from './WorkflowConnection.vue'
import IraqiCanvasOverlay from './IraqiCanvasOverlay.vue'
import PrayerTimeIndicator from './PrayerTimeIndicator.vue'
import CanvasContextMenu from './CanvasContextMenu.vue'
import CulturalValidationDialog from './CulturalValidationDialog.vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

// Props
interface Props {
  workflow: IraqiWorkflow
  readonly?: boolean
  culturalSettings?: CulturalDisplaySettings
  prayerTimeContext?: PrayerTimeContext
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false
})

// Emits
const emit = defineEmits<{
  'update:workflow': [workflow: IraqiWorkflow]
  'node-selected': [nodeId: string]
  'connection-selected': [connectionId: string]
  'cultural-validation': [result: CulturalValidationResult]
  'islamic-compliance': [result: any]
  'prayer-conflict': [conflict: any]
}>()

// Composables
const { t } = useI18n()
const {
  viewport,
  selectedNodes,
  selectedConnections,
  draggedNode,
  temporaryConnection,
  mousePosition,
  selectionRect,
  centerCanvas,
  fitToContent,
  zoomIn,
  zoomOut,
  moveNode,
  selectNode,
  deselectNode,
  selectConnection,
  startConnection,
  deleteNode,
  deleteConnection
} = useWorkflowCanvas(props.workflow)

const { processArabicText, validateRTLLayout } = useArabicProcessing()
const { validateIslamicCompliance, checkPrayerTimeConflicts } = useIslamicCompliance()
const { validateCulturalCompliance } = useCulturalValidation()

// Reactive data
const canvasContainer = ref<HTMLDivElement>()
const canvasContent = ref<HTMLDivElement>()

const culturalValidation = ref<CulturalValidationResult>()
const workflowTiming = ref<any>()
const validating = ref(false)
const showValidationDialog = ref(false)

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0
})

// Display settings
const showArabicLabels = ref(props.culturalSettings?.content.showArabicLabels ?? false)
const showComplianceIndicators = ref(props.culturalSettings?.content.showIslamicCompliance ?? true)
const showPrayerTimeIndicators = ref(props.culturalSettings?.content.showPrayerTimeIndicators ?? true)

// Computed properties
const layout = computed(() => props.workflow.layout)
const cultural = computed(() => props.workflow.cultural)
const domain = computed(() => props.workflow.domain)

const culturalTheme = computed(() => {
  if (domain.value?.type && domain.value.type !== 'general') {
    return `ministry-${domain.value.type}`
  }
  return cultural.value.islamicCompliant ? 'islamic' : 'default'
})

const gridSize = computed(() => 20 * layout.value.zoomLevel)

const canvasBackgroundStyle = computed(() => ({
  transform: `translate(${viewport.value.x}px, ${viewport.value.y}px) scale(${layout.value.zoomLevel})`,
  transformOrigin: '0 0'
}))

const canvasContentStyle = computed(() => ({
  transform: `translate(${viewport.value.x}px, ${viewport.value.y}px) scale(${layout.value.zoomLevel})`,
  transformOrigin: '0 0'
}))

const selectionRectStyle = computed(() => {
  if (!selectionRect.value) return {}
  
  const rect = selectionRect.value
  return {
    left: `${Math.min(rect.startX, rect.endX)}px`,
    top: `${Math.min(rect.startY, rect.endY)}px`,
    width: `${Math.abs(rect.endX - rect.startX)}px`,
    height: `${Math.abs(rect.endY - rect.startY)}px`
  }
})

// Methods
const getNodeById = (nodeId: string): IraqiWorkflowNode | undefined => {
  return props.workflow.nodes.find(node => node.id === nodeId)
}

const toggleLanguageDisplay = () => {
  showArabicLabels.value = !showArabicLabels.value
}

const toggleComplianceView = () => {
  showComplianceIndicators.value = !showComplianceIndicators.value
}

const togglePrayerTimeView = () => {
  showPrayerTimeIndicators.value = !showPrayerTimeIndicators.value
}

const validateWorkflow = async () => {
  if (validating.value) return
  
  validating.value = true
  try {
    // Perform cultural validation
    const result = await validateCulturalCompliance(props.workflow)
    culturalValidation.value = result
    
    // Emit validation result
    emit('cultural-validation', result)
    
    // Show validation dialog if issues found
    if (result.overall.score < 0.9) {
      showValidationDialog.value = true
    }
    
    // Check prayer time conflicts if enabled
    if (props.prayerTimeContext && showPrayerTimeIndicators.value) {
      const conflicts = await checkPrayerTimeConflicts(props.workflow, props.prayerTimeContext)
      if (conflicts.length > 0) {
        emit('prayer-conflict', conflicts)
      }
    }
    
  } catch (error) {
    console.error('Workflow validation failed:', error)
  } finally {
    validating.value = false
  }
}

const applyCulturalFixes = async (fixes: any[]) => {
  // Apply automated cultural compliance fixes
  for (const fix of fixes) {
    switch (fix.type) {
      case 'arabic-rtl':
        await applyRTLFix(fix)
        break
      case 'islamic-compliance':
        await applyIslamicFix(fix)
        break
      case 'professional-domain':
        await applyDomainFix(fix)
        break
    }
  }
  
  // Re-validate after fixes
  await validateWorkflow()
}

const applyRTLFix = async (fix: any) => {
  // Implement RTL layout fixes
  const updatedWorkflow = { ...props.workflow }
  
  if (fix.action === 'enable-rtl') {
    updatedWorkflow.layout.direction = 'rtl'
  }
  
  if (fix.action === 'add-arabic-labels') {
    updatedWorkflow.nodes.forEach(node => {
      if (!node.culturalSettings?.arabicLabel && fix.nodeIds.includes(node.id)) {
        node.culturalSettings = {
          ...node.culturalSettings,
          arabicLabel: `${node.name} (Arabic)` // This would be properly translated
        }
      }
    })
  }
  
  emit('update:workflow', updatedWorkflow)
}

const applyIslamicFix = async (fix: any) => {
  // Implement Islamic compliance fixes
  const updatedWorkflow = { ...props.workflow }
  
  if (fix.action === 'mark-compliant') {
    updatedWorkflow.cultural.islamicCompliant = true
  }
  
  if (fix.action === 'remove-non-compliant-nodes') {
    updatedWorkflow.nodes = updatedWorkflow.nodes.filter(node => 
      !fix.nodeIds.includes(node.id)
    )
  }
  
  emit('update:workflow', updatedWorkflow)
}

const applyDomainFix = async (fix: any) => {
  // Implement professional domain fixes
  const updatedWorkflow = { ...props.workflow }
  
  if (fix.action === 'set-domain') {
    updatedWorkflow.domain = {
      ...updatedWorkflow.domain,
      type: fix.domainType
    }
  }
  
  emit('update:workflow', updatedWorkflow)
}

// Event handlers
const onCanvasDrop = async (event: DragEvent) => {
  if (props.readonly) return
  
  event.preventDefault()
  const data = event.dataTransfer?.getData('application/json')
  if (!data) return
  
  const nodeData = JSON.parse(data)
  const rect = canvasContainer.value?.getBoundingClientRect()
  if (!rect) return
  
  const x = (event.clientX - rect.left - viewport.value.x) / layout.value.zoomLevel
  const y = (event.clientY - rect.top - viewport.value.y) / layout.value.zoomLevel
  
  const newNode: IraqiWorkflowNode = {
    ...nodeData,
    id: `node_${Date.now()}`,
    position: { x, y }
  }
  
  // Add cultural validation for new nodes
  if (cultural.value.islamicCompliant) {
    const validation = await validateIslamicCompliance(newNode)
    if (!validation.isCompliant) {
      // Show warning or prevent addition
      console.warn('Node does not meet Islamic compliance requirements')
    }
  }
  
  const updatedWorkflow = {
    ...props.workflow,
    nodes: [...props.workflow.nodes, newNode]
  }
  
  emit('update:workflow', updatedWorkflow)
}

const onCanvasContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  contextMenu.visible = true
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
}

const closeContextMenu = () => {
  contextMenu.visible = false
}

const onCanvasMouseDown = (event: MouseEvent) => {
  // Handle canvas panning and selection
}

const onCanvasMouseMove = (event: MouseEvent) => {
  // Handle canvas panning and selection rectangle
  const rect = canvasContainer.value?.getBoundingClientRect()
  if (rect) {
    mousePosition.value = {
      x: (event.clientX - rect.left - viewport.value.x) / layout.value.zoomLevel,
      y: (event.clientY - rect.top - viewport.value.y) / layout.value.zoomLevel
    }
  }
}

const onCanvasMouseUp = (event: MouseEvent) => {
  // Handle end of canvas interaction
}

const onCanvasWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  if (event.ctrlKey || event.metaKey) {
    // Zoom
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    const newZoom = Math.max(0.1, Math.min(3, layout.value.zoomLevel + delta))
    
    const updatedWorkflow = {
      ...props.workflow,
      layout: {
        ...layout.value,
        zoomLevel: newZoom
      }
    }
    
    emit('update:workflow', updatedWorkflow)
  } else {
    // Pan
    viewport.value.x -= event.deltaX
    viewport.value.y -= event.deltaY
  }
}

const onAddNode = (nodeType: string) => {
  // Add node from context menu
  closeContextMenu()
}

const onPaste = () => {
  // Handle paste operation
  closeContextMenu()
}

const editNode = (nodeId: string) => {
  emit('node-selected', nodeId)
}

const editConnection = (connectionId: string) => {
  emit('connection-selected', connectionId)
}

const onNodeCulturalValidation = (nodeId: string, result: any) => {
  // Handle node-specific cultural validation
  console.log('Node cultural validation:', nodeId, result)
}

const onNodeIslamicCompliance = (nodeId: string, result: any) => {
  // Handle node-specific Islamic compliance
  console.log('Node Islamic compliance:', nodeId, result)
}

const onCulturalIssue = (issue: any) => {
  // Handle cultural issue from overlay
  console.log('Cultural issue:', issue)
}

const onPrayerConflict = (conflict: any) => {
  // Handle prayer time conflict
  emit('prayer-conflict', conflict)
}

// Lifecycle
onMounted(async () => {
  // Initial validation
  if (cultural.value.islamicCompliant) {
    await validateWorkflow()
  }
  
  // Set up prayer time monitoring if enabled
  if (props.prayerTimeContext && showPrayerTimeIndicators.value) {
    // Monitor prayer times and schedule validation
    setInterval(async () => {
      const conflicts = await checkPrayerTimeConflicts(props.workflow, props.prayerTimeContext!)
      if (conflicts.length > 0) {
        emit('prayer-conflict', conflicts)
      }
    }, 60000) // Check every minute
  }
})

// Watch for workflow changes to trigger validation
watch(() => props.workflow, async (newWorkflow) => {
  if (newWorkflow.cultural.islamicCompliant) {
    await validateWorkflow()
  }
}, { deep: true })

// Watch for cultural settings changes
watch(() => props.culturalSettings, (settings) => {
  if (settings) {
    showArabicLabels.value = settings.content.showArabicLabels
    showComplianceIndicators.value = settings.content.showIslamicCompliance
    showPrayerTimeIndicators.value = settings.content.showPrayerTimeIndicators
  }
}, { deep: true })
</script>

<style scoped>
.workflow-canvas {
  @apply w-full h-full flex flex-col bg-background border border-border rounded-lg overflow-hidden;
  font-family: var(--font-system);
}

.workflow-canvas.canvas-rtl {
  direction: rtl;
}

.workflow-canvas.canvas-arabic {
  font-family: var(--font-arabic), var(--font-system);
}

.workflow-canvas.canvas-ministry {
  border-color: var(--ministry-border);
}

.workflow-canvas.canvas-islamic-mode {
  --grid-color: var(--islamic-accent);
}

/* Header */
.canvas-header {
  @apply flex items-center justify-between p-4 bg-muted/50 border-b border-border;
}

.canvas-header.rtl-header {
  direction: rtl;
}

.header-section {
  @apply flex items-center gap-2;
}

.header-left {
  @apply flex-1;
}

.header-center {
  @apply flex-shrink-0;
}

.header-right {
  @apply flex-1 justify-end;
}

.workflow-info {
  @apply space-y-1;
}

.workflow-title {
  @apply text-lg font-semibold text-foreground;
}

.workflow-title.arabic-title {
  font-family: var(--font-arabic);
  font-weight: 600;
}

.workflow-meta {
  @apply flex items-center gap-4 text-sm text-muted-foreground;
}

.meta-item {
  @apply flex items-center gap-1;
}

.islamic-badge {
  @apply text-green-600 dark:text-green-400;
}

.canvas-controls {
  @apply flex items-center gap-1;
}

.zoom-controls {
  @apply flex items-center gap-1 ml-2 pl-2 border-l border-border;
}

.zoom-level {
  @apply text-sm font-mono text-muted-foreground min-w-[50px] text-center;
}

.display-controls {
  @apply flex items-center gap-1;
}

.display-controls .active {
  @apply bg-accent text-accent-foreground;
}

/* Main Canvas */
.canvas-main {
  @apply flex-1 relative overflow-hidden;
}

.canvas-background {
  @apply absolute inset-0 pointer-events-none;
}

.grid-pattern {
  @apply w-full h-full;
}

.grid-pattern.rtl-grid {
  transform: scaleX(-1);
}

.canvas-content {
  @apply relative w-full h-full;
}

.connections-layer {
  @apply absolute inset-0 pointer-events-none;
  z-index: 1;
}

.connections-layer.rtl-connections path {
  transform-origin: center;
}

.nodes-layer {
  @apply relative;
  z-index: 2;
}

.nodes-layer.rtl-nodes {
  direction: rtl;
}

.selection-rectangle {
  @apply absolute border-2 border-primary bg-primary/10 pointer-events-none;
  z-index: 10;
}

/* Footer */
.canvas-footer {
  @apply flex items-center justify-between p-2 bg-muted/30 border-t border-border text-sm;
}

.canvas-footer.rtl-footer {
  direction: rtl;
}

.footer-left, .footer-right {
  @apply flex items-center gap-4;
}

.footer-center {
  @apply flex items-center gap-2;
}

.canvas-info {
  @apply text-muted-foreground font-mono;
}

.cultural-status {
  @apply flex items-center gap-1;
}

.status-icon {
  @apply w-4 h-4;
}

.status-icon.success {
  @apply text-green-600 dark:text-green-400;
}

.status-icon.info {
  @apply text-blue-600 dark:text-blue-400;
}

.status-text {
  @apply text-sm;
}

/* Cultural Themes */
.canvas-ministry-health {
  --ministry-border: #059669;
  --ministry-accent: #10b981;
}

.canvas-ministry-education {
  --ministry-border: #0284c7;
  --ministry-accent: #0ea5e9;
}

.canvas-ministry-interior {
  --ministry-border: #dc2626;
  --ministry-accent: #ef4444;
}

.canvas-ministry-justice {
  --ministry-border: #7c3aed;
  --ministry-accent: #8b5cf6;
}

.canvas-islamic {
  --islamic-accent: #16a34a;
  --islamic-border: #15803d;
}

/* Arabic font support */
@font-face {
  font-family: 'Arabic';
  src: url('/fonts/amiri-regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Arabic';
  src: url('/fonts/amiri-bold.woff2') format('woff2');
  font-weight: 600;
  font-display: swap;
}

:root {
  --font-arabic: 'Arabic', 'Amiri', 'Times New Roman', serif;
  --font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* RTL support */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .canvas-controls {
  flex-direction: row-reverse;
}

[dir="rtl"] .display-controls {
  flex-direction: row-reverse;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .workflow-canvas {
    --grid-color: currentColor;
    border-width: 2px;
  }
}

/* Print styles */
@media print {
  .canvas-header,
  .canvas-footer {
    display: none;
  }
  
  .workflow-canvas {
    border: none;
    border-radius: 0;
  }
}
</style>