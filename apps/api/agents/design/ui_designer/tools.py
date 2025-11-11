"""UI Designer Tools"""

from apps.api.agents.design.ui_designer.models import ColorPalette


class UIDesignerTools:
    """Tools for Iraqi UI design."""

    IRAQI_COLOR_PALETTES = {
        "professional_light": ColorPalette(
            primary="#2563EB",  # Professional blue
            secondary="#059669",  # Success green
            accent="#D97706",  # Warm amber
            background="#FFFFFF",
            text="#1F2937",
            islamic_compliant=True,
        ),
        "professional_dark": ColorPalette(
            primary="#3B82F6",
            secondary="#10B981",
            accent="#F59E0B",
            background="#111827",
            text="#F9FAFB",
            islamic_compliant=True,
        ),
    }

    @staticmethod
    def get_arabic_fonts() -> list:
        """Get recommended Arabic fonts."""
        return [
            "Cairo",  # Modern, professional
            "Noto Sans Arabic",  # Google font, excellent readability
            "IBM Plex Sans Arabic",  # IBM's Arabic font
            "Tajawal",  # Clean, modern
        ]

    @staticmethod
    def get_rtl_css_utilities() -> dict:
        """Get RTL CSS utility classes."""
        return {
            "text-rtl": "direction: rtl; text-align: right;",
            "text-ltr": "direction: ltr; text-align: left;",
            "font-arabic": "font-family: 'Cairo', 'Noto Sans Arabic', sans-serif;",
            "flex-rtl": "flex-direction: row-reverse;",
        }
