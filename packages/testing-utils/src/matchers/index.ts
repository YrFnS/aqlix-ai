/**
 * Custom test matchers for cultural and Arabic validation
 * Extends Bun test framework with Iraqi-specific matchers
 */

// Arabic text matchers
export * from "./toBeArabicText";

// RTL layout matchers
export * from "./toBeRTLAligned";

// Cultural appropriateness matchers
export * from "./toBeCulturallyAppropriate";

// Islamic compliance matchers
export * from "./toBeIslamicallyCompliant";

// Iraqi dialect matchers
export * from "./toMatchIraqiDialect";

// Import all matchers to ensure they're registered with expect
import "./toBeArabicText";
import "./toBeRTLAligned";
import "./toBeCulturallyAppropriate";
import "./toBeIslamicallyCompliant";
import "./toMatchIraqiDialect";
