<template>
  <div 
    class="parameter-input"
    :class="[
      `input-${layoutDirection}`,
      { 'input-arabic': arabicMode },
      { 'input-ministry': ministryMode },
      { 'input-error': hasError },
      { 'input-cultural-warning': hasCulturalWarning }
    ]"
    :dir="layoutDirection"
  >
    <!-- Parameter Label -->
    <div class="parameter-label">
      <label 
        :for="inputId"
        class="label-text"
        :class="{ 'arabic-label': arabicMode && parameter.arabicDisplayName }"
      >
        {{ arabicMode && parameter.arabicDisplayName ? parameter.arabicDisplayName : parameter.displayName }}
        <span v-if="parameter.required" class="required-indicator">*</span>
      </label>
      
      <!-- Cultural indicators -->
      <div class="label-indicators">
        <Icon
          v-if="parameter.cultural?.islamicContentFilter"
          name="islamic-certified"
          class="cultural-indicator islamic"
          :title="arabicMode ? 'مرشح محتوى إسلامي' : 'Islamic Content Filter'"
        />
        <Icon
          v-if="parameter.cultural?.arabicInputSupported"
          name="arabic-supported"
          class="cultural-indicator arabic"
          :title="arabicMode ? 'يدعم الإدخال بالعربية' : 'Arabic Input Supported'"
        />
        <Icon
          v-if="parameter.cultural?.dialectValidation"
          name="dialect"
          class="cultural-indicator dialect"
          :title="arabicMode ? 'التحقق من اللهجة' : 'Dialect Validation'"
        />
      </div>
    </div>
    
    <!-- Parameter Description -->
    <p 
      v-if="parameter.arabicDescription || parameter.description"
      class="parameter-description"
      :class="{ 'arabic-description': arabicMode && parameter.arabicDescription }"
    >
      {{ arabicMode && parameter.arabicDescription ? parameter.arabicDescription : parameter.description }}
    </p>
    
    <!-- Input Component -->
    <div class="input-container">
      <!-- String/Arabic Text Input -->
      <div 
        v-if="parameter.type === 'string' || parameter.type === 'arabic-text'"
        class="text-input-wrapper"
      >
        <textarea
          v-if="isMultiline"
          :id="inputId"
          v-model="inputValue"
          :placeholder="getPlaceholder()"
          :dir="getTextDirection()"
          :class="textInputClasses"
          :rows="textRows"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
          @keydown="onKeyDown"
        />
        <input
          v-else
          :id="inputId"
          v-model="inputValue"
          type="text"
          :placeholder="getPlaceholder()"
          :dir="getTextDirection()"
          :class="textInputClasses"
          @input="onInput"
          @blur="onBlur"
          @focus="onFocus"
          @keydown="onKeyDown"
        />
        
        <!-- Text Direction Toggle -->
        <Button
          v-if="parameter.cultural?.arabicInputSupported"
          variant="ghost"
          size="sm"
          class="direction-toggle"
          @click="toggleTextDirection"
          :title="arabicMode ? 'تغيير اتجاه النص' : 'Toggle Text Direction'"
        >
          <Icon :name="textDirection === 'rtl' ? 'text-ltr' : 'text-rtl'" />
        </Button>
        
        <!-- Arabic Input Helper -->
        <ArabicInputHelper
          v-if="parameter.type === 'arabic-text' && showArabicHelper"
          :text="inputValue"
          :dialect-preference="dialectPreference"
          :professional-domain="professionalDomain"
          @suggestion="applySuggestion"
          @dialect-detected="onDialectDetected"
        />
      </div>
      
      <!-- Number Input -->
      <input
        v-else-if="parameter.type === 'number'"
        :id="inputId"
        v-model.number="inputValue"
        type="number"
        :placeholder="getPlaceholder()"
        :min="parameter.validation?.min"
        :max="parameter.validation?.max"
        :class="inputClasses"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
      
      <!-- Boolean Toggle -->
      <div v-else-if="parameter.type === 'boolean'" class="boolean-input">
        <Switch
          :id="inputId"
          :checked="inputValue"
          @update:checked="updateValue"
          class="boolean-switch"
        />
        <label :for="inputId" class="boolean-label">
          {{ inputValue ? 
            (arabicMode ? 'مُفعل' : 'Enabled') : 
            (arabicMode ? 'مُعطل' : 'Disabled')
          }}
        </label>
      </div>
      
      <!-- Select Dropdown -->
      <Select
        v-else-if="parameter.type === 'select'"
        :value="inputValue"
        @update:value="updateValue"
      >
        <SelectTrigger :id="inputId" :class="inputClasses">
          <SelectValue 
            :placeholder="getPlaceholder()"
            :dir="layoutDirection"
          />
        </SelectTrigger>
        <SelectContent :align="layoutDirection === 'rtl' ? 'end' : 'start'">
          <SelectItem
            v-for="option in parameter.options"
            :key="option.value"
            :value="option.value"
            :class="{ 'non-compliant': option.islamicCompliant === false }"
          >
            <div class="option-content">
              <span class="option-label">
                {{ arabicMode && option.arabicName ? option.arabicName : option.name }}
              </span>
              <div class="option-indicators">
                <Icon
                  v-if="option.islamicCompliant"
                  name="islamic-certified"
                  class="option-indicator success"
                />
                <Icon
                  v-else-if="option.islamicCompliant === false"
                  name="warning"
                  class="option-indicator warning"
                />
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      
      <!-- Multi-Select -->
      <MultiSelect
        v-else-if="parameter.type === 'multiselect'"
        :value="inputValue"
        :options="parameter.options"
        :placeholder="getPlaceholder()"
        :arabic-mode="arabicMode"
        :layout-direction="layoutDirection"
        @update:value="updateValue"
      />
      
      <!-- JSON Editor -->
      <JsonEditor
        v-else-if="parameter.type === 'json'"
        :value="inputValue"
        :arabic-mode="arabicMode"
        :layout-direction="layoutDirection"
        :cultural-validation="parameter.cultural?.islamicContentFilter"
        @update:value="updateValue"
        @validation-error="onJsonValidationError"
      />
    </div>
    
    <!-- Validation Messages -->
    <div v-if="validationMessages.length" class="validation-messages">
      <div
        v-for="message in validationMessages"
        :key="message.id"
        :class="[
          'validation-message',
          `message-${message.type}`,
          { 'arabic-message': arabicMode && message.arabicText }
        ]"
      >
        <Icon :name="getMessageIcon(message.type)" class="message-icon" />
        <span class="message-text">
          {{ arabicMode && message.arabicText ? message.arabicText : message.text }}
        </span>
      </div>
    </div>
    
    <!-- Cultural Validation Status -->
    <div 
      v-if="culturalValidation && showCulturalStatus"
      class="cultural-status"
    >
      <div class="status-header">
        <Icon name="cultural-validation" />
        <span>{{ arabicMode ? 'الحالة الثقافية' : 'Cultural Status' }}</span>
      </div>
      
      <div class="status-metrics">
        <div class="metric">
          <span class="metric-label">
            {{ arabicMode ? 'التوافق الإسلامي' : 'Islamic Compliance' }}
          </span>
          <Badge 
            :variant="culturalValidation.islamic.score > 0.8 ? 'success' : 'warning'"
            class="metric-value"
          >
            {{ Math.round(culturalValidation.islamic.score * 100) }}%
          </Badge>
        </div>
        
        <div 
          v-if="parameter.type === 'arabic-text'"
          class="metric"
        >
          <span class="metric-label">
            {{ arabicMode ? 'معالجة العربية' : 'Arabic Processing' }}
          </span>
          <Badge 
            :variant="culturalValidation.arabic.quality.readabilityScore > 0.8 ? 'success' : 'warning'"
            class="metric-value"
          >
            {{ Math.round(culturalValidation.arabic.quality.readabilityScore * 100) }}%
          </Badge>
        </div>
        
        <div class="metric">
          <span class="metric-label">
            {{ arabicMode ? 'المجال المهني' : 'Professional Domain' }}
          </span>
          <Badge 
            :variant="culturalValidation.professional.score > 0.8 ? 'success' : 'warning'"
            class="metric-value"
          >
            {{ Math.round(culturalValidation.professional.score * 100) }}%
          </Badge>
        </div>
      </div>
    </div>
    
    <!-- Help Text -->
    <div 
      v-if="helpText"
      class="help-text"
      :class="{ 'arabic-help': arabicMode && arabicHelpText }"
    >
      <Icon name="help" class="help-icon" />
      <span>{{ arabicMode && arabicHelpText ? arabicHelpText : helpText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { useArabicProcessing } from '../../composables/useArabicProcessing'
import { useIslamicCompliance } from '../../composables/useIslamicCompliance'
import { useCulturalValidation } from '../../composables/useCulturalValidation'
import type { 
  NodeParameter 
} from '../../types/workflow.types'
import type { 
  CulturalValidationResult,
  ArabicProcessingResult 
} from '../../types/cultural.types'

// Components
import ArabicInputHelper from './ArabicInputHelper.vue'
import MultiSelect from './MultiSelect.vue'
import JsonEditor from './JsonEditor.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/ui/icon'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

// Props
interface Props {
  parameter: NodeParameter
  value?: any
  arabicMode?: boolean
  layoutDirection?: 'ltr' | 'rtl'
  ministryMode?: boolean
  professionalDomain?: string
  readonly?: boolean
  showCulturalStatus?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  arabicMode: false,
  layoutDirection: 'ltr',
  readonly: false,
  showCulturalStatus: true
})

// Emits
const emit = defineEmits<{
  'update:value': [value: any]
  'cultural-validation': [result: CulturalValidationResult]
  'arabic-processing': [result: ArabicProcessingResult]
  'validation-error': [error: any]
}>()

// Composables
const { t } = useI18n()
const { processArabicText, detectDialect } = useArabicProcessing()
const { validateIslamicCompliance } = useIslamicCompliance()
const { validateCulturalCompliance } = useCulturalValidation()

// Reactive data
const inputValue = ref(props.value)
const textDirection = ref<'ltr' | 'rtl'>(props.layoutDirection)
const dialectPreference = ref('standard')
const showArabicHelper = ref(false)
const validationMessages = ref<any[]>([])
const culturalValidation = ref<CulturalValidationResult>()
const focused = ref(false)

// Computed properties
const inputId = computed(() => `param-${props.parameter.name}`)

const isMultiline = computed(() => 
  props.parameter.type === 'arabic-text' || 
  (props.parameter.type === 'string' && props.parameter.validation?.multiline)
)

const textRows = computed(() => {
  if (props.parameter.type === 'arabic-text') return 4
  return 3
})

const hasError = computed(() => 
  validationMessages.value.some(msg => msg.type === 'error')
)

const hasCulturalWarning = computed(() => 
  validationMessages.value.some(msg => msg.type === 'cultural-warning')
)

const inputClasses = computed(() => [
  'parameter-control',
  'text-sm',
  'border', 'border-input',
  'bg-background',
  'px-3', 'py-2',
  'rounded-md',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-ring',
  'focus:border-transparent',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
  {
    'border-destructive': hasError.value,
    'border-orange-500': hasCulturalWarning.value,
    'text-right': textDirection.value === 'rtl',
    'font-arabic': props.parameter.type === 'arabic-text'
  }
])

const textInputClasses = computed(() => [
  ...inputClasses.value,
  {
    'resize-vertical': isMultiline.value,
    'min-h-[2.5rem]': !isMultiline.value
  }
])

const helpText = computed(() => {
  // Generate contextual help text based on parameter type and cultural settings
  if (props.parameter.type === 'arabic-text') {
    return 'Enter Arabic text. Automatic dialect detection and cultural validation enabled.'
  }
  if (props.parameter.cultural?.islamicContentFilter) {
    return 'Content will be validated for Islamic compliance.'
  }
  return null
})

const arabicHelpText = computed(() => {
  if (props.parameter.type === 'arabic-text') {
    return 'أدخل النص العربي. تم تفعيل اكتشاف اللهجة والتحقق الثقافي تلقائياً.'
  }
  if (props.parameter.cultural?.islamicContentFilter) {
    return 'سيتم التحقق من المحتوى للتوافق الإسلامي.'
  }
  return null
})

// Methods
const getPlaceholder = (): string => {
  if (props.arabicMode && props.parameter.arabicDisplayName) {
    return `أدخل ${props.parameter.arabicDisplayName}...`
  }
  return `Enter ${props.parameter.displayName.toLowerCase()}...`
}

const getTextDirection = (): 'ltr' | 'rtl' => {
  if (props.parameter.type === 'arabic-text') {
    return textDirection.value
  }
  return props.layoutDirection
}

const getMessageIcon = (type: string): string => {
  switch (type) {
    case 'error': return 'alert-circle'
    case 'warning': return 'alert-triangle'
    case 'cultural-warning': return 'cultural-warning'
    case 'info': return 'info'
    case 'success': return 'check-circle'
    default: return 'info'
  }
}

const updateValue = (value: any) => {
  inputValue.value = value
  emit('update:value', value)
  validateInput()
}

const onInput = async (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  inputValue.value = target.value
  emit('update:value', target.value)
  
  // Debounced validation
  await nextTick()
  validateInput()
  
  // Arabic text processing
  if (props.parameter.type === 'arabic-text' && target.value) {
    await processArabicInput(target.value)
  }
}

const onFocus = () => {
  focused.value = true
  
  // Show Arabic helper for Arabic text inputs
  if (props.parameter.type === 'arabic-text') {
    showArabicHelper.value = true
  }
}

const onBlur = () => {
  focused.value = false
  showArabicHelper.value = false
  
  // Final validation on blur
  validateInput()
}

const onKeyDown = (event: KeyboardEvent) => {
  // Handle special key combinations for Arabic input
  if (props.parameter.type === 'arabic-text') {
    // Ctrl+Shift+D: Toggle text direction
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault()
      toggleTextDirection()
    }
    
    // Ctrl+Shift+A: Auto-detect dialect
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
      event.preventDefault()
      autoDetectDialect()
    }
  }
}

const toggleTextDirection = () => {
  textDirection.value = textDirection.value === 'rtl' ? 'ltr' : 'rtl'
}

const autoDetectDialect = async () => {
  if (inputValue.value && props.parameter.type === 'arabic-text') {
    try {
      const result = await detectDialect(inputValue.value)
      dialectPreference.value = result.primary
      onDialectDetected(result)
    } catch (error) {
      console.error('Dialect detection failed:', error)
    }
  }
}

const processArabicInput = async (text: string) => {
  try {
    const result = await processArabicText(text, props.professionalDomain)
    emit('arabic-processing', result)
    
    // Update validation messages based on Arabic processing
    updateArabicValidationMessages(result)
    
  } catch (error) {
    console.error('Arabic text processing failed:', error)
  }
}

const validateInput = async () => {
  const messages: any[] = []
  
  // Basic validation
  if (props.parameter.required && !inputValue.value) {
    messages.push({
      id: 'required',
      type: 'error',
      text: 'This field is required',
      arabicText: 'هذا الحقل مطلوب'
    })
  }
  
  // Type-specific validation
  if (props.parameter.type === 'number' && inputValue.value) {
    const num = Number(inputValue.value)
    if (isNaN(num)) {
      messages.push({
        id: 'invalid-number',
        type: 'error',
        text: 'Please enter a valid number',
        arabicText: 'يرجى إدخال رقم صحيح'
      })
    } else {
      if (props.parameter.validation?.min !== undefined && num < props.parameter.validation.min) {
        messages.push({
          id: 'min-value',
          type: 'error',
          text: `Minimum value is ${props.parameter.validation.min}`,
          arabicText: `القيمة الدنيا هي ${props.parameter.validation.min}`
        })
      }
      if (props.parameter.validation?.max !== undefined && num > props.parameter.validation.max) {
        messages.push({
          id: 'max-value',
          type: 'error',
          text: `Maximum value is ${props.parameter.validation.max}`,
          arabicText: `القيمة العليا هي ${props.parameter.validation.max}`
        })
      }
    }
  }
  
  // Pattern validation
  if (props.parameter.validation?.pattern && inputValue.value) {
    const pattern = new RegExp(props.parameter.validation.pattern)
    if (!pattern.test(inputValue.value)) {
      messages.push({
        id: 'pattern-mismatch',
        type: 'error',
        text: 'Input format is invalid',
        arabicText: 'تنسيق الإدخال غير صحيح'
      })
    }
  }
  
  // Cultural validation
  if (props.parameter.cultural?.islamicContentFilter && inputValue.value) {
    await validateCulturalContent()
  }
  
  validationMessages.value = messages
  
  if (messages.some(msg => msg.type === 'error')) {
    emit('validation-error', messages)
  }
}

const validateCulturalContent = async () => {
  try {
    const result = await validateCulturalCompliance({
      type: props.parameter.type,
      value: inputValue.value,
      culturalSettings: props.parameter.cultural,
      professionalDomain: props.professionalDomain
    })
    
    culturalValidation.value = result
    emit('cultural-validation', result)
    
    // Add cultural validation messages
    if (result.overall.score < 0.8) {
      validationMessages.value.push({
        id: 'cultural-compliance',
        type: 'cultural-warning',
        text: 'Content may not meet cultural compliance standards',
        arabicText: 'قد لا يلتزم المحتوى بمعايير التوافق الثقافي'
      })
    }
    
    // Add Islamic compliance messages
    if (result.islamic.score < 0.9) {
      validationMessages.value.push({
        id: 'islamic-compliance',
        type: 'warning',
        text: 'Content may not meet Islamic compliance requirements',
        arabicText: 'قد لا يلتزم المحتوى بمتطلبات التوافق الإسلامي'
      })
    }
    
  } catch (error) {
    console.error('Cultural validation failed:', error)
  }
}

const updateArabicValidationMessages = (result: ArabicProcessingResult) => {
  // Remove old Arabic processing messages
  validationMessages.value = validationMessages.value.filter(msg => 
    !msg.id.startsWith('arabic-')
  )
  
  // Add new messages from Arabic processing
  result.issues.forEach(issue => {
    validationMessages.value.push({
      id: `arabic-${issue.id}`,
      type: issue.severity === 'high' ? 'warning' : 'info',
      text: issue.message,
      arabicText: issue.arabicMessage
    })
  })
  
  // Add dialect confidence warning if low
  if (result.analysis.confidence < 0.5) {
    validationMessages.value.push({
      id: 'arabic-low-confidence',
      type: 'info',
      text: 'Dialect detection confidence is low',
      arabicText: 'مستوى الثقة في اكتشاف اللهجة منخفض'
    })
  }
}

const applySuggestion = (suggestion: any) => {
  inputValue.value = suggestion.text
  emit('update:value', suggestion.text)
  validateInput()
}

const onDialectDetected = (dialect: any) => {
  dialectPreference.value = dialect.primary
  
  // Show dialect detection info
  validationMessages.value = validationMessages.value.filter(msg => 
    msg.id !== 'dialect-detected'
  )
  
  if (dialect.confidence > 0.7) {
    validationMessages.value.push({
      id: 'dialect-detected',
      type: 'success',
      text: `Detected ${dialect.primary} dialect (${Math.round(dialect.confidence * 100)}% confidence)`,
      arabicText: `تم اكتشاف اللهجة ${dialect.primary} (${Math.round(dialect.confidence * 100)}% ثقة)`
    })
  }
}

const onJsonValidationError = (error: any) => {
  validationMessages.value.push({
    id: 'json-validation',
    type: 'error',
    text: `JSON validation error: ${error.message}`,
    arabicText: `خطأ في التحقق من JSON: ${error.message}`
  })
}

// Watch for value changes from parent
watch(() => props.value, (newValue) => {
  if (newValue !== inputValue.value) {
    inputValue.value = newValue
    validateInput()
  }
})

// Watch for cultural settings changes
watch(() => props.parameter.cultural, () => {
  if (inputValue.value) {
    validateInput()
  }
}, { deep: true })
</script>

<style scoped>
.parameter-input {
  @apply space-y-2;
}

.parameter-input.input-rtl {
  direction: rtl;
}

.parameter-input.input-arabic {
  font-family: var(--font-arabic), var(--font-system);
}

.parameter-input.input-error {
  --border-color: rgb(239 68 68);
}

.parameter-input.input-cultural-warning {
  --border-color: rgb(249 115 22);
}

/* Label */
.parameter-label {
  @apply flex items-center justify-between;
}

.label-text {
  @apply text-sm font-medium text-foreground;
}

.label-text.arabic-label {
  font-family: var(--font-arabic);
  font-weight: 600;
}

.required-indicator {
  @apply text-destructive ml-1;
}

.parameter-input.input-rtl .required-indicator {
  @apply ml-0 mr-1;
}

.label-indicators {
  @apply flex items-center gap-1;
}

.cultural-indicator {
  @apply w-4 h-4;
}

.cultural-indicator.islamic {
  @apply text-green-600 dark:text-green-400;
}

.cultural-indicator.arabic {
  @apply text-blue-600 dark:text-blue-400;
}

.cultural-indicator.dialect {
  @apply text-purple-600 dark:text-purple-400;
}

/* Description */
.parameter-description {
  @apply text-xs text-muted-foreground;
}

.parameter-description.arabic-description {
  font-family: var(--font-arabic);
  text-align: right;
}

/* Input Container */
.input-container {
  @apply relative;
}

.text-input-wrapper {
  @apply relative;
}

.parameter-control {
  @apply w-full transition-colors;
}

.parameter-control.font-arabic {
  font-family: var(--font-arabic);
}

.direction-toggle {
  @apply absolute top-2 right-2 w-6 h-6 p-0;
}

.parameter-input.input-rtl .direction-toggle {
  @apply right-auto left-2;
}

/* Boolean Input */
.boolean-input {
  @apply flex items-center gap-2;
}

.boolean-label {
  @apply text-sm cursor-pointer;
}

/* Select Options */
.option-content {
  @apply flex items-center justify-between w-full;
}

.option-indicators {
  @apply flex items-center gap-1;
}

.option-indicator {
  @apply w-4 h-4;
}

.option-indicator.success {
  @apply text-green-600;
}

.option-indicator.warning {
  @apply text-orange-600;
}

.non-compliant {
  @apply text-muted-foreground;
}

/* Validation Messages */
.validation-messages {
  @apply space-y-1;
}

.validation-message {
  @apply flex items-center gap-2 text-xs p-2 rounded;
}

.validation-message.message-error {
  @apply bg-destructive/10 text-destructive;
}

.validation-message.message-warning {
  @apply bg-orange-500/10 text-orange-600 dark:text-orange-400;
}

.validation-message.message-cultural-warning {
  @apply bg-purple-500/10 text-purple-600 dark:text-purple-400;
}

.validation-message.message-info {
  @apply bg-blue-500/10 text-blue-600 dark:text-blue-400;
}

.validation-message.message-success {
  @apply bg-green-500/10 text-green-600 dark:text-green-400;
}

.validation-message.arabic-message {
  font-family: var(--font-arabic);
  text-align: right;
}

.message-icon {
  @apply w-4 h-4 flex-shrink-0;
}

.message-text {
  @apply flex-1;
}

/* Cultural Status */
.cultural-status {
  @apply p-3 bg-muted/50 rounded border;
}

.status-header {
  @apply flex items-center gap-2 mb-2 text-sm font-medium;
}

.status-metrics {
  @apply space-y-1;
}

.metric {
  @apply flex items-center justify-between text-xs;
}

.metric-label {
  @apply text-muted-foreground;
}

.metric-value {
  @apply text-xs;
}

/* Help Text */
.help-text {
  @apply flex items-center gap-2 text-xs text-muted-foreground;
}

.help-text.arabic-help {
  font-family: var(--font-arabic);
  text-align: right;
  flex-direction: row-reverse;
}

.help-icon {
  @apply w-4 h-4 flex-shrink-0;
}

/* Focus States */
.parameter-control:focus {
  @apply ring-2 ring-ring ring-offset-2;
}

/* Ministry Themes */
.input-ministry-health {
  --accent-color: #059669;
}

.input-ministry-education {
  --accent-color: #0284c7;
}

.input-ministry-interior {
  --accent-color: #dc2626;
}

.input-ministry-justice {
  --accent-color: #7c3aed;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .parameter-control {
    border-width: 2px;
  }
  
  .validation-message {
    border: 1px solid currentColor;
  }
}

/* Print Styles */
@media print {
  .direction-toggle,
  .cultural-status,
  .validation-messages {
    display: none;
  }
}
</style>