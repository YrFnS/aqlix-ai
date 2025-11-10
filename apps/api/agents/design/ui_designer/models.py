"""UI Designer Models"""

from typing import List, Dict
from pydantic import BaseModel, Field


class ColorPalette(BaseModel):
    """Iraqi-appropriate color palette."""

    primary: str = Field(description="Primary brand color")
    secondary: str = Field(description="Secondary color")
    accent: str = Field(description="Accent color")
    background: str = Field(description="Background color")
    text: str = Field(description="Text color")
    islamic_compliant: bool = Field(
        description="Whether colors respect Islamic principles"
    )


class DesignSpec(BaseModel):
    """UI design specification for Iraqi market."""

    component_name: str
    design_system: str = "Iraqi-Enhanced Design System"
    color_palette: ColorPalette
    typography: Dict[str, str] = Field(default_factory=dict)
    rtl_layout: bool = True
    cultural_notes: List[str] = Field(default_factory=list)
