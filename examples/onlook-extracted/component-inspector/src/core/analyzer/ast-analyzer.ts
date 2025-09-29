import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { Logger } from "../../utils/logger";
import type {
  ComponentInspectorConfig,
  ASTNode,
  CulturalContext,
  PerformanceMetrics,
  SecurityVulnerability,
  PatternMatch,
} from "../../types";

/**
 * ASTAnalyzer - Advanced AST analysis with Iraqi cultural intelligence
 *
 * Provides comprehensive AST analysis including:
 * - Cultural pattern detection in code
 * - Performance impact analysis
 * - Security vulnerability scanning
 * - Islamic compliance validation
 * - Government standard compliance
 */
export class ASTAnalyzer {
  private logger: Logger;

  constructor(private config: ComponentInspectorConfig) {
    this.logger = new Logger("ASTAnalyzer", config);
  }

  /**
   * Analyze AST for cultural compliance and patterns
   */
  async analyzeCulturalPatterns(ast: ASTNode): Promise<{
    patterns: PatternMatch[];
    culturalScore: number;
    islamicCompliance: number;
    violations: any[];
  }> {
    this.logger.info("Analyzing cultural patterns in AST");

    const patterns: PatternMatch[] = [];
    const violations: any[] = [];
    let islamicScore = 100;
    let culturalScore = 100;

    traverse(ast, {
      // Check for Arabic text and RTL patterns
      StringLiteral: (path) => {
        const value = path.node.value;
        const result = this.analyzeTextContent(value, path);

        if (result.hasArabicText) {
          patterns.push({
            id: `arabic-text-${path.node.start}`,
            name: "Arabic Text Content",
            type: "arabic-content-block",
            confidence: result.confidence,
            compliance: result.islamicCompliance,
            location: this.getSourceLocation(path),
            suggestions: result.suggestions,
            culturalRelevance: result.culturalRelevance,
          });

          if (result.islamicCompliance < 80) {
            islamicScore = Math.min(islamicScore, result.islamicCompliance);
            violations.push({
              type: "islamic-content-violation",
              severity: "medium" as const,
              description:
                "Text content may not comply with Islamic principles",
              location: this.getSourceLocation(path),
              recommendation: "Review text for cultural appropriateness",
            });
          }
        }
      },

      // Check JSX elements for RTL and cultural patterns
      JSXElement: (path) => {
        const element = path.node;
        const result = this.analyzeJSXElement(element, path);

        patterns.push(...result.patterns);
        violations.push(...result.violations);

        if (result.culturalScore < culturalScore) {
          culturalScore = result.culturalScore;
        }
      },

      // Check for prayer time or Islamic calendar integration
      CallExpression: (path) => {
        const result = this.analyzeCallExpression(path.node, path);

        if (result.isIslamicFunction) {
          patterns.push({
            id: `islamic-function-${path.node.start}`,
            name: "Islamic Function Call",
            type: "cultural-component",
            confidence: 95,
            compliance: 100,
            location: this.getSourceLocation(path),
            suggestions: [
              "Ensure prayer times are accurate",
              "Validate Islamic calendar",
            ],
            culturalRelevance: 100,
          });
        }
      },

      // Check imports for cultural libraries
      ImportDeclaration: (path) => {
        const source = path.node.source.value;
        const result = this.analyzeCulturalImports(source, path);

        if (result.isCultural) {
          patterns.push({
            id: `cultural-import-${path.node.start}`,
            name: "Cultural Library Import",
            type: "cultural-component",
            confidence: result.confidence,
            compliance: result.compliance,
            location: this.getSourceLocation(path),
            suggestions: result.suggestions,
            culturalRelevance: result.culturalRelevance,
          });
        }
      },
    });

    const finalScore = Math.min(culturalScore, islamicScore);

    this.logger.info("Cultural pattern analysis completed", {
      patterns: patterns.length,
      violations: violations.length,
      culturalScore: finalScore,
    });

    return {
      patterns,
      culturalScore: finalScore,
      islamicCompliance: islamicScore,
      violations,
    };
  }

  /**
   * Analyze performance implications in AST
   */
  async analyzePerformanceImpact(ast: ASTNode): Promise<{
    score: number;
    issues: any[];
    optimizations: any[];
    rtlImpact: number;
  }> {
    this.logger.info("Analyzing performance impact in AST");

    const issues: any[] = [];
    const optimizations: any[] = [];
    let performanceScore = 100;
    let rtlImpact = 0;

    traverse(ast, {
      // Check for performance-heavy operations
      CallExpression: (path) => {
        const callee = path.node.callee;

        // Check for expensive DOM operations
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.property) &&
          ["innerHTML", "querySelectorAll", "getElementsByClassName"].includes(
            callee.property.name,
          )
        ) {
          issues.push({
            type: "expensive-dom-operation",
            severity: "medium",
            location: this.getSourceLocation(path),
            description: `Potentially expensive DOM operation: ${callee.property.name}`,
            impact: 15,
          });
          performanceScore -= 15;
        }

        // Check for Arabic text processing
        if (
          t.isIdentifier(callee) &&
          ["replaceAll", "split", "match"].includes(callee.name)
        ) {
          const args = path.node.arguments;
          if (args.length > 0 && t.isStringLiteral(args[0])) {
            const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
            if (arabicRegex.test(args[0].value)) {
              rtlImpact += 10;
              issues.push({
                type: "arabic-text-processing",
                severity: "low",
                location: this.getSourceLocation(path),
                description: "Arabic text processing may impact performance",
                impact: 10,
              });
            }
          }
        }
      },

      // Check for RTL-specific styling
      JSXAttribute: (path) => {
        const attr = path.node;
        if (t.isJSXIdentifier(attr.name) && attr.name.name === "style") {
          if (
            t.isJSXExpressionContainer(attr.value) &&
            t.isObjectExpression(attr.value.expression)
          ) {
            const styleObj = attr.value.expression;
            styleObj.properties.forEach((prop) => {
              if (
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                ["direction", "textAlign", "float"].includes(prop.key.name)
              ) {
                rtlImpact += 5;
              }
            });
          }
        }
      },

      // Check for loops that might process Arabic content
      ForStatement: (path) => {
        // Check if loop body contains Arabic processing
        let hasArabicProcessing = false;

        traverse(path.node, {
          StringLiteral: (innerPath) => {
            const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
            if (arabicRegex.test(innerPath.node.value)) {
              hasArabicProcessing = true;
            }
          },
        });

        if (hasArabicProcessing) {
          issues.push({
            type: "arabic-loop-processing",
            severity: "medium",
            location: this.getSourceLocation(path),
            description:
              "Loop processing Arabic content may impact performance",
            impact: 20,
          });
          rtlImpact += 20;
          performanceScore -= 20;
        }
      },
    });

    // Generate optimization suggestions
    if (rtlImpact > 30) {
      optimizations.push({
        type: "rtl-optimization",
        description:
          "Consider using CSS logical properties for RTL optimization",
        implementation:
          "Replace left/right properties with inline-start/inline-end",
        impact: Math.min(rtlImpact * 0.7, 30),
      });
    }

    if (issues.length > 5) {
      optimizations.push({
        type: "code-splitting",
        description: "Consider code splitting to reduce bundle size",
        implementation: "Use dynamic imports for heavy Arabic text processing",
        impact: 25,
      });
    }

    this.logger.info("Performance impact analysis completed", {
      score: performanceScore,
      issues: issues.length,
      rtlImpact,
    });

    return {
      score: Math.max(performanceScore, 0),
      issues,
      optimizations,
      rtlImpact,
    };
  }

  /**
   * Analyze security vulnerabilities in AST
   */
  async analyzeSecurityVulnerabilities(ast: ASTNode): Promise<{
    vulnerabilities: SecurityVulnerability[];
    score: number;
    dataProtectionIssues: any[];
  }> {
    this.logger.info("Analyzing security vulnerabilities in AST");

    const vulnerabilities: SecurityVulnerability[] = [];
    const dataProtectionIssues: any[] = [];
    let securityScore = 100;

    traverse(ast, {
      // Check for direct innerHTML usage (XSS risk)
      MemberExpression: (path) => {
        if (
          t.isIdentifier(path.node.property) &&
          path.node.property.name === "innerHTML"
        ) {
          vulnerabilities.push({
            type: "xss-innerHTML",
            severity: "high",
            description:
              "Direct innerHTML usage can lead to XSS vulnerabilities",
            cve: "CWE-79",
            mitigation: "Use textContent or safe HTML sanitization",
          });
          securityScore -= 25;
        }
      },

      // Check for eval usage
      CallExpression: (path) => {
        if (
          t.isIdentifier(path.node.callee) &&
          path.node.callee.name === "eval"
        ) {
          vulnerabilities.push({
            type: "code-injection-eval",
            severity: "critical",
            description: "eval() usage can lead to code injection attacks",
            cve: "CWE-95",
            mitigation: "Remove eval() usage and use safer alternatives",
          });
          securityScore -= 40;
        }
      },

      // Check for sensitive data in strings (Iraqi context)
      StringLiteral: (path) => {
        const value = path.node.value;

        // Check for Iraqi ID patterns
        const iraqiIdPattern = /\b\d{12}\b/; // Iraqi national ID pattern
        if (iraqiIdPattern.test(value)) {
          dataProtectionIssues.push({
            type: "hardcoded-national-id",
            severity: "high",
            location: this.getSourceLocation(path),
            description: "Hardcoded national ID detected",
            recommendation: "Remove hardcoded IDs and use secure storage",
          });
          securityScore -= 20;
        }

        // Check for phone numbers
        const phonePattern = /\b(\+964|0)(7[0-9]|78[0-9])\d{7}\b/;
        if (phonePattern.test(value)) {
          dataProtectionIssues.push({
            type: "hardcoded-phone",
            severity: "medium",
            location: this.getSourceLocation(path),
            description: "Hardcoded phone number detected",
            recommendation: "Remove hardcoded phone numbers",
          });
          securityScore -= 10;
        }
      },

      // Check for insecure HTTP requests
      StringLiteral: (path) => {
        const value = path.node.value;
        if (value.startsWith("http://") && !value.includes("localhost")) {
          vulnerabilities.push({
            type: "insecure-http",
            severity: "medium",
            description: "Insecure HTTP request detected",
            mitigation: "Use HTTPS for all external requests",
          });
          securityScore -= 15;
        }
      },
    });

    this.logger.info("Security analysis completed", {
      vulnerabilities: vulnerabilities.length,
      dataProtectionIssues: dataProtectionIssues.length,
      score: securityScore,
    });

    return {
      vulnerabilities,
      score: Math.max(securityScore, 0),
      dataProtectionIssues,
    };
  }

  // Private helper methods

  private analyzeTextContent(
    text: string,
    path: any,
  ): {
    hasArabicText: boolean;
    confidence: number;
    islamicCompliance: number;
    culturalRelevance: number;
    suggestions: string[];
  } {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    const hasArabicText = arabicRegex.test(text);

    if (!hasArabicText) {
      return {
        hasArabicText: false,
        confidence: 0,
        islamicCompliance: 100,
        culturalRelevance: 0,
        suggestions: [],
      };
    }

    // Check Islamic compliance
    const islamicTerms = [
      "الله",
      "محمد",
      "القرآن",
      "الإسلام",
      "المسجد",
      "الصلاة",
    ];
    const inappropriateTerms = ["خمر", "قمار", "ربا"];
    const governmentTerms = ["وزارة", "حكومة", "دولة", "مواطن", "خدمات"];

    const hasIslamicTerms = islamicTerms.some((term) => text.includes(term));
    const hasInappropriateTerms = inappropriateTerms.some((term) =>
      text.includes(term),
    );
    const hasGovernmentTerms = governmentTerms.some((term) =>
      text.includes(term),
    );

    let islamicCompliance = 100;
    if (hasInappropriateTerms) {
      islamicCompliance = 30;
    } else if (hasIslamicTerms) {
      islamicCompliance = 100;
    } else {
      islamicCompliance = 80;
    }

    const culturalRelevance = hasGovernmentTerms
      ? 100
      : hasIslamicTerms
        ? 90
        : 60;

    const suggestions = [];
    if (islamicCompliance < 80) {
      suggestions.push("Review text for Islamic appropriateness");
    }
    if (!hasGovernmentTerms && !hasIslamicTerms) {
      suggestions.push("Consider adding cultural context for government users");
    }

    return {
      hasArabicText: true,
      confidence: 95,
      islamicCompliance,
      culturalRelevance,
      suggestions,
    };
  }

  private analyzeJSXElement(
    element: any,
    path: any,
  ): {
    patterns: PatternMatch[];
    violations: any[];
    culturalScore: number;
  } {
    const patterns: PatternMatch[] = [];
    const violations: any[] = [];
    let culturalScore = 100;

    if (t.isJSXIdentifier(element.openingElement.name)) {
      const elementName = element.openingElement.name.name;

      // Check for form elements (government pattern)
      if (["form", "Form"].includes(elementName)) {
        patterns.push({
          id: `government-form-${element.start}`,
          name: "Government Form Pattern",
          type: "government-form",
          confidence: 80,
          compliance: 85,
          location: this.getSourceLocation(path),
          suggestions: [
            "Ensure form supports Arabic input",
            "Add RTL text direction attributes",
            "Include government accessibility standards",
          ],
          culturalRelevance: 90,
        });
      }

      // Check for header elements (ministry pattern)
      if (["header", "Header"].includes(elementName)) {
        patterns.push({
          id: `ministry-header-${element.start}`,
          name: "Ministry Header Pattern",
          type: "ministry-header",
          confidence: 85,
          compliance: 90,
          location: this.getSourceLocation(path),
          suggestions: [
            "Include ministry logo and branding",
            "Add Arabic government title",
            "Ensure proper navigation structure",
          ],
          culturalRelevance: 95,
        });
      }
    }

    // Check attributes for cultural patterns
    element.openingElement.attributes?.forEach((attr: any) => {
      if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
        const attrName = attr.name.name;

        // Check for RTL attributes
        if (attrName === "dir") {
          patterns.push({
            id: `rtl-attribute-${element.start}`,
            name: "RTL Direction Attribute",
            type: "arabic-content-block",
            confidence: 100,
            compliance: 100,
            location: this.getSourceLocation(path),
            suggestions: ["Excellent RTL support implementation"],
            culturalRelevance: 100,
          });
        }

        // Check for missing cultural attributes
        if (attrName === "className" && t.isStringLiteral(attr.value)) {
          const className = attr.value.value;
          if (!className.includes("dir-") && !className.includes("rtl")) {
            culturalScore -= 10;
            violations.push({
              type: "missing-rtl-class",
              severity: "low",
              description: "Component may benefit from RTL CSS classes",
              location: this.getSourceLocation(path),
              recommendation: "Add RTL-aware CSS classes",
            });
          }
        }
      }
    });

    return {
      patterns,
      violations,
      culturalScore,
    };
  }

  private analyzeCallExpression(
    node: any,
    path: any,
  ): {
    isIslamicFunction: boolean;
    confidence: number;
  } {
    if (t.isIdentifier(node.callee)) {
      const functionName = node.callee.name.toLowerCase();

      const islamicFunctions = [
        "getprayertimes",
        "calculatesalah",
        "gethijridate",
        "getqibladirection",
        "islamiccalendar",
        "ramadancheck",
      ];

      const isIslamic = islamicFunctions.some((fn) =>
        functionName.includes(fn.replace(/([A-Z])/g, "").toLowerCase()),
      );

      return {
        isIslamicFunction: isIslamic,
        confidence: isIslamic ? 95 : 0,
      };
    }

    return {
      isIslamicFunction: false,
      confidence: 0,
    };
  }

  private analyzeCulturalImports(
    source: string,
    path: any,
  ): {
    isCultural: boolean;
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    const culturalLibraries = {
      "react-i18next": { relevance: 90, compliance: 95 },
      "next-intl": { relevance: 85, compliance: 90 },
      "moment-hijri": { relevance: 100, compliance: 100 },
      "islamic-calendar": { relevance: 100, compliance: 100 },
      "prayer-times": { relevance: 100, compliance: 100 },
      "arabic-names": { relevance: 95, compliance: 95 },
      "rtl-css": { relevance: 90, compliance: 85 },
      "bidi-js": { relevance: 80, compliance: 80 },
    };

    const matchedLibrary = Object.keys(culturalLibraries).find((lib) =>
      source.includes(lib),
    );

    if (matchedLibrary) {
      const libInfo =
        culturalLibraries[matchedLibrary as keyof typeof culturalLibraries];
      return {
        isCultural: true,
        confidence: 95,
        compliance: libInfo.compliance,
        culturalRelevance: libInfo.relevance,
        suggestions: [
          "Ensure proper configuration for Iraqi context",
          "Test with Arabic content thoroughly",
          "Validate Islamic calendar integration",
        ],
      };
    }

    return {
      isCultural: false,
      confidence: 0,
      compliance: 100,
      culturalRelevance: 0,
      suggestions: [],
    };
  }

  private getSourceLocation(path: any): any {
    return {
      file: "current",
      line: path.node.loc?.start.line || 0,
      column: path.node.loc?.start.column || 0,
      length: path.node.end - path.node.start || 0,
    };
  }
}
