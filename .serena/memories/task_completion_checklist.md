# Task Completion Checklist for Iraqi AI Project

## After Completing Any Task

### Code Quality
- [ ] Run `npm run typecheck` - TypeScript compilation check
- [ ] Run `npm run lint` - Code style validation  
- [ ] Run `npm run test` - All tests pass (unit, integration, cultural)

### PydanticAI Specific
- [ ] Environment setup with .env file and load_dotenv()
- [ ] Agent testing with TestModel/FunctionModel
- [ ] API key security validation (no hardcoded keys)
- [ ] Iraqi cultural context validation

### Cultural Requirements
- [ ] Arabic text handling (RTL direction)
- [ ] Iraqi dialect vocabulary support
- [ ] Cultural sensitivity validation
- [ ] Professional context appropriateness

### Documentation
- [ ] Update relevant documentation if architecture changes
- [ ] Comment Iraqi-specific logic and cultural adaptations
- [ ] Maintain bilingual documentation (Arabic/English) for user-facing content

### Integration Testing
- [ ] Cross-platform compatibility (web/mobile ready)
- [ ] Payment gateway integration (if applicable)
- [ ] Privacy compliance (session-only data, auto-expire)

### Final Validation
- [ ] All features work in both Arabic and English modes
- [ ] Professional context maintains Iraqi domain expertise
- [ ] No security vulnerabilities introduced