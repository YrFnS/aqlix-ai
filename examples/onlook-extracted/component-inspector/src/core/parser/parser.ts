import * as babel from "@babel/core";
import { parse as babelParse } from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as t from "@babel/types";
import * as cheerio from "cheerio";
import { readFileSync } from "fs";
import { extname } from "path";

import { Logger } from "../../utils/logger";
import type {
  ComponentInspectorConfig,
  ComponentInfo,
  ComponentType,
  ASTNode,
  DOMElementInfo,
  CulturalContext,
} from "../../types";

/**
 * ComponentParser - Advanced component parsing with cultural intelligence
 *
 * Provides comprehensive parsing for:
 * - React/Vue/Angular components with cultural context
 * - TypeScript/JavaScript with Islamic design patterns
 * - HTML/JSX with RTL support
 * - CSS with Arabic typography
 */
export class ComponentParser {
  private logger: Logger;

  constructor(private config: ComponentInspectorConfig) {
    this.logger = new Logger("ComponentParser", config);
  }

  /**
   * Parse component from file path
   */
  async parseFromFile(filePath: string) {
    this.logger.info("Parsing component from file", { filePath });

    try {
      const content = readFileSync(filePath, "utf-8");
      const ext = extname(filePath);

      return this.parseContent(content, filePath, ext);
    } catch (error) {
      this.logger.error("Failed to parse file", { filePath, error });
      throw error;
    }
  }

  /**
   * Parse component from content string
   */
  async parseFromContent(content: string, filePath?: string) {
    this.logger.info("Parsing component from content");

    const ext = this.detectFileType(content);
    return this.parseContent(content, filePath || "inline", ext);
  }

  /**
   * Parse component from DOM element
   */
  async parseFromElement(element: HTMLElement) {
    this.logger.info("Parsing component from DOM element", {
      tagName: element.tagName,
    });

    const $ = cheerio.load(element.outerHTML);
    const domInfo = this.extractDOMInfo($(element.tagName).first(), $);

    return {
      ast: null,
      dom: domInfo,
      info: this.generateComponentInfo("dom-element", "html", domInfo),
    };
  }

  private async parseContent(content: string, filePath: string, ext: string) {
    const startTime = Date.now();

    // Parse AST based on file type
    let ast: ASTNode | null = null;

    if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
      ast = this.parseJavaScriptAST(
        content,
        ext.includes("tsx") || ext.includes("jsx"),
      );
    } else if ([".vue"].includes(ext)) {
      ast = this.parseVueComponent(content);
    }

    // Extract DOM information if HTML/JSX present
    const domInfo = this.extractDOMFromContent(content, ext);

    // Generate component information
    const info = this.generateComponentInfo(filePath, ext, domInfo, ast);

    // Add cultural context
    if (ast) {
      this.addCulturalContext(ast, content);
    }

    const duration = Date.now() - startTime;
    this.logger.info("Parsing completed", { filePath, duration });

    return {
      ast,
      dom: domInfo,
      info,
    };
  }

  private parseJavaScriptAST(content: string, isJSX: boolean): ASTNode | null {
    try {
      const plugins: any[] = [
        "typescript",
        "decorators-legacy",
        "classProperties",
        "objectRestSpread",
        "asyncGenerators",
        "dynamicImport",
      ];

      if (isJSX) {
        plugins.push("jsx");
      }

      const ast = babelParse(content, {
        sourceType: "module",
        plugins,
      }) as ASTNode;

      return ast;
    } catch (error) {
      this.logger.warn("Failed to parse JavaScript AST", { error });
      return null;
    }
  }

  private parseVueComponent(content: string): ASTNode | null {
    try {
      // Extract script section from Vue SFC
      const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      if (!scriptMatch) return null;

      const scriptContent = scriptMatch[1];
      return this.parseJavaScriptAST(scriptContent, false);
    } catch (error) {
      this.logger.warn("Failed to parse Vue component", { error });
      return null;
    }
  }

  private extractDOMFromContent(
    content: string,
    ext: string,
  ): DOMElementInfo | null {
    try {
      if (ext === ".html") {
        const $ = cheerio.load(content);
        return this.extractDOMInfo($("body").first(), $);
      } else if ([".jsx", ".tsx"].includes(ext)) {
        // Extract JSX from React component
        const jsxMatch =
          content.match(/return\s*\(([\s\S]*?)\);?\s*}/) ||
          content.match(/=>\s*\(([\s\S]*?)\)/);

        if (jsxMatch) {
          const $ = cheerio.load(`<div>${jsxMatch[1]}</div>`);
          return this.extractDOMInfo($("div").first(), $);
        }
      } else if (ext === ".vue") {
        // Extract template from Vue SFC
        const templateMatch = content.match(
          /<template[^>]*>([\s\S]*?)<\/template>/,
        );
        if (templateMatch) {
          const $ = cheerio.load(templateMatch[1]);
          return this.extractDOMInfo($.root().children().first(), $);
        }
      }
    } catch (error) {
      this.logger.warn("Failed to extract DOM info", { error });
    }

    return null;
  }

  private extractDOMInfo(
    element: cheerio.Cheerio,
    $: cheerio.CheerioAPI,
  ): DOMElementInfo {
    const tagName = element.prop("tagName")?.toLowerCase() || "div";
    const attributes: Record<string, string> = {};

    // Extract attributes
    if (element[0]) {
      const attrs = element[0].attribs || {};
      Object.keys(attrs).forEach((key) => {
        attributes[key] = attrs[key];
      });
    }

    // Extract styles
    const styles = this.extractComputedStyles(element);

    // Extract children
    const children: DOMElementInfo[] = [];
    element.children().each((_, child) => {
      const $child = $(child);
      if ($child.prop("tagName")) {
        children.push(this.extractDOMInfo($child, $));
      }
    });

    // Analyze cultural metadata
    const culturalMetadata = this.analyzeCulturalMetadata(element, attributes);

    // Extract accessibility info
    const accessibilityInfo = this.extractAccessibilityInfo(attributes);

    return {
      tagName,
      attributes,
      styles,
      children,
      culturalMetadata,
      accessibilityInfo,
    };
  }

  private extractComputedStyles(element: cheerio.Cheerio): any {
    const styles: any = {};

    // Extract inline styles
    const styleAttr = element.attr("style");
    if (styleAttr) {
      styleAttr.split(";").forEach((rule) => {
        const [property, value] = rule.split(":").map((s) => s.trim());
        if (property && value) {
          styles[property] = value;
        }
      });
    }

    // Extract class-based styles (basic inference)
    const className = element.attr("class");
    if (className) {
      // Infer RTL/LTR direction from classes
      if (className.includes("rtl") || className.includes("text-right")) {
        styles.direction = "rtl";
      } else if (className.includes("ltr") || className.includes("text-left")) {
        styles.direction = "ltr";
      }

      // Infer Arabic font from classes
      if (
        className.includes("font-arabic") ||
        className.includes("arabic-font")
      ) {
        styles.fontFamily = "Noto Sans Arabic, Cairo, Amiri";
      }
    }

    return styles;
  }

  private analyzeCulturalMetadata(
    element: cheerio.Cheerio,
    attributes: Record<string, string>,
  ): any {
    const text = element.text();
    const culturalTags: string[] = [];

    // Detect Arabic text
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    const hasArabicText = arabicRegex.test(text);

    if (hasArabicText) {
      culturalTags.push("arabic-content");
    }

    // Detect RTL attributes
    if (attributes.dir === "rtl" || attributes.direction === "rtl") {
      culturalTags.push("rtl-layout");
    }

    // Detect government/ministry classes
    const className = attributes.class || "";
    if (className.includes("ministry") || className.includes("government")) {
      culturalTags.push("government-component");
    }

    // Detect Islamic cultural elements
    if (className.includes("halal") || className.includes("islamic")) {
      culturalTags.push("islamic-compliant");
    }

    return {
      language: hasArabicText ? "ar" : "en",
      script: hasArabicText ? "arab" : "latn",
      textDirection: attributes.dir || (hasArabicText ? "rtl" : "ltr"),
      culturalTags,
    };
  }

  private extractAccessibilityInfo(attributes: Record<string, string>): any {
    return {
      role: attributes.role || "",
      ariaLabel: attributes["aria-label"],
      ariaDescribedBy: attributes["aria-describedby"],
      tabIndex: parseInt(attributes.tabindex || "0"),
      focusable: attributes.tabindex !== "-1",
    };
  }

  private generateComponentInfo(
    filePath: string,
    ext: string,
    domInfo: DOMElementInfo | null,
    ast?: ASTNode | null,
  ): ComponentInfo {
    const name = this.extractComponentName(filePath, ast);
    const type = this.detectComponentType(ast, domInfo);
    const framework = this.detectFramework(ext, filePath);

    return {
      name,
      path: filePath,
      type,
      framework,
      size: {
        loc: this.calculateLOC(ast),
        bundleSize: 0, // Will be calculated by performance profiler
        memoryFootprint: 0,
      },
      dependencies: this.extractDependencies(ast),
      exports: this.extractExports(ast),
    };
  }

  private extractComponentName(filePath: string, ast?: ASTNode | null): string {
    // Try to extract from AST first
    if (ast && ast.type === "File" && ast.program) {
      let componentName = "";

      traverse(ast, {
        FunctionDeclaration(path) {
          if (
            path.node.id?.name &&
            this.isComponentFunction(path.node.id.name)
          ) {
            componentName = path.node.id.name;
          }
        },
        VariableDeclarator(path) {
          if (
            t.isIdentifier(path.node.id) &&
            this.isComponentFunction(path.node.id.name)
          ) {
            componentName = path.node.id.name;
          }
        },
        ExportDefaultDeclaration(path) {
          if (
            t.isFunctionDeclaration(path.node.declaration) &&
            path.node.declaration.id
          ) {
            componentName = path.node.declaration.id.name;
          }
        },
      });

      if (componentName) return componentName;
    }

    // Fallback to filename
    const filename = filePath.split("/").pop()?.split(".")[0] || "Unknown";
    return filename.charAt(0).toUpperCase() + filename.slice(1);
  }

  private isComponentFunction(name: string): boolean {
    // React components start with uppercase
    return /^[A-Z]/.test(name);
  }

  private detectComponentType(
    ast?: ASTNode | null,
    domInfo?: DOMElementInfo | null,
  ): ComponentType {
    if (!ast) return "widget";

    let isClass = false;
    let isHook = false;
    let isProvider = false;
    let isHOC = false;

    traverse(ast, {
      ClassDeclaration(path) {
        if (path.node.superClass) {
          isClass = true;
        }
      },
      FunctionDeclaration(path) {
        const name = path.node.id?.name || "";
        if (name.startsWith("use") && name.length > 3) {
          isHook = true;
        } else if (name.includes("Provider")) {
          isProvider = true;
        }
      },
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee) &&
          ["withRouter", "connect", "withAuth"].includes(path.node.callee.name)
        ) {
          isHOC = true;
        }
      },
    });

    if (isClass) return "class";
    if (isHook) return "hook";
    if (isProvider) return "provider";
    if (isHOC) return "hoc";

    // Check if it's a page or layout based on DOM structure
    if (domInfo) {
      const hasPageStructure = this.hasPageStructure(domInfo);
      const hasLayoutStructure = this.hasLayoutStructure(domInfo);

      if (hasPageStructure) return "page";
      if (hasLayoutStructure) return "layout";
    }

    return "functional";
  }

  private hasPageStructure(domInfo: DOMElementInfo): boolean {
    const pageIndicators = ["main", "article", "section"];
    return (
      pageIndicators.includes(domInfo.tagName) ||
      domInfo.children.some((child) => pageIndicators.includes(child.tagName))
    );
  }

  private hasLayoutStructure(domInfo: DOMElementInfo): boolean {
    const layoutIndicators = ["header", "nav", "aside", "footer"];
    return domInfo.children.some((child) =>
      layoutIndicators.includes(child.tagName),
    );
  }

  private detectFramework(
    ext: string,
    filePath: string,
  ): "react" | "vue" | "angular" | "svelte" {
    if (ext === ".vue") return "vue";
    if (ext === ".svelte") return "svelte";
    if (filePath.includes("angular") || filePath.includes(".component.ts"))
      return "angular";
    return "react"; // Default assumption for .tsx/.jsx files
  }

  private calculateLOC(ast?: ASTNode | null): number {
    if (!ast) return 0;

    let lineCount = 0;
    traverse(ast, {
      enter(path) {
        if (path.node.loc) {
          lineCount = Math.max(lineCount, path.node.loc.end.line);
        }
      },
    });

    return lineCount;
  }

  private extractDependencies(ast?: ASTNode | null): any[] {
    if (!ast) return [];

    const dependencies: any[] = [];

    traverse(ast, {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        dependencies.push({
          name: source,
          version: "unknown",
          type: "runtime" as const,
          culturalRelevance: this.isCulturallyRelevant(source),
        });
      },
    });

    return dependencies;
  }

  private extractExports(ast?: ASTNode | null): any[] {
    if (!ast) return [];

    const exports: any[] = [];

    traverse(ast, {
      ExportDefaultDeclaration(path) {
        if (
          t.isFunctionDeclaration(path.node.declaration) &&
          path.node.declaration.id
        ) {
          exports.push({
            name: path.node.declaration.id.name,
            type: "default" as const,
          });
        }
      },
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          if (
            t.isFunctionDeclaration(path.node.declaration) &&
            path.node.declaration.id
          ) {
            exports.push({
              name: path.node.declaration.id.name,
              type: "named" as const,
            });
          }
        }
      },
    });

    return exports;
  }

  private isCulturallyRelevant(moduleName: string): boolean {
    const culturalModules = [
      "react-i18next",
      "next-intl",
      "intl",
      "moment-hijri",
      "arabic-names",
      "rtl-css",
      "bidi-js",
    ];

    return culturalModules.some((mod) => moduleName.includes(mod));
  }

  private addCulturalContext(ast: ASTNode, content: string) {
    // Add cultural context to relevant nodes
    traverse(ast, {
      StringLiteral(path) {
        const value = path.node.value;
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

        if (arabicRegex.test(value)) {
          (path.node as any).culturalContext = {
            language: "ar",
            direction: "rtl",
            islamicCompliance: this.checkIslamicCompliance(value),
            governmentRelevance: this.checkGovernmentRelevance(value),
          };
        }
      },
      JSXText(path) {
        const value = path.node.value;
        const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

        if (arabicRegex.test(value)) {
          (path.node as any).culturalContext = {
            language: "ar",
            direction: "rtl",
            islamicCompliance: this.checkIslamicCompliance(value),
            governmentRelevance: this.checkGovernmentRelevance(value),
          };
        }
      },
    });
  }

  private checkIslamicCompliance(text: string): boolean {
    // Basic Islamic compliance check
    const islamicTerms = [
      "الله",
      "محمد",
      "القرآن",
      "الإسلام",
      "المسجد",
      "الصلاة",
    ];
    const inappropriateTerms = ["خمر", "قمار", "ربا"];

    const hasIslamicTerms = islamicTerms.some((term) => text.includes(term));
    const hasInappropriateTerms = inappropriateTerms.some((term) =>
      text.includes(term),
    );

    return hasIslamicTerms || !hasInappropriateTerms;
  }

  private checkGovernmentRelevance(text: string): boolean {
    const governmentTerms = [
      "وزارة",
      "حكومة",
      "دولة",
      "مواطن",
      "خدمات",
      "هوية",
      "جواز",
      "رخصة",
      "شهادة",
    ];

    return governmentTerms.some((term) => text.includes(term));
  }

  private detectFileType(content: string): string {
    if (content.includes("import React") || content.includes('from "react"')) {
      return content.includes("<") ? ".jsx" : ".js";
    }
    if (content.includes("<template>")) return ".vue";
    if (content.includes("<!DOCTYPE html>")) return ".html";

    return ".js";
  }
}
