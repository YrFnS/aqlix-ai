/**
 * Component Inspector & Analyzer - Basic Usage Examples
 * 
 * Demonstrates comprehensive analysis capabilities for Iraqi government components
 * with cultural intelligence, performance optimization, and accessibility validation.
 */

import {
  ComponentInspector,
  createIraqiComponentInspector,
  CulturalValidator,
  PerformanceProfiler,
  AccessibilityTester,
  PatternDetector,
  IRAQI_GOVERNMENT_CONFIG,
  MINISTRY_CONFIGS
} from '../src';

import type {
  ComponentAnalysis,
  CulturalCompliance,
  PerformanceMetrics,
  AccessibilityReport,
  PatternMatch,
  MinistryType
} from '../src';

/**
 * Example 1: Quick Setup for Iraqi Government Components
 */
async function quickSetupExample() {
  console.log('=== Quick Setup Example ===');
  
  // Quick setup with ministry configuration
  const inspector = createIraqiComponentInspector({
    ministry: 'interior',
    customConfig: {
      performance: {
        targets: { renderTime: 12, accessibility: 98 }
      }
    }
  });

  // Analyze a government form component
  const analysis = await inspector.analyzeComponent({
    filePath: './components/CitizenIDForm.tsx',
    culturalContext: 'iraqi-government',
    targetMinistry: 'interior'
  });

  console.log('📊 Analysis Results:');
  console.log(`Cultural Compliance: ${analysis.cultural.score}%`);
  console.log(`Islamic Compliance: ${analysis.cultural.islamicCompliance.score}%`);
  console.log(`Performance Score: ${analysis.performance.renderTime}ms`);
  console.log(`Accessibility: ${analysis.accessibility.score}%`);
  console.log(`Detected Patterns: ${analysis.patterns.length}`);
  
  // Display recommendations
  analysis.recommendations.forEach((rec, index) => {
    console.log(`${index + 1}. ${rec.title}: ${rec.description}`);
  });
}

/**
 * Example 2: Detailed Cultural Analysis
 */
async function culturalAnalysisExample() {
  console.log('\n=== Cultural Analysis Example ===');
  
  const validator = new CulturalValidator({
    validation: {
      islamicCompliance: true,
      governmentStandards: true,
      ministrySpecific: 'health'
    },
    language: {
      primary: 'ar-IQ',
      fallback: 'en-US',
      rtlOptimization: true
    },
    patterns: {
      detectGovernmentPatterns: true,
      enforceIslamicDesign: true,
      validateCulturalContent: true
    }
  });

  // Mock component data for demonstration
  const mockAST = null; // In real usage, would be parsed AST
  const mockDOM = {
    tagName: 'form',
    attributes: {
      class: 'government-form ministry-health',
      'data-ministry': 'health',
      dir: 'rtl',
      lang: 'ar-IQ'
    },
    styles: {
      direction: 'rtl',
      fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
      backgroundColor: '#059669', // Health ministry green
      color: '#ffffff'
    },
    children: [],
    culturalMetadata: {
      language: 'ar',
      script: 'arab',
      textDirection: 'rtl',
      culturalTags: ['government-component', 'arabic-content']
    },
    accessibilityInfo: {
      role: 'form',
      ariaLabel: 'نموذج الخدمات الصحية',
      tabIndex: 0,
      focusable: true
    }
  };

  const compliance = await validator.analyze(mockAST, mockDOM, {
    culturalContext: 'iraqi-healthcare',
    targetMinistry: 'health'
  });

  console.log('🕌 Cultural Compliance Analysis:');
  console.log(`Overall Score: ${compliance.score}%`);
  console.log(`Islamic Compliance: ${compliance.islamicCompliance.score}%`);
  console.log(`Government Standards: ${compliance.governmentStandards.score}%`);
  console.log(`Arabic Support: ${compliance.languageSupport.arabicSupport}%`);
  console.log(`RTL Compliance: ${compliance.languageSupport.rtlCompliance}%`);
  console.log(`Content Validation: ${compliance.contentValidation.score}%`);

  // Display Islamic compliance details
  if (compliance.islamicCompliance.violations.length > 0) {
    console.log('⚠️  Islamic Compliance Issues:');
    compliance.islamicCompliance.violations.forEach(violation => {
      console.log(`  - ${violation.description} (${violation.severity})`);
    });
  } else {
    console.log('✅ No Islamic compliance violations found');
  }
}

/**
 * Example 3: Performance Analysis with RTL Optimization
 */
async function performanceAnalysisExample() {
  console.log('\n=== Performance Analysis Example ===');
  
  const profiler = new PerformanceProfiler({
    targets: {
      renderTime: 16,
      bundleSize: '100kb',
      accessibility: 95
    },
    arabic: {
      fontOptimization: true,
      rtlProfiling: true,
      mixedContentAnalysis: true
    },
    profiling: {
      enableRealTime: true,
      sampleRate: 0.1,
      metricsCollection: ['render-time', 'rtl-performance', 'cultural-compliance']
    }
  });

  // Mock component info
  const componentInfo = {
    name: 'ArabicDataTable',
    path: './components/ArabicDataTable.tsx',
    type: 'functional' as const,
    framework: 'react' as const,
    size: {
      loc: 250,
      bundleSize: 45000,
      memoryFootprint: 120
    },
    dependencies: [
      { name: 'react-i18next', version: '^13.0.0', type: 'runtime' as const, culturalRelevance: true },
      { name: 'moment-hijri', version: '^2.1.2', type: 'runtime' as const, culturalRelevance: true }
    ],
    exports: [
      { name: 'ArabicDataTable', type: 'default' as const }
    ]
  };

  const mockDOM = {
    tagName: 'div',
    attributes: {
      class: 'data-table rtl-table arabic-content',
      dir: 'rtl'
    },
    styles: {
      direction: 'rtl',
      fontFamily: 'Noto Sans Arabic, Cairo',
      fontSize: '14px',
      lineHeight: '1.8'
    },
    children: [
      {
        tagName: 'table',
        attributes: { class: 'arabic-table' },
        styles: {},
        children: [],
        culturalMetadata: {
          language: 'ar',
          script: 'arab',
          textDirection: 'rtl',
          culturalTags: ['arabic-content']
        },
        accessibilityInfo: {
          role: 'table',
          tabIndex: 0,
          focusable: true
        }
      }
    ],
    culturalMetadata: {
      language: 'ar',
      script: 'arab', 
      textDirection: 'rtl',
      culturalTags: ['arabic-content', 'rtl-layout']
    },
    accessibilityInfo: {
      role: 'region',
      tabIndex: 0,
      focusable: true
    }
  };

  const metrics = await profiler.analyze(null, mockDOM, componentInfo);

  console.log('⚡ Performance Analysis Results:');
  console.log(`Render Time: ${metrics.renderTime}ms`);
  console.log(`Bundle Size: ${Math.round(metrics.bundleSize / 1024)}KB`);
  console.log(`Memory Usage: ${metrics.memoryUsage}KB`);
  
  console.log('\n📱 RTL Performance Metrics:');
  console.log(`RTL Render Time: ${metrics.rtlMetrics.renderTime}ms`);
  console.log(`Layout Shifts: ${metrics.rtlMetrics.layoutShifts}`);
  console.log(`Text Direction: ${metrics.rtlMetrics.textDirection}`);
  console.log(`BIDI Compliance: ${metrics.rtlMetrics.bidiCompliance ? '✅' : '❌'}`);
  console.log(`Performance Impact: ${metrics.rtlMetrics.performanceImpact}%`);

  console.log('\n🔤 Arabic Font Metrics:');
  console.log(`Load Time: ${metrics.arabicFontMetrics.loadTime}ms`);
  console.log(`Render Quality: ${metrics.arabicFontMetrics.renderQuality}%`);
  console.log(`Optimization Score: ${metrics.arabicFontMetrics.optimizationScore}%`);
  console.log(`Supported Scripts: ${metrics.arabicFontMetrics.supportedScripts.join(', ')}`);

  console.log('\n🌐 Web Vitals:');
  console.log(`LCP: ${metrics.vitals.lcp}ms`);
  console.log(`FID: ${metrics.vitals.fid}ms`);
  console.log(`CLS: ${metrics.vitals.cls}`);
}

/**
 * Example 4: Accessibility Testing with WCAG 2.1 AA+
 */
async function accessibilityTestingExample() {
  console.log('\n=== Accessibility Testing Example ===');
  
  const tester = new AccessibilityTester({
    standards: {
      wcag: 'AAA', // Highest standard
      iraqiGovernment: true,
      rtlCompliance: true
    },
    testing: {
      automated: true,
      screenReaderTesting: true,
      keyboardNavigation: true
    }
  });

  // Mock government form DOM
  const mockDOM = {
    tagName: 'form',
    attributes: {
      role: 'form',
      'aria-label': 'نموذج طلب الخدمة الحكومية',
      'aria-labelledby': 'form-title',
      lang: 'ar-IQ',
      dir: 'rtl'
    },
    styles: {
      direction: 'rtl',
      fontFamily: 'Noto Sans Arabic',
      color: '#1f2937',
      backgroundColor: '#ffffff'
    },
    children: [
      {
        tagName: 'h1',
        attributes: {
          id: 'form-title',
          lang: 'ar'
        },
        styles: {},
        children: [],
        culturalMetadata: {
          language: 'ar',
          script: 'arab',
          textDirection: 'rtl',
          culturalTags: ['arabic-content']
        },
        accessibilityInfo: {
          role: 'heading',
          tabIndex: 0,
          focusable: true
        }
      },
      {
        tagName: 'input',
        attributes: {
          type: 'text',
          name: 'nationalId',
          'aria-label': 'رقم الهوية الوطنية',
          'aria-required': 'true',
          dir: 'ltr' // National ID is LTR even in Arabic context
        },
        styles: {},
        children: [],
        culturalMetadata: {
          language: 'ar',
          script: 'latn', // Numbers use Latin script
          textDirection: 'ltr',
          culturalTags: ['government-field']
        },
        accessibilityInfo: {
          role: 'textbox',
          ariaLabel: 'رقم الهوية الوطنية',
          tabIndex: 0,
          focusable: true
        }
      }
    ],
    culturalMetadata: {
      language: 'ar',
      script: 'arab',
      textDirection: 'rtl',
      culturalTags: ['government-form', 'arabic-content']
    },
    accessibilityInfo: {
      role: 'form',
      ariaLabel: 'نموذج طلب الخدمة الحكومية',
      tabIndex: 0,
      focusable: true
    }
  };

  const report = await tester.analyze(null, mockDOM, {
    culturalContext: 'iraqi-government'
  });

  console.log('♿ Accessibility Analysis Results:');
  console.log(`Overall Score: ${report.score}%`);
  
  console.log('\n📋 WCAG Compliance:');
  console.log(`Level: ${report.wcagCompliance.level}`);
  console.log(`Score: ${report.wcagCompliance.score}%`);
  console.log(`Passed Rules: ${report.wcagCompliance.passedRules}/${report.wcagCompliance.totalRules}`);

  console.log('\n🔄 RTL Accessibility:');
  console.log(`Score: ${report.rtlAccessibility.score}%`);
  console.log(`Keyboard Navigation: ${report.rtlAccessibility.keyboardNavigation ? '✅' : '❌'}`);
  console.log(`Screen Reader Support: ${report.rtlAccessibility.screenReaderSupport ? '✅' : '❌'}`);
  console.log(`Text Direction: ${report.rtlAccessibility.textDirection ? '✅' : '❌'}`);

  console.log('\n🏛️ Government Standards:');
  console.log(`Score: ${report.governmentStandards.score}%`);
  console.log(`Iraqi Standards: ${report.governmentStandards.iraqiStandards ? '✅' : '❌'}`);
  console.log(`Digital Governance: ${report.governmentStandards.digitalGovernance ? '✅' : '❌'}`);
  console.log(`Citizen Access: ${report.governmentStandards.citizenAccess ? '✅' : '❌'}`);

  // Display violations if any
  if (report.violations.length > 0) {
    console.log('\n⚠️  Accessibility Violations:');
    report.violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.rule}: ${violation.description} (${violation.impact})`);
    });
  } else {
    console.log('\n✅ No accessibility violations found');
  }
}

/**
 * Example 5: Pattern Detection for Government Components
 */
async function patternDetectionExample() {
  console.log('\n=== Pattern Detection Example ===');
  
  const detector = new PatternDetector({
    validation: {
      islamicCompliance: true,
      governmentStandards: true
    },
    language: {
      primary: 'ar-IQ',
      rtlOptimization: true
    },
    patterns: {
      detectGovernmentPatterns: true,
      enforceIslamicDesign: true,
      validateCulturalContent: true
    }
  });

  // Mock components with different government patterns
  const mockComponents = [
    {
      name: 'GovernmentForm',
      dom: {
        tagName: 'form',
        attributes: {
          class: 'government-form ministry-interior',
          'data-ministry': 'interior'
        },
        styles: {},
        children: [
          {
            tagName: 'input',
            attributes: { name: 'nationalId', type: 'text' },
            styles: {},
            children: [],
            culturalMetadata: { language: 'ar', textDirection: 'ltr', culturalTags: ['government-field'] },
            accessibilityInfo: { role: 'textbox', tabIndex: 0, focusable: true }
          }
        ],
        culturalMetadata: { language: 'ar', textDirection: 'rtl', culturalTags: ['government-form'] },
        accessibilityInfo: { role: 'form', tabIndex: 0, focusable: true }
      }
    },
    {
      name: 'PrayerTimeNotice',
      dom: {
        tagName: 'div',
        attributes: {
          class: 'prayer-notice islamic-component',
          id: 'prayer-times'
        },
        styles: {},
        children: [],
        culturalMetadata: { language: 'ar', textDirection: 'rtl', culturalTags: ['islamic-component', 'prayer-times'] },
        accessibilityInfo: { role: 'region', tabIndex: 0, focusable: true }
      }
    }
  ];

  const targetPatterns = [
    'government-form',
    'ministry-header',
    'prayer-notice',
    'arabic-content-block',
    'citizen-portal'
  ];

  for (const component of mockComponents) {
    console.log(`\n🔍 Analyzing ${component.name}:`);
    
    const patterns = await detector.detectPatterns(
      null, // AST
      component.dom,
      targetPatterns
    );

    if (patterns.length > 0) {
      patterns.forEach(pattern => {
        console.log(`  ✅ Pattern: ${pattern.name}`);
        console.log(`     Confidence: ${pattern.confidence}%`);
        console.log(`     Compliance: ${pattern.compliance}%`);
        console.log(`     Cultural Relevance: ${pattern.culturalRelevance}%`);
        
        if (pattern.suggestions.length > 0) {
          console.log(`     Suggestions: ${pattern.suggestions.join(', ')}`);
        }
      });
    } else {
      console.log('  ❌ No government patterns detected');
    }
  }
}

/**
 * Example 6: Real-Time Monitoring Setup
 */
async function realTimeMonitoringExample() {
  console.log('\n=== Real-Time Monitoring Example ===');
  
  const inspector = createIraqiComponentInspector({
    ministry: 'health',
    customConfig: {
      performance: {
        profiling: {
          enableRealTime: true,
          sampleRate: 0.05 // 5% sampling for efficiency
        }
      }
    }
  });

  // Create monitor for critical health system component
  const monitor = inspector.createMonitor({
    target: 'patient-dashboard',
    metrics: ['render-time', 'rtl-performance', 'cultural-compliance', 'accessibility'],
    culturalValidation: true,
    interval: 2000 // Check every 2 seconds
  });

  console.log('📊 Starting real-time monitoring...');

  // Set up event listeners
  monitor.on('performance-issue', (issue) => {
    console.log(`⚠️  Performance Issue Detected:`);
    console.log(`   Type: ${issue.type}`);
    console.log(`   Value: ${issue.value}${issue.metric === 'renderTime' ? 'ms' : ''}`);
    console.log(`   Threshold: ${issue.threshold}${issue.metric === 'renderTime' ? 'ms' : ''}`);
    console.log(`   Cultural Impact: ${issue.culturalImpact}%`);
  });

  monitor.on('cultural-violation', (violation) => {
    console.log(`🕌 Cultural Violation Detected:`);
    console.log(`   Type: ${violation.type}`);
    console.log(`   Score: ${violation.score}%`);
    console.log(`   Violations: ${violation.violations.length}`);
  });

  // Simulate monitoring for demo purposes
  console.log('Monitor is running. In a real application, this would continuously monitor the component.');
  console.log('Stopping monitor after 5 seconds for demo...');
  
  setTimeout(() => {
    monitor.stop();
    console.log('✅ Monitoring stopped');
  }, 5000);
}

/**
 * Example 7: Ministry-Specific Configuration Comparison
 */
async function ministryComparisonExample() {
  console.log('\n=== Ministry Configuration Comparison ===');
  
  const ministries: MinistryType[] = ['interior', 'health', 'education', 'justice'];
  
  for (const ministry of ministries) {
    console.log(`\n🏛️  ${ministry.toUpperCase()} MINISTRY CONFIGURATION:`);
    
    const inspector = createIraqiComponentInspector({ ministry });
    const config = MINISTRY_CONFIGS[ministry];
    
    console.log(`   WCAG Level: ${config.accessibility?.standards?.wcag || 'AA'}`);
    console.log(`   Render Time Target: ${config.performance?.targets?.renderTime || 16}ms`);
    console.log(`   Accessibility Target: ${config.performance?.targets?.accessibility || 95}%`);
    console.log(`   Security Level: ${config.security?.governmentCompliance ? 'Government-Grade' : 'Standard'}`);
    console.log(`   Cultural Enforcement: ${config.cultural?.patterns?.enforceIslamicDesign ? 'Strict' : 'Standard'}`);
  }
}

/**
 * Main execution function
 */
async function runAllExamples() {
  console.log('🚀 Component Inspector & Analyzer - Iraqi Enhanced Examples\n');
  console.log('========================================================\n');

  try {
    await quickSetupExample();
    await culturalAnalysisExample();
    await performanceAnalysisExample();
    await accessibilityTestingExample();
    await patternDetectionExample();
    await realTimeMonitoringExample();
    await ministryComparisonExample();
    
    console.log('\n========================================================');
    console.log('✅ All examples completed successfully!');
    console.log('📊 Component Inspector & Analyzer is ready for Iraqi government integration.');
    
  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
}

// Execute examples if this file is run directly
if (require.main === module) {
  runAllExamples();
}

export {
  quickSetupExample,
  culturalAnalysisExample,
  performanceAnalysisExample,
  accessibilityTestingExample,
  patternDetectionExample,
  realTimeMonitoringExample,
  ministryComparisonExample,
  runAllExamples
};