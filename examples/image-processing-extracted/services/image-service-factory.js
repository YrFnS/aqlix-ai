/**
 * Image Service Factory
 * Coordinates multiple image generation providers with Iraqi cultural compliance
 * 
 * Supports:
 * - DALL-E 2/3 (OpenAI)
 * - OpenAI Image Tools (editing)
 * - Stable Diffusion (future)
 * - Provider fallback and load balancing
 */

const { DALLEService } = require('./dalle-service');
const logger = require('../utils/logger');

class ImageServiceFactory {
    constructor() {
        this.services = new Map();
        this.config = {
            defaultProvider: 'dall-e-3',
            fallbackProviders: ['dall-e-2'],
            maxRetries: 3,
            retryDelay: 1000
        };
        
        // Initialize services
        this._initializeServices();
        
        logger.info('Image Service Factory initialized');
    }
    
    /**
     * Initialize all available image services
     * @private
     */
    _initializeServices() {
        try {
            // Initialize DALL-E service
            if (process.env.OPENAI_API_KEY) {
                const dalleService = new DALLEService({
                    apiKey: process.env.OPENAI_API_KEY,
                    timeout: 120000
                });
                
                this.services.set('dall-e-2', dalleService);
                this.services.set('dall-e-3', dalleService);
                this.services.set('openai-image-tools', dalleService);
                
                logger.info('DALL-E services initialized successfully');
            } else {
                logger.warn('OpenAI API key not found - DALL-E services unavailable');
            }
            
            // Future: Initialize other providers
            // - Stable Diffusion
            // - Midjourney
            // - Custom Iraqi models
            
        } catch (error) {
            logger.error('Failed to initialize image services', error);
        }
    }
    
    /**
     * Get image service for specified provider
     * @param {string} provider - Provider identifier
     * @returns {Object} Image service instance
     */
    getService(provider) {
        if (!provider) {
            provider = this.config.defaultProvider;
        }
        
        const service = this.services.get(provider);
        
        if (!service) {
            throw new Error(`Unsupported image provider: ${provider}`);
        }
        
        return service;
    }
    
    /**
     * Generate images with automatic provider selection and fallback
     * @param {Object} params - Generation parameters
     * @returns {Promise<Array>} Generated images
     */
    async generateImages(params) {
        const { provider = this.config.defaultProvider, ...otherParams } = params;
        
        let lastError = null;
        const providersToTry = [provider, ...this.config.fallbackProviders]
            .filter((p, index, arr) => arr.indexOf(p) === index); // Remove duplicates
        
        for (const currentProvider of providersToTry) {
            try {
                logger.info(`Attempting image generation with provider: ${currentProvider}`);
                
                const service = this.getService(currentProvider);
                const result = await service.generateImages({
                    ...otherParams,
                    provider: currentProvider
                });
                
                logger.info(`Successfully generated ${result.length} images with ${currentProvider}`);
                return result;
                
            } catch (error) {
                logger.warn(`Provider ${currentProvider} failed: ${error.message}`);
                lastError = error;
                
                // Don't retry on validation errors
                if (error.message.includes('Cultural validation failed') || 
                    error.message.includes('content_policy_violation')) {
                    throw error;
                }
                
                continue;
            }
        }
        
        throw new Error(`All image providers failed. Last error: ${lastError?.message}`);
    }
    
    /**
     * Edit images with provider-specific handling
     * @param {Object} params - Edit parameters
     * @returns {Promise<Array>} Edited images
     */
    async editImages(params) {
        const { provider = 'dall-e-2', ...otherParams } = params;
        
        try {
            // Editing is currently only supported by DALL-E 2
            if (provider !== 'dall-e-2' && provider !== 'openai-image-tools') {
                logger.info(`Provider ${provider} doesn't support editing, falling back to DALL-E 2`);
                params.provider = 'dall-e-2';
            }
            
            const service = this.getService('dall-e-2');
            return await service.editImages({
                ...otherParams,
                provider: 'dall-e-2'
            });
            
        } catch (error) {
            logger.error(`Image editing failed: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Create image variations
     * @param {Object} params - Variation parameters
     * @returns {Promise<Array>} Image variations
     */
    async createVariations(params) {
        const { provider = 'dall-e-2', ...otherParams } = params;
        
        try {
            // Variations are currently only supported by DALL-E 2
            if (provider !== 'dall-e-2') {
                logger.info(`Provider ${provider} doesn't support variations, falling back to DALL-E 2`);
                params.provider = 'dall-e-2';
            }
            
            const service = this.getService('dall-e-2');
            return await service.createVariations({
                ...otherParams,
                provider: 'dall-e-2'
            });
            
        } catch (error) {
            logger.error(`Image variations failed: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Get available models from all providers
     * @returns {Promise<Object>} Models by provider
     */
    async getAvailableModels() {
        const allModels = {};
        
        for (const [providerId, service] of this.services) {
            try {
                const models = await service.getAvailableModels();
                allModels[providerId] = models;
            } catch (error) {
                logger.warn(`Failed to get models for provider ${providerId}: ${error.message}`);
                allModels[providerId] = [];
            }
        }
        
        return allModels;
    }
    
    /**
     * Health check for all services
     * @returns {Promise<Object>} Health status by provider
     */
    async healthCheck() {
        const healthStatus = {};
        
        for (const [providerId, service] of this.services) {
            try {
                const status = await service.healthCheck();
                healthStatus[providerId] = status;
            } catch (error) {
                healthStatus[providerId] = `Error: ${error.message}`;
            }
        }
        
        return healthStatus;
    }
    
    /**
     * Get factory configuration
     * @returns {Object} Factory configuration
     */
    getConfig() {
        return {
            ...this.config,
            availableProviders: Array.from(this.services.keys()),
            serviceConfigs: Object.fromEntries(
                Array.from(this.services.entries()).map(([id, service]) => [
                    id, 
                    service.getConfig ? service.getConfig() : { name: id }
                ])
            )
        };
    }
    
    /**
     * Update factory configuration
     * @param {Object} newConfig - New configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        logger.info('Image Service Factory configuration updated', newConfig);
    }
    
    /**
     * Add a new image service provider
     * @param {string} providerId - Provider identifier
     * @param {Object} service - Service instance
     */
    addService(providerId, service) {
        this.services.set(providerId, service);
        logger.info(`Added new image service: ${providerId}`);
    }
    
    /**
     * Remove an image service provider
     * @param {string} providerId - Provider identifier
     */
    removeService(providerId) {
        if (this.services.delete(providerId)) {
            logger.info(`Removed image service: ${providerId}`);
        } else {
            logger.warn(`Image service not found: ${providerId}`);
        }
    }
    
    /**
     * Get usage statistics
     * @returns {Object} Usage statistics
     */
    getUsageStats() {
        // This would typically be implemented with proper metrics collection
        return {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            providerUsage: {},
            averageResponseTime: 0,
            culturalValidationRate: 0.95
        };
    }
}

// Singleton instance
let factoryInstance = null;

/**
 * Get singleton instance of Image Service Factory
 * @returns {ImageServiceFactory} Factory instance
 */
function getInstance() {
    if (!factoryInstance) {
        factoryInstance = new ImageServiceFactory();
    }
    return factoryInstance;
}

module.exports = {
    ImageServiceFactory: getInstance(),
    createImageServiceFactory: () => new ImageServiceFactory()
};