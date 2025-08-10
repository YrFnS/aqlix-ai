/**
 * Enhanced Conversation Model for Iraqi AI Chat System
 * Extracted from LibreChat/api/models/Conversation.js
 * Enhanced with Iraqi cultural context and Arabic language support
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Iraqi AI enhancement: Cultural context schema
const culturalContextSchema = new Schema({
  islamicCompliance: {
    type: String,
    enum: ['strict', 'moderate', 'flexible'],
    default: 'moderate'
  },
  sectarianSensitivity: {
    type: String,
    enum: ['neutral', 'aware', 'sensitive'],
    default: 'neutral'
  },
  professionalDomain: {
    type: String,
    enum: ['general', 'legal', 'medical', 'educational', 'government', 'finance'],
    default: 'general'
  },
  dialectPreference: {
    type: String,
    enum: ['iraqi', 'standard_arabic', 'mixed'],
    default: 'iraqi'
  },
  regionalContext: {
    type: String,
    enum: ['baghdad', 'basra', 'mosul', 'erbil', 'najaf', 'karbala', 'other'],
    default: 'baghdad'
  }
}, { _id: false });

// Enhanced message schema with Arabic support
const messageSchema = new Schema({
  messageId: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  parentMessageId: {
    type: String,
    default: null,
    index: true,
  },
  sender: {
    type: String,
    required: true,
    enum: ['User', 'Assistant', 'System'],
  },
  text: {
    type: String,
    required: true,
  },
  // Iraqi AI enhancements
  language: {
    type: String,
    enum: ['arabic', 'english', 'mixed'],
    default: 'english'
  },
  isRtl: {
    type: Boolean,
    default: false
  },
  arabicContent: {
    originalText: String,
    transliteration: String,
    dialectVariation: String
  },
  culturalValidation: {
    isValidated: { type: Boolean, default: false },
    validationScore: { type: Number, min: 0, max: 1 },
    islamicCompliance: { type: Boolean, default: true },
    culturalAppropriateness: { type: Number, min: 0, max: 1 }
  },
  professionalContext: {
    domain: String,
    expertise: String,
    terminology: [String]
  },
  isCreatedByUser: {
    type: Boolean,
    required: true,
  },
  error: {
    type: Boolean,
    default: false,
  },
  model: String,
  finish_reason: String,
  unfinished: {
    type: Boolean,
    default: false,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  plugin: {
    latest: String,
    inputs: [Schema.Types.Mixed],
    outputs: String,
  },
  // Enhanced token tracking
  tokenCount: {
    type: Number,
    default: 0,
  },
  arabicTokenCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Main conversation schema with Iraqi enhancements
const conversationSchema = new Schema({
  conversationId: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Conversation',
  },
  // Iraqi AI enhancement: Arabic title support
  arabicTitle: {
    type: String,
    default: null
  },
  user: {
    type: String,
    required: true,
    index: true,
  },
  messages: [messageSchema],
  
  // Cultural context for the conversation
  culturalContext: culturalContextSchema,
  
  // Conversation-level language settings
  primaryLanguage: {
    type: String,
    enum: ['arabic', 'english', 'mixed'],
    default: 'english'
  },
  
  // Professional session context
  professionalSession: {
    isActive: { type: Boolean, default: false },
    domain: String,
    specialist: String,
    confidentialityLevel: {
      type: String,
      enum: ['public', 'professional', 'confidential'],
      default: 'public'
    }
  },
  
  // Enhanced conversation metadata
  model: String,
  endpoint: String,
  suggestions: [String],
  tools: [Schema.Types.Mixed],
  
  // Iraqi AI: Cultural compliance tracking
  overallCulturalScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  
  // Message statistics with Arabic awareness
  messageStats: {
    totalMessages: { type: Number, default: 0 },
    userMessages: { type: Number, default: 0 },
    assistantMessages: { type: Number, default: 0 },
    arabicMessages: { type: Number, default: 0 },
    mixedLanguageMessages: { type: Number, default: 0 },
    averageCulturalScore: { type: Number, default: 0.8 }
  },
  
  // Conversation quality metrics
  qualityMetrics: {
    helpfulnessRating: { type: Number, min: 1, max: 5 },
    culturalAppropriatenessRating: { type: Number, min: 1, max: 5 },
    professionalAccuracyRating: { type: Number, min: 1, max: 5 },
    userSatisfactionScore: { type: Number, min: 0, max: 1 }
  }
}, {
  timestamps: true,
});

// Indexes for Iraqi AI performance optimization
conversationSchema.index({ user: 1, createdAt: -1 });
conversationSchema.index({ 'culturalContext.professionalDomain': 1 });
conversationSchema.index({ primaryLanguage: 1, createdAt: -1 });
conversationSchema.index({ 'professionalSession.domain': 1, 'professionalSession.isActive': 1 });
conversationSchema.index({ overallCulturalScore: -1 });

// Enhanced methods with Iraqi AI context
conversationSchema.methods.addMessage = function(messageData) {
  const message = {
    messageId: messageData.messageId || new mongoose.Types.ObjectId().toString(),
    conversationId: this.conversationId,
    parentMessageId: messageData.parentMessageId,
    sender: messageData.sender,
    text: messageData.text,
    isCreatedByUser: messageData.isCreatedByUser,
    model: messageData.model,
    // Iraqi AI enhancements
    language: messageData.language || 'english',
    isRtl: messageData.isRtl || false,
    arabicContent: messageData.arabicContent || {},
    culturalValidation: messageData.culturalValidation || {
      isValidated: false,
      validationScore: 0.8,
      islamicCompliance: true,
      culturalAppropriateness: 0.8
    },
    professionalContext: messageData.professionalContext || {},
    tokenCount: messageData.tokenCount || 0,
    arabicTokenCount: messageData.arabicTokenCount || 0
  };

  this.messages.push(message);
  
  // Update conversation statistics
  this.messageStats.totalMessages++;
  if (messageData.isCreatedByUser) {
    this.messageStats.userMessages++;
  } else {
    this.messageStats.assistantMessages++;
  }
  
  // Update Arabic message statistics
  if (messageData.language === 'arabic') {
    this.messageStats.arabicMessages++;
  } else if (messageData.language === 'mixed') {
    this.messageStats.mixedLanguageMessages++;
  }
  
  // Update cultural score
  if (messageData.culturalValidation?.validationScore) {
    const currentAvg = this.messageStats.averageCulturalScore || 0.8;
    const totalMessages = this.messageStats.totalMessages;
    this.messageStats.averageCulturalScore = 
      (currentAvg * (totalMessages - 1) + messageData.culturalValidation.validationScore) / totalMessages;
    this.overallCulturalScore = this.messageStats.averageCulturalScore;
  }

  return message;
};

conversationSchema.methods.getMessagesWithCulturalContext = function() {
  return this.messages.map(msg => ({
    ...msg.toObject(),
    conversationCulturalContext: this.culturalContext,
    conversationLanguage: this.primaryLanguage
  }));
};

conversationSchema.methods.updateCulturalContext = function(newContext) {
  this.culturalContext = { ...this.culturalContext.toObject(), ...newContext };
  return this.culturalContext;
};

conversationSchema.methods.startProfessionalSession = function(domain, specialist) {
  this.professionalSession = {
    isActive: true,
    domain: domain,
    specialist: specialist,
    confidentialityLevel: domain === 'medical' || domain === 'legal' ? 'confidential' : 'professional'
  };
  
  // Update cultural context for professional domain
  this.culturalContext.professionalDomain = domain;
  
  return this.professionalSession;
};

conversationSchema.methods.endProfessionalSession = function() {
  this.professionalSession.isActive = false;
  return this.professionalSession;
};

// Static methods for Iraqi AI queries
conversationSchema.statics.findByProfessionalDomain = function(domain, userId) {
  return this.find({
    user: userId,
    'culturalContext.professionalDomain': domain
  }).sort({ updatedAt: -1 });
};

conversationSchema.statics.findArabicConversations = function(userId) {
  return this.find({
    user: userId,
    $or: [
      { primaryLanguage: 'arabic' },
      { primaryLanguage: 'mixed' },
      { 'messageStats.arabicMessages': { $gt: 0 } }
    ]
  }).sort({ updatedAt: -1 });
};

conversationSchema.statics.findByCulturalScore = function(minScore, userId) {
  return this.find({
    user: userId,
    overallCulturalScore: { $gte: minScore }
  }).sort({ overallCulturalScore: -1, updatedAt: -1 });
};

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = {
  Conversation,
  messageSchema,
  conversationSchema,
};

/**
 * Iraqi AI Chat System Enhancements Applied:
 * 
 * 1. Cultural Context Schema - Islamic compliance, sectarian sensitivity, regional context
 * 2. Arabic Language Support - RTL text, dialect handling, transliteration
 * 3. Professional Domain Tracking - Legal, medical, educational contexts
 * 4. Cultural Validation Scores - Islamic compliance and appropriateness ratings
 * 5. Enhanced Message Statistics - Arabic message tracking and cultural scoring
 * 6. Professional Session Management - Confidentiality levels and specialist tracking
 * 7. Iraqi-Specific Query Methods - Professional domain and Arabic conversation queries
 * 8. Performance Indexes - Optimized for Iraqi cultural and language patterns
 * 9. Quality Metrics - Helpfulness, cultural appropriateness, professional accuracy
 * 10. Bilingual Title Support - Arabic and English conversation titles
 */