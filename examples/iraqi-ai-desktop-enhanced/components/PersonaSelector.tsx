import React, { useState, useEffect } from 'react';
import type { Persona, PersonaTraits } from '../src/types/persona'; // Import shared types
import { iraqiDesktop } from '../../src/preload'; // Access via preload API

/* Persona Management Component with Cultural Validation
   Adapted for Iraqi cultural compliance based on verified UI/UX and cultural knowledge base.
   Integrates RTL, Arabic typography, validation indicators, and professional themes.
   WCAG 2.1 AA compliant with Arabic screen reader support.
   Now uses IPC for dynamic loading/saving via IraqiPersonaManagementService + offline sync. */

const PersonaSelector: React.FC = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('legal'); // Professional theme
  const [securityLevel, setSecurityLevel] = useState<string>('general');

  // Load personas on mount via IPC (service + offline fallback)
  useEffect(() => {
    const loadPersonas = async () => {
      try {
        setLoading(true);
        const loadedPersonas = await iraqiDesktop.personas.loadAllPersonas();
        setPersonas(loadedPersonas);
      } catch (error) {
        console.error('Failed to load personas:', error);
        setValidationError('فشل في تحميل الشخصيات. جاري المحاولة مرة أخرى...');
      } finally {
        setLoading(false);
      }
    };

    loadPersonas();

    // Listen for cultural validation failures (resend logic)
    const handleValidationFailed = (event: CustomEvent<{ score: number; message: string }>) => {
      setValidationError(`فشل التحقق الثقافي (درجة: ${event.detail.score}%). يرجى إعادة المحاولة.`);
      // Auto-resend logic: Retry after 2s if score >70 (partial compliance)
      if (event.detail.score > 70) {
        setTimeout(() => {
          // Trigger resend via IPC (e.g., re-apply selected persona)
          if (selectedPersona) applyPersona(selectedPersona);
          setValidationError(null);
        }, 2000);
      }
    };

    window.addEventListener('cultural-validation-failed', handleValidationFailed as any);
    return () => window.removeEventListener('cultural-validation-failed', handleValidationFailed as any);
  }, []);

  const applyPersona = async (personaId: string) => {
    try {
      setValidationError(null);
      const persona = await iraqiDesktop.personas.loadPersona(personaId);
      if (!persona) throw new Error('Persona not found');

      // Evaluate traits and apply memory
      const traits: PersonaTraits[] = []; // Derive from persona or user input
      const evalResult = await iraqiDesktop.personas.evaluateTraits(personaId, traits);
      if (evalResult.culturalScore < 85) {
        // Will trigger event in main, handled above
        throw new Error('Validation failed');
      }

      await iraqiDesktop.personas.applyMemory(personaId, { /* app context */ });
      setSelectedPersona(personaId);

      // Save selection (caches offline if needed)
      await iraqiDesktop.personas.createPersona({ ...persona, lastUsed: new Date() } as any); // Update with usage
      console.log(`Applied persona: ${persona.name} - Cultural validation passed`);
    } catch (error) {
      console.error('Failed to apply persona:', error);
      setValidationError((error as Error).message);
    }
  };

  const handlePersonaSelect = (personaId: string) => {
    applyPersona(personaId);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
    document.body.className = `theme-${e.target.value}`; // Apply theme
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecurityLevel(e.target.value);
    // Trigger security clearance logic via IPC if needed
  };

  if (loading) {
    return (
      <div className="persona-selector iraqi-container" lang="ar" dir="rtl">
        <div className="loading" role="status" aria-live="polite">
          <span className="sr-only">جاري تحميل الشخصيات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="persona-selector iraqi-container" lang="ar" dir="rtl">
      <h2 className="arabic-h1">إدارة الشخصيات الذكاء الاصطناعي</h2>
      
      {validationError && (
        <div className="validation-error" role="alert" aria-live="assertive">
          <span className="arabic-body">{validationError}</span>
        </div>
      )}
      
      <ul className="persona-list" role="list">
        {personas.map((persona) => (
          <li key={persona.id} className="interactive-element" 
              onClick={() => handlePersonaSelect(persona.id)}
              tabIndex={0}
              role="button"
              aria-label={`${persona.name} - ${persona.description}`}
              aria-pressed={selectedPersona === persona.id}>
            <div className="persona-item">
              <span className="arabic-body">{persona.name} ({persona.englishName})</span>
              <p className="arabic-body">{persona.description}</p>
              <span className="arabic-body">
                دعم اللهجة العراقية: {persona.dialectSupport ? 'نعم' : 'لا'}
              </span>
              <div 
                className={`validation-indicator validation-${persona.culturalValidation}`}
                aria-label={`التوافق الثقافي: ${persona.culturalValidation === 'pass' ? 'ناجح' : persona.culturalValidation === 'warning' ? 'تحذير' : 'فاشل'}`}
                title="مؤشر التوافق الثقافي"
              ></div>
            </div>
          </li>
        ))}
      </ul>

      {/* Professional Themes Selector (unchanged) */}
      <section className="theme-section">
        <label htmlFor="theme-select" className="arabic-body sr-only">اختر سمة المنظمة المهنية</label>
        <select 
          id="theme-select"
          className="iraqi-select"
          value={theme}
          onChange={handleThemeChange}
          aria-required="true"
        >
          <option value="legal">القانونية</option>
          <option value="medical">الطبية</option>
          <option value="educational">التعليمية</option>
          <option value="engineering">الهندسية</option>
        </select>
      </section>

      {/* Security Clearance Selector (unchanged) */}
      <section className="security-section">
        <label htmlFor="security-select" className="arabic-body sr-only">اختر مستوى التصريح الأمني</label>
        <select 
          id="security-select"
          className="iraqi-select"
          value={securityLevel}
          onChange={handleSecurityChange}
          aria-required="true"
        >
          <option value="general">عام</option>
          <option value="restricted">محدود</option>
          <option value="secret">سري</option>
        </select>
      </section>

      {selectedPersona && (
        <div className="selection-feedback loading" role="status" aria-live="polite">
          <span className="sr-only">تم اختيار الشخصية بنجاح. جاري التحقق الثقافي...</span>
          <span className="arabic-body">الشخصية المختارة: {personas.find(p => p.id === selectedPersona)?.name}</span>
        </div>
      )}
      
      <style jsx>{`
        .persona-selector {
          padding: var(--spacing-md);
        }
        
        .persona-list {
          list-style: none;
          padding: 0;
          display: grid;
          gap: var(--spacing-md);
        }
        
        .persona-item {
          padding: var(--spacing-md);
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius);
          background-color: #ffffff;
          direction: rtl;
          text-align: right;
        }
        
        .theme-section, .security-section {
          margin-top: var(--spacing-lg);
          padding: var(--spacing-md);
          border: 1px solid #e2e8f0;
          border-radius: var(--border-radius);
        }

        .validation-error {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        @media (max-width: 640px) {
          .persona-item {
            padding: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  );
};

export default PersonaSelector;
