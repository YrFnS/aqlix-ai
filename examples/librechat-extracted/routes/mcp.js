/**
 * Enhanced MCP (Model Context Protocol) Routes for Iraqi AI Chat System
 * Extracted from LibreChat/api/server/routes/mcp.js
 * Enhanced with PydanticAI integration and Iraqi cultural agent support
 */

const express = require('express');
const { requireJwtAuth } = require('~/server/middleware/requireJwtAuth');
const { validateModel } = require('~/server/middleware/validateModel');
const { logger } = require('~/config');
const { IraqiMcpManager } = require('../services/iraqiMcpManager');
const { IraqiAgentOrchestrator } = require('../services/iraqiAgentOrchestrator');

const router = express.Router();

// Initialize Iraqi MCP Manager with cultural agent support
const mcpManager = new IraqiMcpManager({
  culturalValidationAgents: [
    'iraqi-cultural-validator',
    'iraqi-cultural-tester',
    'arabic-rtl-processor'
  ],
  professionalAgents: [
    'iraqi-professional-domain-expert',
    'iraqi-business-analyst',
    'iraqi-product-manager'
  ],
  technicalAgents: [
    'iraqi-ai-agent-architect',
    'iraqi-technical-debugger',
    'iraqi-devops-engineer'
  ],
  uiuxAgents: [
    'iraqi-ui-designer',
    'iraqi-ux-researcher',
    'iraqi-interaction-designer',
    'iraqi-accessibility-specialist'
  ]
});

const agentOrchestrator = new IraqiAgentOrchestrator();

/**
 * GET /mcp/servers
 * List all available MCP servers with Iraqi enhancement status
 */
router.get('/servers', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const servers = await mcpManager.listServers(user.id);
    
    // Enhanced with Iraqi cultural context
    const enhancedServers = servers.map(server => ({
      ...server,
      iraqiEnhancements: {
        culturalValidation: server.capabilities?.includes('cultural_validation'),
        arabicSupport: server.capabilities?.includes('arabic_processing'),
        professionalDomains: server.professionalDomains || [],
        islamicCompliance: server.islamicCompliance || 'moderate'
      }
    }));
    
    res.json({ servers: enhancedServers });
  } catch (error) {
    logger.error('Error listing MCP servers:', error);
    res.status(500).json({ 
      error: 'فشل في جلب خوادم MCP', // Failed to fetch MCP servers
      details: error.message 
    });
  }
});

/**
 * POST /mcp/servers
 * Register a new MCP server with Iraqi cultural capabilities
 */
router.post('/servers', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const serverConfig = req.body;
    
    // Validate Iraqi enhancement requirements
    if (!serverConfig.name) {
      return res.status(400).json({ 
        error: 'اسم الخادم مطلوب', // Server name required
        field: 'name' 
      });
    }
    
    // Enhanced server registration with cultural context
    const enhancedConfig = {
      ...serverConfig,
      userId: user.id,
      iraqiEnhancements: {
        culturalValidation: serverConfig.enableCulturalValidation || false,
        arabicProcessing: serverConfig.enableArabicProcessing || false,
        professionalDomains: serverConfig.professionalDomains || [],
        islamicCompliance: serverConfig.islamicCompliance || 'moderate',
        dialectSupport: serverConfig.dialectSupport || ['iraqi'],
        regionalContext: serverConfig.regionalContext || 'baghdad'
      },
      authConfig: {
        ...serverConfig.authConfig,
        culturalPermissions: serverConfig.culturalPermissions || {
          allowReligiousContent: true,
          allowProfessionalAdvice: false,
          sectarianSensitivity: 'neutral'
        }
      }
    };
    
    const server = await mcpManager.registerServer(enhancedConfig);
    
    // Initialize Iraqi cultural agents for this server
    if (server.iraqiEnhancements.culturalValidation) {
      await agentOrchestrator.initializeCulturalAgents(server.id, user.id);
    }
    
    logger.info(`MCP server registered with Iraqi enhancements: ${server.name} for user: ${user.id}`);
    
    res.status(201).json({ 
      server,
      message: 'تم تسجيل الخادم بنجاح مع التحسينات العراقية' // Server registered successfully with Iraqi enhancements
    });
  } catch (error) {
    logger.error('Error registering MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في تسجيل الخادم', // Failed to register server
      details: error.message 
    });
  }
});

/**
 * GET /mcp/servers/:serverId
 * Get detailed server information with Iraqi context
 */
router.get('/servers/:serverId', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    
    const server = await mcpManager.getServer(serverId, user.id);
    
    if (!server) {
      return res.status(404).json({ 
        error: 'الخادم غير موجود', // Server not found
        serverId 
      });
    }
    
    // Enhanced with Iraqi cultural capabilities
    const enhancedServer = {
      ...server,
      culturalCapabilities: await mcpManager.getCulturalCapabilities(serverId),
      professionalServices: await mcpManager.getProfessionalServices(serverId),
      agentIntegrations: await agentOrchestrator.getServerAgents(serverId)
    };
    
    res.json({ server: enhancedServer });
  } catch (error) {
    logger.error('Error getting MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في جلب معلومات الخادم', // Failed to fetch server information
      details: error.message 
    });
  }
});

/**
 * PUT /mcp/servers/:serverId
 * Update MCP server configuration with Iraqi enhancements
 */
router.put('/servers/:serverId', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    const updates = req.body;
    
    // Validate user ownership
    const existingServer = await mcpManager.getServer(serverId, user.id);
    if (!existingServer) {
      return res.status(404).json({ 
        error: 'الخادم غير موجود أو غير مصرح لك بتعديله', // Server not found or not authorized to modify
        serverId 
      });
    }
    
    // Enhanced updates with cultural context preservation
    const enhancedUpdates = {
      ...updates,
      iraqiEnhancements: {
        ...existingServer.iraqiEnhancements,
        ...updates.iraqiEnhancements
      }
    };
    
    const updatedServer = await mcpManager.updateServer(serverId, enhancedUpdates);
    
    // Update agent integrations if cultural settings changed
    if (updates.iraqiEnhancements?.culturalValidation !== existingServer.iraqiEnhancements?.culturalValidation) {
      if (updates.iraqiEnhancements?.culturalValidation) {
        await agentOrchestrator.initializeCulturalAgents(serverId, user.id);
      } else {
        await agentOrchestrator.disableCulturalAgents(serverId);
      }
    }
    
    logger.info(`MCP server updated with Iraqi enhancements: ${serverId} by user: ${user.id}`);
    
    res.json({ 
      server: updatedServer,
      message: 'تم تحديث الخادم بنجاح' // Server updated successfully
    });
  } catch (error) {
    logger.error('Error updating MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في تحديث الخادم', // Failed to update server
      details: error.message 
    });
  }
});

/**
 * DELETE /mcp/servers/:serverId
 * Remove MCP server and cleanup Iraqi agent integrations
 */
router.delete('/servers/:serverId', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    
    // Validate user ownership
    const server = await mcpManager.getServer(serverId, user.id);
    if (!server) {
      return res.status(404).json({ 
        error: 'الخادم غير موجود أو غير مصرح لك بحذفه', // Server not found or not authorized to delete
        serverId 
      });
    }
    
    // Cleanup Iraqi agent integrations
    await agentOrchestrator.cleanupServerAgents(serverId);
    
    // Remove server
    await mcpManager.removeServer(serverId);
    
    logger.info(`MCP server removed with Iraqi cleanup: ${serverId} by user: ${user.id}`);
    
    res.json({ 
      message: 'تم حذف الخادم وتنظيف الوكلاء العراقيين بنجاح', // Server and Iraqi agents cleanup completed successfully
      serverId 
    });
  } catch (error) {
    logger.error('Error removing MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في حذف الخادم', // Failed to remove server
      details: error.message 
    });
  }
});

/**
 * POST /mcp/servers/:serverId/connect
 * Connect to MCP server with Iraqi cultural context
 */
router.post('/servers/:serverId/connect', requireJwtAuth, validateModel, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    const { culturalContext, professionalContext } = req.body;
    
    const server = await mcpManager.getServer(serverId, user.id);
    if (!server) {
      return res.status(404).json({ 
        error: 'الخادم غير موجود', // Server not found
        serverId 
      });
    }
    
    // Enhanced connection with Iraqi context
    const connectionConfig = {
      userId: user.id,
      culturalContext: {
        language: culturalContext?.language || 'english',
        dialect: culturalContext?.dialect || 'iraqi',
        islamicCompliance: culturalContext?.islamicCompliance || 'moderate',
        professionalDomain: professionalContext?.domain || 'general'
      },
      agentPreferences: {
        enableCulturalValidation: true,
        enableArabicProcessing: culturalContext?.language === 'arabic',
        professionalMode: professionalContext?.domain !== 'general'
      }
    };
    
    const connection = await mcpManager.connect(serverId, connectionConfig);
    
    // Initialize relevant Iraqi agents
    if (connectionConfig.agentPreferences.enableCulturalValidation) {
      await agentOrchestrator.activateAgentsForConnection(connection.id, culturalContext, professionalContext);
    }
    
    logger.info(`MCP connection established with Iraqi context: ${serverId} for user: ${user.id}`);
    
    res.json({ 
      connection,
      activatedAgents: connection.iraqiAgents || [],
      message: 'تم الاتصال بالخادم بنجاح مع السياق العراقي' // Connected to server successfully with Iraqi context
    });
  } catch (error) {
    logger.error('Error connecting to MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في الاتصال بالخادم', // Failed to connect to server
      details: error.message 
    });
  }
});

/**
 * POST /mcp/servers/:serverId/disconnect
 * Disconnect from MCP server and cleanup Iraqi agents
 */
router.post('/servers/:serverId/disconnect', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    
    const connection = await mcpManager.getConnection(serverId, user.id);
    if (!connection) {
      return res.status(404).json({ 
        error: 'لا يوجد اتصال نشط', // No active connection
        serverId 
      });
    }
    
    // Cleanup Iraqi agents
    await agentOrchestrator.deactivateAgentsForConnection(connection.id);
    
    // Disconnect from server
    await mcpManager.disconnect(serverId, user.id);
    
    logger.info(`MCP disconnection completed with Iraqi cleanup: ${serverId} for user: ${user.id}`);
    
    res.json({ 
      message: 'تم قطع الاتصال وتنظيف الوكلاء العراقيين بنجاح', // Disconnected and Iraqi agents cleanup completed successfully
      serverId 
    });
  } catch (error) {
    logger.error('Error disconnecting from MCP server:', error);
    res.status(500).json({ 
      error: 'فشل في قطع الاتصال', // Failed to disconnect
      details: error.message 
    });
  }
});

/**
 * GET /mcp/servers/:serverId/capabilities
 * Get server capabilities with Iraqi enhancement details
 */
router.get('/servers/:serverId/capabilities', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { serverId } = req.params;
    
    const capabilities = await mcpManager.getCapabilities(serverId, user.id);
    
    // Enhanced with Iraqi cultural capabilities
    const enhancedCapabilities = {
      ...capabilities,
      iraqiEnhancements: {
        culturalValidation: await mcpManager.getCulturalCapabilities(serverId),
        arabicProcessing: await mcpManager.getArabicCapabilities(serverId),
        professionalServices: await mcpManager.getProfessionalCapabilities(serverId),
        agentIntegration: await agentOrchestrator.getAgentCapabilities(serverId)
      }
    };
    
    res.json({ capabilities: enhancedCapabilities });
  } catch (error) {
    logger.error('Error getting MCP server capabilities:', error);
    res.status(500).json({ 
      error: 'فشل في جلب قدرات الخادم', // Failed to fetch server capabilities
      details: error.message 
    });
  }
});

/**
 * POST /mcp/cultural-validation
 * Validate content using Iraqi cultural agents through MCP
 */
router.post('/cultural-validation', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    const { content, validationType, professionalDomain } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        error: 'المحتوى المطلوب التحقق منه مفقود', // Content to validate is missing
        field: 'content' 
      });
    }
    
    // Use Iraqi cultural validation agents through MCP
    const validationResult = await agentOrchestrator.validateCulturalContent({
      content,
      userId: user.id,
      validationType: validationType || 'general',
      professionalDomain: professionalDomain || 'general',
      agents: ['iraqi-cultural-validator', 'arabic-rtl-processor']
    });
    
    res.json({ 
      validation: validationResult,
      message: validationResult.isValid ? 
        'المحتوى متوافق ثقافياً' : // Content is culturally compliant
        'المحتوى يحتاج إلى تعديل' // Content needs modification
    });
  } catch (error) {
    logger.error('Error validating cultural content:', error);
    res.status(500).json({ 
      error: 'فشل في التحقق الثقافي', // Failed to perform cultural validation
      details: error.message 
    });
  }
});

/**
 * GET /mcp/agents/status
 * Get status of Iraqi cultural agents
 */
router.get('/agents/status', requireJwtAuth, async (req, res) => {
  try {
    const { user } = req;
    
    const agentStatus = await agentOrchestrator.getAgentStatus(user.id);
    
    res.json({ 
      agents: agentStatus,
      totalAgents: agentStatus.length,
      activeAgents: agentStatus.filter(agent => agent.status === 'active').length
    });
  } catch (error) {
    logger.error('Error getting agent status:', error);
    res.status(500).json({ 
      error: 'فشل في جلب حالة الوكلاء', // Failed to fetch agent status
      details: error.message 
    });
  }
});

module.exports = router;

/**
 * Iraqi AI Chat System MCP Enhancements Applied:
 * 
 * 1. Cultural Agent Integration - Iraqi cultural validators, Arabic processors
 * 2. Professional Domain Support - Legal, medical, educational agent specialization
 * 3. Arabic Language Processing - RTL text handling and dialect support
 * 4. Islamic Compliance Validation - Religious content appropriateness checking
 * 5. Professional Context Awareness - Domain-specific agent activation
 * 6. Agent Orchestration - Coordinated multi-agent workflows
 * 7. Cultural Permission System - Sectarian sensitivity and professional boundaries
 * 8. Bilingual Error Messages - Arabic error reporting and user communication
 * 9. Enhanced Server Registration - Cultural capabilities and Iraqi context
 * 10. Agent Status Monitoring - Real-time agent health and performance tracking
 * 11. Connection Context Management - Cultural and professional session context
 * 12. Cleanup and Resource Management - Proper agent lifecycle management
 */