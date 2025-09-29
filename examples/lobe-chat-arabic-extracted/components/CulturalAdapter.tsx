'use client';

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { useRTL } from './RTLProvider';
import { ArabicFont } from './ArabicFont';

// Cultural Context Types
export interface IraqiCulturalContext {
  islamicCompliance: {
    level: 'strict' | 'moderate' | 'flexible';
    prayerTimeAwareness: boolean;
    halalContentOnly: boolean;
    ramadanMode: boolean;
    islamicGreetings: boolean;
  };
  professionalStandards: {
    formalLanguage: boolean;
    titleRespect: boolean;
    hierarchyAwareness: boolean;
    governmentProtocol: boolean;
  };
  culturalSensitivity: {
    familyValues: boolean;
    tribalRespect: boolean;
    genderSeparation: boolean;
    elderlyRespect: boolean;
    hospitalityTraditions: boolean;
  };
  linguisticPreferences: {
    dialectMixing: boolean;
    classicalArabic: boolean;
    englishCode: boolean;
    technicalTerms: 'arabic' | 'english' | 'mixed';
  };
}

// Prayer Times Interface
interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Cultural Adaptation Props
interface CulturalAdapterProps {
  children: ReactNode;
  context: Partial<IraqiCulturalContext>;
  location?: {
    city: string;
    governorate: string;
    timezone: string;
  };
  onContextChange?: (context: IraqiCulturalContext) => void;
  className?: string;
}

// Default Cultural Context
const defaultCulturalContext: IraqiCulturalContext = {
  islamicCompliance: {
    level: 'moderate',
    prayerTimeAwareness: true,
    halalContentOnly: true,
    ramadanMode: false,
    islamicGreetings: true,
  },
  professionalStandards: {
    formalLanguage: true,
    titleRespect: true,
    hierarchyAwareness: true,
    governmentProtocol: true,
  },
  culturalSensitivity: {
    familyValues: true,
    tribalRespect: true,
    genderSeparation: false,
    elderlyRespect: true,
    hospitalityTraditions: true,
  },
  linguisticPreferences: {
    dialectMixing: true,
    classicalArabic: false,
    englishCode: true,
    technicalTerms: 'mixed',
  },
};

// Prayer Times Hook
const usePrayerTimes = (city: string = 'Baghdad') => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);

  useEffect(() => {
    // Simplified prayer times calculation (in real app, use API)
    const calculatePrayerTimes = () => {
      const now = new Date();
      const times: PrayerTimes = {
        fajr: '05:30',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:15',
        isha: '19:45',
      };

      setPrayerTimes(times);

      // Calculate next prayer
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const prayerMinutes = {
        fajr: 5 * 60 + 30,
        dhuhr: 12 * 60 + 30,
        asr: 15 * 60 + 45,
        maghrib: 18 * 60 + 15,
        isha: 19 * 60 + 45,
      };

      for (const [prayer, minutes] of Object.entries(prayerMinutes)) {
        if (currentTime < minutes) {
          setNextPrayer(prayer);
          break;
        }
      }

      if (!nextPrayer && currentTime > prayerMinutes.isha) {
        setNextPrayer('fajr');
      }
    };

    calculatePrayerTimes();
    const interval = setInterval(calculatePrayerTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [city, nextPrayer]);

  return { prayerTimes, nextPrayer };
};

// Islamic Calendar Hook
const useIslamicCalendar = () => {
  const [isRamadan, setIsRamadan] = useState(false);
  const [islamicDate, setIslamicDate] = useState<string>('');

  useEffect(() => {
    // Simplified Islamic date calculation (in real app, use proper Islamic calendar API)
    const checkIslamicDates = () => {
      const now = new Date();
      const ramadanStart = new Date('2025-02-28'); // Example date
      const ramadanEnd = new Date('2025-03-29'); // Example date

      setIsRamadan(now >= ramadanStart && now <= ramadanEnd);
      setIslamicDate('15 Rajab 1446'); // Example Islamic date
    };

    checkIslamicDates();
    const interval = setInterval(checkIslamicDates, 86400000); // Check daily

    return () => clearInterval(interval);
  }, []);

  return { isRamadan, islamicDate };
};

// Cultural Context Provider
export const CulturalAdapter: React.FC<CulturalAdapterProps> = ({
  children,
  context: initialContext,
  location = { city: 'Baghdad', governorate: 'Baghdad', timezone: 'Asia/Baghdad' },
  onContextChange,
  className = '',
}) => {
  const { config } = useRTL();
  const { prayerTimes, nextPrayer } = usePrayerTimes(location.city);
  const { isRamadan, islamicDate } = useIslamicCalendar();

  // Merge with default context
  const [culturalContext, setCulturalContext] = useState<IraqiCulturalContext>(() => ({
    ...defaultCulturalContext,
    ...initialContext,
    islamicCompliance: {
      ...defaultCulturalContext.islamicCompliance,
      ...initialContext.islamicCompliance,
      ramadanMode: isRamadan,
    },
  }));

  // Update context when Ramadan status changes
  useEffect(() => {
    setCulturalContext((prev) => ({
      ...prev,
      islamicCompliance: {
        ...prev.islamicCompliance,
        ramadanMode: isRamadan,
      },
    }));
  }, [isRamadan]);

  // Notify parent of context changes
  useEffect(() => {
    onContextChange?.(culturalContext);
  }, [culturalContext, onContextChange]);

  // Generate cultural CSS classes
  const getCulturalClasses = useCallback((): string => {
    const classes = [className];

    // Islamic compliance classes
    classes.push(`islamic-${culturalContext.islamicCompliance.level}`);

    if (culturalContext.islamicCompliance.ramadanMode) {
      classes.push('ramadan-mode');
    }

    if (culturalContext.islamicCompliance.halalContentOnly) {
      classes.push('halal-only');
    }

    // Professional standards classes
    if (culturalContext.professionalStandards.formalLanguage) {
      classes.push('formal-language');
    }

    if (culturalContext.professionalStandards.governmentProtocol) {
      classes.push('government-protocol');
    }

    // Cultural sensitivity classes
    if (culturalContext.culturalSensitivity.familyValues) {
      classes.push('family-values');
    }

    if (culturalContext.culturalSensitivity.elderlyRespect) {
      classes.push('elderly-respect');
    }

    // Location-specific classes
    classes.push(`city-${location.city.toLowerCase()}`);
    classes.push(`governorate-${location.governorate.toLowerCase()}`);

    // Prayer time awareness
    if (nextPrayer && culturalContext.islamicCompliance.prayerTimeAwareness) {
      classes.push(`next-prayer-${nextPrayer}`);
    }

    return classes.filter(Boolean).join(' ');
  }, [culturalContext, location, nextPrayer, className]);

  return (
    <div className={`cultural-adapter ${getCulturalClasses()}`}>
      {/* Prayer Time Indicator */}
      {culturalContext.islamicCompliance.prayerTimeAwareness && prayerTimes && (
        <PrayerTimeIndicator
          times={prayerTimes}
          nextPrayer={nextPrayer}
          showReminder={culturalContext.islamicCompliance.level !== 'flexible'}
        />
      )}

      {/* Ramadan Mode Indicator */}
      {culturalContext.islamicCompliance.ramadanMode && (
        <RamadanModeIndicator islamicDate={islamicDate} />
      )}

      {/* Cultural Context Provider */}
      <CulturalContextProvider value={culturalContext}>{children}</CulturalContextProvider>
    </div>
  );
};

// Prayer Time Indicator Component
interface PrayerTimeIndicatorProps {
  times: PrayerTimes;
  nextPrayer: string | null;
  showReminder: boolean;
}

const PrayerTimeIndicator: React.FC<PrayerTimeIndicatorProps> = ({
  times,
  nextPrayer,
  showReminder,
}) => {
  const [timeUntilPrayer, setTimeUntilPrayer] = useState<string>('');

  useEffect(() => {
    if (!nextPrayer) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const [hours, minutes] = times[nextPrayer as keyof PrayerTimes].split(':').map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      if (prayerTime <= now) {
        prayerTime.setDate(prayerTime.getDate() + 1);
      }

      const diff = prayerTime.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilPrayer(`${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000);

    return () => clearInterval(interval);
  }, [nextPrayer, times]);

  if (!showReminder || !nextPrayer) return null;

  const prayerNames = {
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
  };

  return (
    <div className="prayer-time-indicator">
      <ArabicFont size="sm" cultural="religious" className="prayer-reminder">
        الصلاة القادمة: {prayerNames[nextPrayer as keyof typeof prayerNames]} - {timeUntilPrayer}
      </ArabicFont>
    </div>
  );
};

// Ramadan Mode Indicator Component
interface RamadanModeIndicatorProps {
  islamicDate: string;
}

const RamadanModeIndicator: React.FC<RamadanModeIndicatorProps> = ({ islamicDate }) => {
  return (
    <div className="ramadan-mode-indicator">
      <ArabicFont size="sm" cultural="religious" className="ramadan-greeting">
        رمضان مبارك - {islamicDate}
      </ArabicFont>
    </div>
  );
};

// Cultural Context Hook
const CulturalContext = React.createContext<IraqiCulturalContext | undefined>(undefined);

const CulturalContextProvider: React.FC<{ children: ReactNode; value: IraqiCulturalContext }> = ({
  children,
  value,
}) => <CulturalContext.Provider value={value}>{children}</CulturalContext.Provider>;

export const useCulturalContext = (): IraqiCulturalContext => {
  const context = React.useContext(CulturalContext);
  if (!context) {
    throw new Error('useCulturalContext must be used within a CulturalAdapter');
  }
  return context;
};

// Cultural Greeting Component
interface CulturalGreetingProps {
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  formal?: boolean;
  includeIslamic?: boolean;
}

export const CulturalGreeting: React.FC<CulturalGreetingProps> = ({
  timeOfDay,
  formal = true,
  includeIslamic = true,
}) => {
  const { islamicCompliance, professionalStandards } = useCulturalContext();
  const { isArabic } = useRTL();

  const getGreeting = (): string => {
    if (includeIslamic && islamicCompliance.islamicGreetings) {
      return 'السلام عليكم ورحمة الله وبركاته';
    }

    if (!timeOfDay) {
      const hour = new Date().getHours();
      if (hour < 12) timeOfDay = 'morning';
      else if (hour < 17) timeOfDay = 'afternoon';
      else if (hour < 21) timeOfDay = 'evening';
      else timeOfDay = 'night';
    }

    const greetings = {
      morning: formal ? 'صباح الخير' : 'صباح النور',
      afternoon: formal ? 'مساء الخير' : 'أهلاً وسهلاً',
      evening: formal ? 'مساء الخير' : 'مساء النور',
      night: formal ? 'تصبح على خير' : 'ليلة سعيدة',
    };

    return greetings[timeOfDay];
  };

  return (
    <ArabicFont
      cultural={includeIslamic && islamicCompliance.islamicGreetings ? 'religious' : 'formal'}
      weight={professionalStandards.formalLanguage ? 500 : 400}
      className="cultural-greeting"
    >
      {getGreeting()}
    </ArabicFont>
  );
};

// Cultural Form Validator Component
interface CulturalFormValidatorProps {
  value: string;
  type: 'name' | 'title' | 'message' | 'email' | 'phone';
  onValidation: (isValid: boolean, message?: string) => void;
}

export const CulturalFormValidator: React.FC<CulturalFormValidatorProps> = ({
  value,
  type,
  onValidation,
}) => {
  const { islamicCompliance, professionalStandards, culturalSensitivity } = useCulturalContext();

  useEffect(() => {
    const validateContent = (): { isValid: boolean; message?: string } => {
      // Islamic content validation
      if (islamicCompliance.halalContentOnly) {
        const haram_keywords = ['خمر', 'خنزير', 'ربا', 'قمار'];
        const containsHaram = haram_keywords.some((word) => value.includes(word));

        if (containsHaram) {
          return {
            isValid: false,
            message: 'المحتوى لا يتوافق مع القيم الإسلامية',
          };
        }
      }

      // Professional title validation
      if (type === 'title' && professionalStandards.titleRespect) {
        const requiredTitles = ['دكتور', 'مهندس', 'أستاذ', 'محامي'];
        const hasTitle = requiredTitles.some((title) => value.includes(title));

        if (value.length > 10 && !hasTitle && professionalStandards.formalLanguage) {
          return {
            isValid: false,
            message: 'يُفضل استخدام الألقاب المهنية المناسبة',
          };
        }
      }

      // Family values validation
      if (type === 'message' && culturalSensitivity.familyValues) {
        const inappropriate_topics = ['زواج', 'طلاق', 'خلافات أسرية'];
        const containsInappropriate = inappropriate_topics.some(
          (topic) => value.includes(topic) && value.length < 50
        );

        if (containsInappropriate) {
          return {
            isValid: false,
            message: 'يُفضل مناقشة المواضيع الأسرية بطريقة مناسبة',
          };
        }
      }

      return { isValid: true };
    };

    const result = validateContent();
    onValidation(result.isValid, result.message);
  }, [value, type, islamicCompliance, professionalStandards, culturalSensitivity, onValidation]);

  return null;
};

// Cultural Adaptive Layout Component
interface CulturalLayoutProps {
  children: ReactNode;
  variant: 'professional' | 'casual' | 'religious' | 'government';
  className?: string;
}

export const CulturalLayout: React.FC<CulturalLayoutProps> = ({
  children,
  variant,
  className = '',
}) => {
  const { professionalStandards, islamicCompliance } = useCulturalContext();

  const getLayoutClasses = (): string => {
    const classes = [className, `layout-${variant}`];

    if (variant === 'professional' && professionalStandards.governmentProtocol) {
      classes.push('government-protocol');
    }

    if (variant === 'religious' || islamicCompliance.level === 'strict') {
      classes.push('islamic-layout');
    }

    if (professionalStandards.hierarchyAwareness) {
      classes.push('hierarchy-aware');
    }

    return classes.join(' ');
  };

  return <div className={`cultural-layout ${getLayoutClasses()}`}>{children}</div>;
};

export default CulturalAdapter;
