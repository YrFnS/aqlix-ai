/**
 * Iraqi AI Chat Desktop - Main Application Layout
 * RTL-first layout with cultural adaptations and professional domain support
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Internal Components
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatArea } from '../Chat/ChatArea';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { ProfessionalDomainSelector } from '../Professional/ProfessionalDomainSelector';
import { OfflineIndicator } from '../Status/OfflineIndicator';
import { CulturalModeIndicator } from '../Cultural/CulturalModeIndicator';
import { NotificationCenter } from '../Notifications/NotificationCenter';

// Types
import type { 
  AppState, 
  LayoutConfig, 
  ProfessionalDomain, 
  CulturalMode,
  ThemeMode,
  LanguageDirection 
} from '../../types/app.types';

// Hooks
import { useRTLLayout } from '../../hooks/useRTLLayout';
import { useCulturalMode } from '../../hooks/useCulturalMode';
import { useOfflineStatus } from '../../hooks/useOfflineStatus';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useProfessionalDomain } from '../../hooks/useProfessionalDomain';

// Styled Components
const AppContainer = styled.div<{ 
  $direction: LanguageDirection;
  $culturalMode: CulturalMode;
  $theme: ThemeMode;
}>`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  direction: ${({ $direction }) => $direction};
  font-family: ${({ $direction }) => 
    $direction === 'rtl' ? 'var(--font-arabic)' : 'var(--font-english)'};
  
  background: ${({ $theme, $culturalMode }) => {
    if ($culturalMode === 'government') {
      return $theme === 'dark' 
        ? 'linear-gradient(135deg, #1a1d23 0%, #2d3748 100%)'
        : 'linear-gradient(135deg, #f8f9fb 0%, #ffffff 100%)';
    }
    return $theme === 'dark' 
      ? 'var(--dark-bg-primary)'
      : 'var(--bg-primary)';
  }};
  
  color: ${({ $theme }) => 
    $theme === 'dark' ? 'var(--dark-text-primary)' : 'var(--text-primary)'};
  
  ${({ $culturalMode }) => $culturalMode === 'government' && `
    border-top: 4px solid var(--iraqi-red);
    
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        var(--iraqi-red) 0%, 
        var(--iraqi-white) 33%, 
        var(--iraqi-black) 66%, 
        var(--iraqi-green) 100%
      );
      z-index: 1000;
    }
  `}
  
  transition: all 0.3s var(--ease-mesopotamian);
`;

const MainContent = styled.div<{ $direction: LanguageDirection }>`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  position: relative;
  
  ${({ $direction }) => $direction === 'rtl' ? `
    margin-right: auto;
  ` : `
    margin-left: auto;
  `}
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const ProfessionalBanner = styled(motion.div)<{ $domain: ProfessionalDomain }>`
  padding: var(--spacing-sm) var(--spacing-lg);
  background: ${({ $domain }) => `var(--domain-${$domain}-bg, var(--bg-secondary))`};
  border-bottom: 1px solid ${({ $domain }) => `var(--domain-${$domain}-color, var(--text-secondary))`};
  color: ${({ $domain }) => `var(--domain-${$domain}-color, var(--text-primary))`};
  font-weight: 500;
  text-align: center;
  z-index: 100;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  .domain-icon {
    width: 20px;
    height: 20px;
    opacity: 0.8;
  }
`;

const LoadingOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
`;

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    border-top: 2px solid var(--mesopotamian-gold);
    border-radius: 50%;
  }
`;

// Animation Variants
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const bannerVariants = {
  initial: { y: -50, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.2 } },
  exit: { y: -50, opacity: 0, transition: { duration: 0.3 } }
};

const loadingVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // Selectors
  const {
    theme,
    language,
    culturalMode,
    isLoading,
    sidebarCollapsed,
    settingsPanelOpen,
    currentView
  } = useSelector((state: AppState) => state.app);
  
  const { currentDomain } = useSelector((state: AppState) => state.professional);
  
  // Hooks
  const { direction, isRTL } = useRTLLayout(language);
  const { mode: activeCulturalMode, config } = useCulturalMode();
  const { isOffline, connectionQuality } = useOfflineStatus();
  const { domain: professionalDomain, domainConfig } = useProfessionalDomain();
  
  // State
  const [isInitializing, setIsInitializing] = useState(true);
  const [showDomainBanner, setShowDomainBanner] = useState(false);
  
  // Effects
  useEffect(() => {
    // Initialize app after a short delay
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    // Show professional domain banner when domain changes
    if (currentDomain && currentDomain !== 'general') {
      setShowDomainBanner(true);
      const timer = setTimeout(() => {
        setShowDomainBanner(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentDomain]);
  
  // Keyboard shortcuts setup
  useKeyboardShortcuts({
    'ctrl+,': () => dispatch({ type: 'TOGGLE_SETTINGS_PANEL' }),
    'ctrl+b': () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
    'ctrl+shift+d': () => dispatch({ type: 'TOGGLE_DARK_MODE' }),
    'ctrl+shift+l': () => dispatch({ type: 'TOGGLE_LANGUAGE' }),
    'alt+1': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'legal' }),
    'alt+2': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'medical' }),
    'alt+3': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'educational' }),
    'alt+4': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'engineering' }),
    'alt+5': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'business' }),
    'alt+6': () => dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: 'government' }),
  });
  
  // Handlers
  const handleSidebarToggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, [dispatch]);
  
  const handleSettingsToggle = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS_PANEL' });
  }, [dispatch]);
  
  const handleDomainChange = useCallback((domain: ProfessionalDomain) => {
    dispatch({ type: 'SET_PROFESSIONAL_DOMAIN', payload: domain });
  }, [dispatch]);
  
  // Memoized components
  const sidebarComponent = useMemo(() => (
    <Sidebar
      collapsed={sidebarCollapsed}
      onToggle={handleSidebarToggle}
      culturalMode={activeCulturalMode}
      professionalDomain={professionalDomain}
      isRTL={isRTL}
    />
  ), [sidebarCollapsed, handleSidebarToggle, activeCulturalMode, professionalDomain, isRTL]);
  
  const headerComponent = useMemo(() => (
    <Header
      onMenuClick={handleSidebarToggle}
      onSettingsClick={handleSettingsToggle}
      culturalMode={activeCulturalMode}
      professionalDomain={professionalDomain}
      isOffline={isOffline}
      connectionQuality={connectionQuality}
      isRTL={isRTL}
    />
  ), [
    handleSidebarToggle, 
    handleSettingsToggle, 
    activeCulturalMode, 
    professionalDomain, 
    isOffline, 
    connectionQuality, 
    isRTL
  ]);
  
  // Loading state
  if (isInitializing || isLoading) {
    return (
      <AnimatePresence>
        <LoadingOverlay
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <LoadingSpinner
            variants={spinnerVariants}
            animate="animate"
          />
        </LoadingOverlay>
      </AnimatePresence>
    );
  }
  
  return (
    <AppContainer
      $direction={direction}
      $culturalMode={activeCulturalMode}
      $theme={theme}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      as={motion.div}
    >
      {/* Professional Domain Banner */}
      <AnimatePresence>
        {showDomainBanner && currentDomain && currentDomain !== 'general' && (
          <ProfessionalBanner
            $domain={currentDomain}
            variants={bannerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="domain-icon">
              {domainConfig?.icon || '⚖️'}
            </div>
            <span>
              {t(`professional.domain.${currentDomain}.activeMode`, {
                defaultValue: `${domainConfig?.nameAr || domainConfig?.nameEn || ''} نشط`
              })}
            </span>
          </ProfessionalBanner>
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      {sidebarComponent}
      
      {/* Main Content Area */}
      <MainContent $direction={direction}>
        {/* Header */}
        {headerComponent}
        
        {/* Content Wrapper */}
        <ContentWrapper>
          {/* Primary Content */}
          {currentView === 'chat' && (
            <ChatArea
              culturalMode={activeCulturalMode}
              professionalDomain={professionalDomain}
              isRTL={isRTL}
            />
          )}
          
          {currentView === 'settings' && (
            <SettingsPanel
              isOpen={settingsPanelOpen}
              onClose={handleSettingsToggle}
              culturalMode={activeCulturalMode}
              isRTL={isRTL}
            />
          )}
          
          {children}
        </ContentWrapper>
      </MainContent>
      
      {/* Floating Components */}
      <OfflineIndicator
        isOffline={isOffline}
        connectionQuality={connectionQuality}
        isRTL={isRTL}
      />
      
      <CulturalModeIndicator
        mode={activeCulturalMode}
        config={config}
        isRTL={isRTL}
      />
      
      <NotificationCenter
        culturalMode={activeCulturalMode}
        isRTL={isRTL}
      />
      
      {/* Professional Domain Selector (when needed) */}
      <ProfessionalDomainSelector
        currentDomain={professionalDomain}
        onDomainChange={handleDomainChange}
        culturalMode={activeCulturalMode}
        isRTL={isRTL}
      />
    </AppContainer>
  );
};

export default AppLayout;