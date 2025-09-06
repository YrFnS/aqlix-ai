/**
 * Iraqi Legal Document Processing Block
 * Specialized block for Iraqi legal document workflows
 */

import { LegalDocumentIcon } from '../../icons/cultural-icons'
import type { BlockConfig } from '../types'

interface LegalDocumentResponse {
  documentId: string
  documentType: string
  status: 'draft' | 'review' | 'approved' | 'rejected'
  culturalCompliance: {
    islamicCompliance: number
    iraqiLawCompliance: number
    politicalNeutrality: number
  }
  arabicProcessing: {
    originalText: string
    processedText: string
    legalTermsValidated: boolean
    dialectConversion: string
  }
  legalValidation: {
    isValid: boolean
    violations: string[]
    suggestions: string[]
    complianceLevel: number
  }
  signatures?: Array<{
    signerId: string
    signerName: string
    timestamp: string
    digitalSignature: string
  }>
}

export const LegalDocumentBlock: BlockConfig<LegalDocumentResponse> = {
  type: 'legal-document',
  name: 'الوثيقة القانونية / Legal Document',
  description: 'Process Iraqi legal documents with compliance validation',
  longDescription: 'Comprehensive Iraqi legal document processing with Islamic law compliance, Arabic legal terminology validation, and Iraqi legal system integration',
  category: 'professional-domains',
  bgColor: '#8B4513',
  icon: LegalDocumentIcon,

  subBlocks: [
    {
      id: 'documentType',
      title: 'نوع الوثيقة / Document Type',
      type: 'dropdown',
      layout: 'full',
      required: true,
      options: [
        { label: 'عقد / Contract', id: 'contract' },
        { label: 'وصية / Will/Testament', id: 'will' },
        { label: 'وكالة / Power of Attorney', id: 'power-of-attorney' },
        { label: 'اتفاقية / Agreement', id: 'agreement' },
        { label: 'مذكرة قانونية / Legal Memorandum', id: 'memorandum' },
        { label: 'لائحة دعوى / Lawsuit Filing', id: 'lawsuit' },
        { label: 'شهادة / Certificate', id: 'certificate' },
        { label: 'رخصة / License', id: 'license' },
        { label: 'وثيقة زواج / Marriage Certificate', id: 'marriage' },
        { label: 'وثيقة طلاق / Divorce Document', id: 'divorce' },
      ],
      rtlSupport: true,
    },

    {
      id: 'documentContent',
      title: 'محتوى الوثيقة / Document Content',
      type: 'arabic-text-input',
      layout: 'full',
      required: true,
      rows: 12,
      placeholder: 'أدخل نص الوثيقة القانونية...\nEnter legal document text...',
      description: 'Legal document content in Arabic with legal terminology support',
      rtlSupport: true,
      arabicKeyboard: true,
      culturalValidation: true,
      professionalContext: 'legal',
    },

    {
      id: 'islamicCompliance',
      title: 'الامتثال الإسلامي / Islamic Compliance',
      type: 'islamic-compliance-check',
      layout: 'full',
      description: 'Ensure document complies with Islamic legal principles (Sharia)',
      mode: 'advanced',
    },

    {
      id: 'iraqiLawCompliance',
      title: 'الامتثال للقانون العراقي / Iraqi Law Compliance',
      type: 'checkbox-list',
      layout: 'full',
      options: [
        { label: 'القانون المدني العراقي / Iraqi Civil Code', id: 'civil-code' },
        { label: 'قانون الأحوال الشخصية / Personal Status Law', id: 'personal-status' },
        { label: 'قانون التجارة / Commercial Law', id: 'commercial' },
        { label: 'قانون العمل / Labor Law', id: 'labor' },
        { label: 'القانون الجنائي / Criminal Law', id: 'criminal' },
        { label: 'قانون الأراضي / Land Law', id: 'land' },
        { label: 'قانون الشركات / Companies Law', id: 'companies' },
      ],
      description: 'Select applicable Iraqi legal frameworks',
      rtlSupport: true,
    },

    {
      id: 'legalTerminology',
      title: 'المصطلحات القانونية / Legal Terminology',
      type: 'dropdown',
      layout: 'half',
      options: [
        { label: 'عربية فصحى قانونية / Classical Legal Arabic', id: 'classical' },
        { label: 'مصطلحات قانونية عراقية / Iraqi Legal Terms', id: 'iraqi' },
        { label: 'مختلط / Mixed Terminology', id: 'mixed' },
        { label: 'مصطلحات إسلامية / Islamic Legal Terms', id: 'islamic' },
      ],
      value: () => 'iraqi',
      description: 'Legal terminology style preference',
      rtlSupport: true,
    },

    {
      id: 'validationLevel',
      title: 'مستوى التحقق / Validation Level',
      type: 'dropdown',
      layout: 'half',
      options: [
        { label: 'أساسي / Basic', id: 'basic' },
        { label: 'شامل / Comprehensive', id: 'comprehensive' },
        { label: 'خبير قانوني / Legal Expert', id: 'expert' },
        { label: 'محكمة / Court-Ready', id: 'court' },
      ],
      value: () => 'comprehensive',
      description: 'Level of legal validation required',
      rtlSupport: true,
    },

    {
      id: 'parties',
      title: 'الأطراف / Parties',
      type: 'table',
      layout: 'full',
      columns: ['الاسم / Name', 'النوع / Type', 'الهوية / ID', 'التوقيع / Signature'],
      description: 'Legal parties involved in the document',
      mode: 'advanced',
      rtlSupport: true,
    },

    {
      id: 'witnesses',
      title: 'الشهود / Witnesses',
      type: 'table',
      layout: 'full',
      columns: ['اسم الشاهد / Witness Name', 'الهوية / ID', 'التوقيع / Signature'],
      description: 'Legal witnesses for document validation',
      mode: 'advanced',
      condition: {
        field: 'documentType',
        value: ['will', 'marriage', 'contract']
      },
      rtlSupport: true,
    },

    {
      id: 'digitalSignature',
      title: 'التوقيع الرقمي / Digital Signature',
      type: 'switch',
      description: 'Enable digital signature for legal validity',
      mode: 'advanced',
    },

    {
      id: 'notarization',
      title: 'التوثيق / Notarization',
      type: 'checkbox-list',
      mode: 'advanced',
      options: [
        { label: 'توثيق كاتب العدل / Notary Public', id: 'notary' },
        { label: 'ختم المحكمة / Court Seal', id: 'court-seal' },
        { label: 'توثيق إلكتروني / Electronic Notarization', id: 'electronic' },
        { label: 'شهادة رقمية / Digital Certificate', id: 'digital-cert' },
      ],
      description: 'Required notarization and authentication',
      rtlSupport: true,
    },

    {
      id: 'archiving',
      title: 'الأرشفة / Archiving',
      type: 'checkbox-list',
      mode: 'advanced',
      options: [
        { label: 'أرشيف إلكتروني / Electronic Archive', id: 'electronic' },
        { label: 'نسخة احتياطية / Backup Copy', id: 'backup' },
        { label: 'تشفير البيانات / Data Encryption', id: 'encryption' },
        { label: 'فهرسة تلقائية / Auto Indexing', id: 'indexing' },
      ],
      description: 'Document archiving and storage options',
      rtlSupport: true,
    },
  ],

  tools: {
    access: [
      'iraqi_legal_validator',
      'islamic_law_checker', 
      'arabic_legal_processor',
      'cultural_validator',
      'digital_signature_service',
      'legal_archive_service',
    ],
  },

  inputs: {
    documentType: {
      type: 'string',
      description: 'Type of legal document',
      professionalDomain: 'legal',
    },
    documentContent: {
      type: 'arabic-text',
      description: 'Legal document content with Arabic support',
      culturalValidation: true,
      arabicSupport: true,
      professionalDomain: 'legal',
    },
    islamicCompliance: {
      type: 'json',
      description: 'Islamic law compliance requirements',
    },
    iraqiLawCompliance: {
      type: 'json',
      description: 'Iraqi legal framework compliance settings',
    },
    legalTerminology: {
      type: 'string',
      description: 'Legal terminology style preference',
    },
    validationLevel: {
      type: 'string',
      description: 'Level of legal validation required',
    },
    parties: {
      type: 'json',
      description: 'Legal parties involved in document',
    },
    witnesses: {
      type: 'json',
      description: 'Legal witnesses for document',
    },
    digitalSignature: {
      type: 'boolean',
      description: 'Enable digital signature',
    },
    notarization: {
      type: 'json',
      description: 'Notarization and authentication requirements',
    },
    archiving: {
      type: 'json',
      description: 'Document archiving preferences',
    },
  },

  outputs: {
    documentId: {
      type: 'string',
      description: 'Unique document identifier',
    },
    documentType: {
      type: 'string',
      description: 'Validated document type',
    },
    status: {
      type: 'string',
      description: 'Document processing status',
    },
    culturalCompliance: {
      type: 'json',
      description: 'Cultural and religious compliance scores',
    },
    arabicProcessing: {
      type: 'json',
      description: 'Arabic text processing results with legal terminology',
    },
    legalValidation: {
      type: 'json',
      description: 'Comprehensive legal validation results',
    },
    complianceReport: {
      type: 'json',
      description: 'Detailed compliance report with Iraqi law references',
    },
    signatures: {
      type: 'json',
      description: 'Digital signatures and witness information',
    },
    archiveLocation: {
      type: 'string',
      description: 'Document archive location and reference',
    },
    legalCitations: {
      type: 'json',
      description: 'Relevant Iraqi law citations and references',
    },
  },

  // Iraqi AI Enhancements
  iraqiEnhancements: {
    culturalValidation: {
      enabled: true,
      islamicCompliance: true,
      politicalNeutrality: true,
      professionalContext: 'legal',
      dialectSupport: 'standard', // Legal documents prefer classical Arabic
    },
    professionalDomains: {
      enabled: true,
      supportedDomains: ['legal'],
    },
    arabicProcessing: {
      enabled: true,
      dialectSupport: false, // Legal documents use formal Arabic
      rtlLayout: true,
      mixedContent: true,
    },
  },
}