/**
 * DALL-E 3 Integration Service
 * Extracted and enhanced from LibreChat for Iraqi AI Chat System
 * 
 * Features:
 * - DALL-E 2 and DALL-E 3 support
 * - Arabic prompt optimization
 * - Cultural compliance integration
 * - Professional domain context
 * - Error handling and retry logic
 */

const OpenAI = require('openai');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// Iraqi cultural validation
const { IraqiCulturalValidator } = require('../agents/cultural-validator');
const { ArabicPromptOptimizer } = require('../utils/arabic-prompt-optimizer');

class DALLEService {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
        this.baseURL = config.baseURL || 'https://api.openai.com/v1';
        this.timeout = config.timeout || 120000; // 2 minutes
        
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required for DALL-E service');
        }
        
        // Initialize OpenAI client
        this.openai = new OpenAI({
            apiKey: this.apiKey,
            baseURL: this.baseURL,
            timeout: this.timeout,
        });
        
        // Iraqi AI integration
        this.culturalValidator = new IraqiCulturalValidator();
        this.promptOptimizer = new ArabicPromptOptimizer();
        
        // Supported models
        this.supportedModels = {
            'dall-e-2': {
                name: 'DALL-E 2',
                sizes: ['256x256', '512x512', '1024x1024'],
                maxImages: 10,
                features: ['generation', 'editing', 'variations']
            },
            'dall-e-3': {
                name: 'DALL-E 3',
                sizes: ['1024x1024', '1792x1024', '1024x1792'],
                maxImages: 1,
                features: ['generation'],
                quality: ['standard', 'hd'],
                style: ['vivid', 'natural']
            }
        };
        
        logger.info('DALL-E service initialized successfully');
    }
    
    /**
     * Generate images using DALL-E
     * @param {Object} params - Generation parameters
     * @returns {Promise<Array>} Generated images
     */
    async generateImages(params) {
        const {
            prompt,
            model = 'dall-e-3',
            size = '1024x1024',
            quality = 'standard',
            style = 'vivid',
            n = 1,
            user_id,
            professional_domain = 'general',
            cultural_validation = true,
            response_format = 'b64_json'
        } = params;
        
        try {
            logger.info(`Starting DALL-E generation for user ${user_id} with model ${model}`);
            
            // Validate model support
            if (!this.supportedModels[model]) {
                throw new Error(`Unsupported model: ${model}`);
            }
            
            const modelConfig = this.supportedModels[model];
            
            // Validate parameters
            if (!modelConfig.sizes.includes(size)) {
                throw new Error(`Unsupported size ${size} for model ${model}`);
            }
            
            if (n > modelConfig.maxImages) {
                throw new Error(`Model ${model} supports maximum ${modelConfig.maxImages} images per request`);
            }
            
            // Phase 1: Cultural Validation (if enabled)
            let validatedPrompt = prompt;
            let culturalScore = 1.0;
            
            if (cultural_validation) {
                logger.info('Performing cultural validation for prompt');
                
                const validation = await this.culturalValidator.validatePrompt({
                    prompt,
                    domain: professional_domain,
                    islamicCompliance: true,
                    userId: user_id
                });
                
                if (!validation.isValid) {
                    throw new Error(`Cultural validation failed: ${validation.reason}`);
                }
                
                culturalScore = validation.culturalScore;
                
                // Use optimized prompt if available
                if (validation.optimizedPrompt) {
                    validatedPrompt = validation.optimizedPrompt;
                    logger.info('Using culturally optimized prompt');
                }
            }
            
            // Phase 2: Arabic Prompt Optimization
            const optimizedPrompt = await this.promptOptimizer.optimizePrompt({
                prompt: validatedPrompt,
                targetModel: model,
                professionalDomain: professional_domain,
                culturalContext: 'iraqi'
            });
            
            // Phase 3: Prepare OpenAI request
            const dalleRequest = {
                model,
                prompt: optimizedPrompt.enhancedPrompt,
                size,
                n: model === 'dall-e-3' ? 1 : n, // DALL-E 3 only supports n=1
                response_format,
                user: user_id
            };
            
            // Add DALL-E 3 specific parameters
            if (model === 'dall-e-3') {
                if (modelConfig.quality && modelConfig.quality.includes(quality)) {
                    dalleRequest.quality = quality;
                }
                if (modelConfig.style && modelConfig.style.includes(style)) {
                    dalleRequest.style = style;
                }
            }
            
            logger.info('Sending request to OpenAI DALL-E API', {
                model,
                size,
                n: dalleRequest.n,
                user: user_id
            });
            
            // Phase 4: Generate with OpenAI
            const startTime = Date.now();
            const response = await this.openai.images.generate(dalleRequest);
            const generationTime = (Date.now() - startTime) / 1000;
            
            logger.info(`DALL-E generation completed in ${generationTime}s`, {
                imagesGenerated: response.data.length,
                model,
                user: user_id
            });
            
            // Phase 5: Process results
            const processedImages = [];
            
            for (const imageData of response.data) {
                // Handle multiple generations for DALL-E 2
                if (model === 'dall-e-2' && n > 1) {
                    // Generate additional images if needed
                    const additionalRequests = [];
                    for (let i = 1; i < n; i++) {
                        additionalRequests.push(
                            this.openai.images.generate({
                                ...dalleRequest,
                                n: 1
                            })
                        );
                    }
                    
                    if (additionalRequests.length > 0) {
                        const additionalResponses = await Promise.all(additionalRequests);
                        for (const additionalResponse of additionalResponses) {
                            processedImages.push({
                                id: uuidv4(),
                                data: additionalResponse.data[0].b64_json,
                                url: additionalResponse.data[0].url,
                                revised_prompt: additionalResponse.data[0].revised_prompt,
                                format: 'png',
                                model,
                                size,
                                generation_time: generationTime,
                                cultural_score: culturalScore,
                                original_prompt: prompt,
                                optimized_prompt: optimizedPrompt.enhancedPrompt,
                                professional_domain,
                                created_at: new Date().toISOString()
                            });
                        }
                    }
                }
                
                // Add primary image
                processedImages.push({
                    id: uuidv4(),
                    data: imageData.b64_json,
                    url: imageData.url,
                    revised_prompt: imageData.revised_prompt,
                    format: 'png',
                    model,
                    size,
                    generation_time: generationTime,
                    cultural_score: culturalScore,
                    original_prompt: prompt,
                    optimized_prompt: optimizedPrompt.enhancedPrompt,
                    professional_domain,
                    created_at: new Date().toISOString()
                });
            }
            
            // Phase 6: Post-generation cultural validation (if enabled)
            if (cultural_validation) {
                logger.info('Performing post-generation cultural validation');
                
                const validatedImages = [];
                for (const image of processedImages) {
                    const imageValidation = await this.culturalValidator.validateGeneratedImage({
                        imageData: image.data,
                        originalPrompt: prompt,
                        domain: professional_domain,
                        userId: user_id
                    });
                    
                    if (imageValidation.isValid) {
                        image.cultural_validation = imageValidation;
                        validatedImages.push(image);
                    } else {
                        logger.warn(`Generated image failed validation: ${imageValidation.reason}`, {
                            imageId: image.id,
                            user: user_id
                        });
                    }
                }
                
                if (validatedImages.length === 0) {
                    throw new Error('All generated images failed cultural validation');
                }
                
                logger.info(`${validatedImages.length}/${processedImages.length} images passed cultural validation`);
                return validatedImages;
            }
            
            return processedImages;
            
        } catch (error) {
            logger.error('DALL-E generation failed', {
                error: error.message,
                user: user_id,
                model,
                prompt: prompt?.substring(0, 100)
            });
            
            // Handle specific OpenAI errors
            if (error.response?.data?.error) {
                const openaiError = error.response.data.error;
                
                if (openaiError.code === 'content_policy_violation') {
                    throw new Error('Content policy violation: Please modify your prompt to comply with usage guidelines');
                }
                
                if (openaiError.code === 'rate_limit_exceeded') {
                    throw new Error('Rate limit exceeded: Please try again later');
                }
                
                if (openaiError.code === 'billing_hard_limit_reached') {
                    throw new Error('Service temporarily unavailable: Billing limit reached');
                }
                
                throw new Error(`OpenAI API error: ${openaiError.message}`);
            }
            
            throw error;
        }
    }
    
    /**
     * Edit images using DALL-E 2
     * @param {Object} params - Edit parameters
     * @returns {Promise<Array>} Edited images
     */
    async editImages(params) {
        const {
            image_data,
            mask_data,
            instruction,
            model = 'dall-e-2',
            size = '1024x1024',
            n = 1,
            user_id,
            professional_domain = 'general',
            cultural_validation = true,
            response_format = 'b64_json'
        } = params;
        
        try {
            logger.info(`Starting DALL-E image editing for user ${user_id}`);
            
            // Only DALL-E 2 supports editing
            if (model !== 'dall-e-2') {
                throw new Error('Image editing is only supported by DALL-E 2');
            }
            
            // Phase 1: Validate inputs
            if (cultural_validation) {
                // Validate original image
                const imageValidation = await this.culturalValidator.validateImageContent({
                    imageData: image_data,
                    domain: professional_domain,
                    userId: user_id
                });
                
                if (!imageValidation.isValid) {
                    throw new Error(`Original image validation failed: ${imageValidation.reason}`);
                }
                
                // Validate edit instruction
                const instructionValidation = await this.culturalValidator.validatePrompt({
                    prompt: instruction,
                    domain: professional_domain,
                    islamicCompliance: true,
                    userId: user_id
                });
                
                if (!instructionValidation.isValid) {
                    throw new Error(`Edit instruction validation failed: ${instructionValidation.reason}`);
                }
            }
            
            // Phase 2: Optimize edit instruction
            const optimizedInstruction = await this.promptOptimizer.optimizePrompt({
                prompt: instruction,
                targetModel: model,
                professionalDomain: professional_domain,
                culturalContext: 'iraqi',
                isEditInstruction: true
            });
            
            // Phase 3: Convert base64 to buffer for OpenAI
            const imageBuffer = Buffer.from(image_data, 'base64');
            const maskBuffer = mask_data ? Buffer.from(mask_data, 'base64') : null;
            
            // Phase 4: Edit with OpenAI
            const startTime = Date.now();
            
            const editRequest = {
                model,
                image: imageBuffer,
                prompt: optimizedInstruction.enhancedPrompt,
                size,
                n,
                response_format,
                user: user_id
            };
            
            if (maskBuffer) {
                editRequest.mask = maskBuffer;
            }
            
            const response = await this.openai.images.edit(editRequest);
            const editTime = (Date.now() - startTime) / 1000;
            
            logger.info(`DALL-E editing completed in ${editTime}s`, {
                imagesEdited: response.data.length,
                user: user_id
            });
            
            // Phase 5: Process edited results
            const editedImages = response.data.map(imageData => ({
                id: uuidv4(),
                data: imageData.b64_json,
                url: imageData.url,
                format: 'png',
                model,
                size,
                edit_time: editTime,
                original_instruction: instruction,
                optimized_instruction: optimizedInstruction.enhancedPrompt,
                professional_domain,
                operation: 'edit',
                created_at: new Date().toISOString()
            }));
            
            // Phase 6: Post-edit cultural validation
            if (cultural_validation) {
                const validatedEdits = [];
                
                for (const image of editedImages) {
                    const validation = await this.culturalValidator.validateGeneratedImage({
                        imageData: image.data,
                        originalPrompt: instruction,
                        domain: professional_domain,
                        userId: user_id,
                        operation: 'edit'
                    });
                    
                    if (validation.isValid) {
                        image.cultural_validation = validation;
                        validatedEdits.push(image);
                    } else {
                        logger.warn(`Edited image failed validation: ${validation.reason}`, {
                            imageId: image.id,
                            user: user_id
                        });
                    }
                }
                
                if (validatedEdits.length === 0) {
                    throw new Error('All edited images failed cultural validation');
                }
                
                return validatedEdits;
            }
            
            return editedImages;
            
        } catch (error) {
            logger.error('DALL-E editing failed', {
                error: error.message,
                user: user_id,
                instruction: instruction?.substring(0, 100)
            });
            
            throw error;
        }
    }
    
    /**
     * Create image variations using DALL-E 2
     * @param {Object} params - Variation parameters
     * @returns {Promise<Array>} Image variations
     */
    async createVariations(params) {
        const {
            image_data,
            model = 'dall-e-2',
            size = '1024x1024',
            n = 1,
            user_id,
            professional_domain = 'general',
            cultural_validation = true,
            response_format = 'b64_json'
        } = params;
        
        try {
            logger.info(`Creating DALL-E variations for user ${user_id}`);
            
            // Only DALL-E 2 supports variations
            if (model !== 'dall-e-2') {
                throw new Error('Image variations are only supported by DALL-E 2');
            }
            
            // Phase 1: Validate original image
            if (cultural_validation) {
                const imageValidation = await this.culturalValidator.validateImageContent({
                    imageData: image_data,
                    domain: professional_domain,
                    userId: user_id
                });
                
                if (!imageValidation.isValid) {
                    throw new Error(`Original image validation failed: ${imageValidation.reason}`);
                }
            }
            
            // Phase 2: Create variations
            const imageBuffer = Buffer.from(image_data, 'base64');
            
            const startTime = Date.now();
            const response = await this.openai.images.createVariation({
                model,
                image: imageBuffer,
                size,
                n,
                response_format,
                user: user_id
            });
            const variationTime = (Date.now() - startTime) / 1000;
            
            // Phase 3: Process variations
            const variations = response.data.map(imageData => ({
                id: uuidv4(),
                data: imageData.b64_json,
                url: imageData.url,
                format: 'png',
                model,
                size,
                variation_time: variationTime,
                professional_domain,
                operation: 'variation',
                created_at: new Date().toISOString()
            }));
            
            // Phase 4: Cultural validation for variations
            if (cultural_validation) {
                const validatedVariations = [];
                
                for (const variation of variations) {
                    const validation = await this.culturalValidator.validateGeneratedImage({
                        imageData: variation.data,
                        domain: professional_domain,
                        userId: user_id,
                        operation: 'variation'
                    });
                    
                    if (validation.isValid) {
                        variation.cultural_validation = validation;
                        validatedVariations.push(variation);
                    }
                }
                
                return validatedVariations;
            }
            
            return variations;
            
        } catch (error) {
            logger.error('DALL-E variations failed', {
                error: error.message,
                user: user_id
            });
            
            throw error;
        }
    }
    
    /**
     * Get available models and their capabilities
     * @returns {Promise<Array>} Available models
     */
    async getAvailableModels() {
        return Object.entries(this.supportedModels).map(([id, config]) => ({
            id,
            name: config.name,
            sizes: config.sizes,
            maxImages: config.maxImages,
            features: config.features,
            quality: config.quality || null,
            style: config.style || null
        }));
    }
    
    /**
     * Health check for DALL-E service
     * @returns {Promise<string>} Health status
     */
    async healthCheck() {
        try {
            // Test with minimal request to verify API connectivity
            await this.openai.models.retrieve('dall-e-2');
            return 'healthy';
        } catch (error) {
            logger.error('DALL-E health check failed', error);
            return `unhealthy: ${error.message}`;
        }
    }
    
    /**
     * Get service configuration
     * @returns {Object} Service configuration
     */
    getConfig() {
        return {
            name: 'DALL-E Service',
            version: '1.0.0',
            provider: 'OpenAI',
            supportedModels: Object.keys(this.supportedModels),
            features: ['generation', 'editing', 'variations'],
            culturalValidation: true,
            arabicSupport: true,
            professionalDomains: [
                'legal', 'medical', 'educational', 'business', 'engineering', 'general'
            ]
        };
    }
}

module.exports = { DALLEService };