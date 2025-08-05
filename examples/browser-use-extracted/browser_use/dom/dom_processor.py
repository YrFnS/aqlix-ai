"""
DOM Processor - Core web page interaction and parsing
Extracted from browser-use with Iraqi portal enhancements
"""

import logging
import json
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Union, Tuple
from enum import Enum
from bs4 import BeautifulSoup, Tag
from playwright.async_api import Page, ElementHandle

logger = logging.getLogger(__name__)


class ElementType(Enum):
    """Types of DOM elements"""
    INPUT = "input"
    BUTTON = "button"
    LINK = "link"
    TEXT = "text"
    IMAGE = "image"
    FORM = "form"
    TABLE = "table"
    LIST = "list"
    DROPDOWN = "dropdown"


@dataclass
class ElementInfo:
    """Information about a DOM element"""
    tag_name: str
    element_type: ElementType
    text: str = ""
    attributes: Dict[str, str] = field(default_factory=dict)
    selector: str = ""
    xpath: str = ""
    position: Tuple[int, int] = (0, 0)
    size: Tuple[int, int] = (0, 0)
    is_visible: bool = True
    is_clickable: bool = False
    is_arabic: bool = False
    is_rtl: bool = False


@dataclass
class FormInfo:
    """Information about a form"""
    form_selector: str
    action: str = ""
    method: str = "GET"
    fields: List[ElementInfo] = field(default_factory=list)
    submit_button: Optional[ElementInfo] = None
    is_iraqi_form: bool = False
    required_fields: List[str] = field(default_factory=list)


class DOMProcessor:
    """
    Core DOM processing engine with Iraqi portal support
    Handles intelligent web page interaction and parsing
    """
    
    def __init__(self, page: Page = None):
        self.page = page
        self.soup = None
        self.iraqi_patterns = self._load_iraqi_patterns()
        self.arabic_detector = self._setup_arabic_detector()
        
    async def analyze_page(self, html_content: str = None) -> Dict[str, Any]:
        """Analyze page structure and content"""
        try:
            if html_content:
                self.soup = BeautifulSoup(html_content, 'html.parser')
            elif self.page:
                content = await self.page.content()
                self.soup = BeautifulSoup(content, 'html.parser')
            else:
                raise ValueError("No page or HTML content provided")
            
            analysis = {
                "title": self._get_page_title(),
                "language": self._detect_language(),
                "direction": self._detect_text_direction(),
                "is_government_portal": self._is_government_portal(),
                "forms": await self._analyze_forms(),
                "interactive_elements": await self._analyze_interactive_elements(),
                "links": self._analyze_links(),
                "images": self._analyze_images(),
                "tables": self._analyze_tables(),
                "arabic_content": self._analyze_arabic_content(),
                "structure": self._analyze_page_structure()
            }
            
            logger.info("Page analysis completed")
            return analysis
            
        except Exception as e:
            logger.error(f"Page analysis failed: {e}")
            raise
    
    async def find_elements(self, criteria: Dict[str, Any]) -> List[ElementInfo]:
        """Find elements based on criteria"""
        elements = []
        
        try:
            # Build selector based on criteria
            selector = self._build_selector(criteria)
            
            if self.page:
                # Use Playwright for live elements
                playwright_elements = await self.page.query_selector_all(selector)
                
                for elem in playwright_elements:
                    element_info = await self._extract_element_info(elem)
                    elements.append(element_info)
            else:
                # Use BeautifulSoup for static analysis
                soup_elements = self.soup.select(selector)
                
                for elem in soup_elements:
                    element_info = self._extract_element_info_from_soup(elem)
                    elements.append(element_info)
            
            logger.info(f"Found {len(elements)} elements matching criteria")
            return elements
            
        except Exception as e:
            logger.error(f"Element search failed: {e}")
            return []
    
    async def find_best_element(self, criteria: Dict[str, Any]) -> Optional[ElementInfo]:
        """Find the best matching element based on criteria"""
        elements = await self.find_elements(criteria)
        
        if not elements:
            return None
        
        # Score elements based on criteria
        scored_elements = []
        for element in elements:
            score = self._score_element(element, criteria)
            scored_elements.append((score, element))
        
        # Return highest scoring element
        scored_elements.sort(key=lambda x: x[0], reverse=True)
        return scored_elements[0][1]
    
    async def extract_form_data(self, form_selector: str = "form") -> FormInfo:
        """Extract comprehensive form information"""
        try:
            if self.page:
                form_element = await self.page.query_selector(form_selector)
                if not form_element:
                    raise ValueError(f"Form not found: {form_selector}")
                
                form_info = await self._extract_form_info(form_element)
            else:
                form_element = self.soup.select_one(form_selector)
                if not form_element:
                    raise ValueError(f"Form not found: {form_selector}")
                
                form_info = self._extract_form_info_from_soup(form_element)
            
            # Enhance with Iraqi portal detection
            form_info.is_iraqi_form = self._is_iraqi_form(form_info)
            if form_info.is_iraqi_form:
                form_info.required_fields = self._detect_iraqi_required_fields(form_info)
            
            logger.info(f"Extracted form data: {len(form_info.fields)} fields")
            return form_info
            
        except Exception as e:
            logger.error(f"Form data extraction failed: {e}")
            raise
    
    async def get_element_text(self, selector: str) -> str:
        """Get text content from element with Arabic support"""
        try:
            if self.page:
                element = await self.page.query_selector(selector)
                if element:
                    text = await element.text_content()
                else:
                    return ""
            else:
                element = self.soup.select_one(selector)
                text = element.get_text(strip=True) if element else ""
            
            # Normalize Arabic text
            if self._contains_arabic(text):
                text = self._normalize_arabic_text(text)
            
            return text
            
        except Exception as e:
            logger.error(f"Failed to get element text: {e}")
            return ""
    
    async def get_element_attributes(self, selector: str) -> Dict[str, str]:
        """Get element attributes"""
        try:
            if self.page:
                element = await self.page.query_selector(selector)
                if element:
                    # Get all attributes from Playwright element
                    attributes = {}
                    for attr in ['id', 'class', 'name', 'type', 'value', 'placeholder', 'title']:
                        value = await element.get_attribute(attr)
                        if value:
                            attributes[attr] = value
                    return attributes
            else:
                element = self.soup.select_one(selector)
                if element:
                    return dict(element.attrs)
            
            return {}
            
        except Exception as e:
            logger.error(f"Failed to get element attributes: {e}")
            return {}
    
    def _get_page_title(self) -> str:
        """Get page title"""
        title_elem = self.soup.find('title')
        return title_elem.get_text(strip=True) if title_elem else ""
    
    def _detect_language(self) -> str:
        """Detect page language"""
        # Check html lang attribute
        html_elem = self.soup.find('html')
        if html_elem and html_elem.get('lang'):
            return html_elem.get('lang')
        
        # Check for Arabic content
        page_text = self.soup.get_text()
        if self._contains_arabic(page_text):
            return 'ar'
        
        return 'en'
    
    def _detect_text_direction(self) -> str:
        """Detect text direction (LTR/RTL)"""
        # Check html dir attribute
        html_elem = self.soup.find('html')
        if html_elem and html_elem.get('dir'):
            return html_elem.get('dir')
        
        # Check body dir attribute
        body_elem = self.soup.find('body')
        if body_elem and body_elem.get('dir'):
            return body_elem.get('dir')
        
        # Detect based on Arabic content
        page_text = self.soup.get_text()
        if self._contains_arabic(page_text):
            return 'rtl'
        
        return 'ltr'
    
    def _is_government_portal(self) -> bool:
        """Detect if this is an Iraqi government portal"""
        indicators = [
            '.gov.iq', '.edu.iq', '.org.iq',
            'ministry', 'passport', 'government',
            'وزارة', 'حكومة', 'جواز'
        ]
        
        page_content = self.soup.get_text().lower()
        title = self._get_page_title().lower()
        
        return any(indicator in page_content or indicator in title 
                  for indicator in indicators)
    
    async def _analyze_forms(self) -> List[FormInfo]:
        """Analyze all forms on the page"""
        forms = []
        form_elements = self.soup.find_all('form')
        
        for i, form_elem in enumerate(form_elements):
            try:
                if self.page:
                    # Get live form element
                    form_selector = f"form:nth-of-type({i+1})"
                    playwright_form = await self.page.query_selector(form_selector)
                    if playwright_form:
                        form_info = await self._extract_form_info(playwright_form)
                    else:
                        form_info = self._extract_form_info_from_soup(form_elem)
                else:
                    form_info = self._extract_form_info_from_soup(form_elem)
                
                forms.append(form_info)
                
            except Exception as e:
                logger.warning(f"Failed to analyze form {i}: {e}")
        
        return forms
    
    async def _analyze_interactive_elements(self) -> List[ElementInfo]:
        """Analyze interactive elements (buttons, inputs, links)"""
        elements = []
        
        interactive_selectors = [
            'button', 'input[type="button"]', 'input[type="submit"]',
            'a[href]', 'input[type="text"]', 'input[type="email"]',
            'input[type="password"]', 'textarea', 'select'
        ]
        
        for selector in interactive_selectors:
            if self.page:
                playwright_elements = await self.page.query_selector_all(selector)
                for elem in playwright_elements:
                    element_info = await self._extract_element_info(elem)
                    elements.append(element_info)
            else:
                soup_elements = self.soup.select(selector)
                for elem in soup_elements:
                    element_info = self._extract_element_info_from_soup(elem)
                    elements.append(element_info)
        
        return elements
    
    def _analyze_links(self) -> List[Dict[str, str]]:
        """Analyze all links on the page"""
        links = []
        link_elements = self.soup.find_all('a', href=True)
        
        for link in link_elements:
            links.append({
                'text': link.get_text(strip=True),
                'href': link.get('href'),
                'title': link.get('title', ''),
                'is_external': self._is_external_link(link.get('href')),
                'is_arabic': self._contains_arabic(link.get_text())
            })
        
        return links
    
    def _analyze_images(self) -> List[Dict[str, str]]:
        """Analyze all images on the page"""
        images = []
        img_elements = self.soup.find_all('img')
        
        for img in img_elements:
            images.append({
                'src': img.get('src', ''),
                'alt': img.get('alt', ''),
                'title': img.get('title', ''),
                'width': img.get('width', ''),
                'height': img.get('height', ''),
                'is_arabic_alt': self._contains_arabic(img.get('alt', ''))
            })
        
        return images
    
    def _analyze_tables(self) -> List[Dict[str, Any]]:
        """Analyze tables on the page"""
        tables = []
        table_elements = self.soup.find_all('table')
        
        for i, table in enumerate(table_elements):
            headers = [th.get_text(strip=True) for th in table.find_all('th')]
            rows = []
            
            for tr in table.find_all('tr'):
                cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                if cells:
                    rows.append(cells)
            
            tables.append({
                'index': i,
                'headers': headers,
                'rows': rows,
                'row_count': len(rows),
                'has_arabic': any(self._contains_arabic(header) for header in headers)
            })
        
        return tables
    
    def _analyze_arabic_content(self) -> Dict[str, Any]:
        """Analyze Arabic content on the page"""
        page_text = self.soup.get_text()
        
        return {
            'has_arabic': self._contains_arabic(page_text),
            'arabic_percentage': self._calculate_arabic_percentage(page_text),
            'direction': self._detect_text_direction(),
            'arabic_elements': self._count_arabic_elements(),
            'rtl_elements': self._count_rtl_elements()
        }
    
    def _analyze_page_structure(self) -> Dict[str, Any]:
        """Analyze overall page structure"""
        return {
            'has_header': bool(self.soup.find(['header', '.header', '#header'])),
            'has_footer': bool(self.soup.find(['footer', '.footer', '#footer'])),
            'has_navigation': bool(self.soup.find(['nav', '.nav', '.navigation'])),
            'has_sidebar': bool(self.soup.find(['.sidebar', '.side-nav', 'aside'])),
            'main_content': bool(self.soup.find(['main', '.main', '.content', '#content'])),
            'form_count': len(self.soup.find_all('form')),
            'image_count': len(self.soup.find_all('img')),
            'link_count': len(self.soup.find_all('a', href=True)),
            'semantic_structure': self._analyze_semantic_structure()
        }
    
    def _build_selector(self, criteria: Dict[str, Any]) -> str:
        """Build CSS selector from criteria"""
        selectors = []
        
        if 'tag' in criteria:
            selectors.append(criteria['tag'])
        
        if 'type' in criteria:
            selectors.append(f"[type='{criteria['type']}']")
        
        if 'id' in criteria:
            selectors.append(f"#{criteria['id']}")
        
        if 'class' in criteria:
            selectors.append(f".{criteria['class']}")
        
        if 'text' in criteria:
            # For text content, we'll need to filter after selection
            pass
        
        if 'attributes' in criteria:
            for attr, value in criteria['attributes'].items():
                selectors.append(f"[{attr}='{value}']")
        
        return ''.join(selectors) if selectors else '*'
    
    async def _extract_element_info(self, element: ElementHandle) -> ElementInfo:
        """Extract information from Playwright element"""
        tag_name = await element.evaluate("el => el.tagName.toLowerCase()")
        text = await element.text_content() or ""
        
        # Get attributes
        attributes = {}
        for attr in ['id', 'class', 'name', 'type', 'value', 'placeholder', 'title', 'href']:
            value = await element.get_attribute(attr)
            if value:
                attributes[attr] = value
        
        # Get position and size
        box = await element.bounding_box()
        position = (int(box['x']), int(box['y'])) if box else (0, 0)
        size = (int(box['width']), int(box['height'])) if box else (0, 0)
        
        # Check visibility and clickability
        is_visible = await element.is_visible()
        is_clickable = await element.is_enabled() and is_visible
        
        # Detect element type
        element_type = self._determine_element_type(tag_name, attributes)
        
        # Check for Arabic content
        is_arabic = self._contains_arabic(text)
        is_rtl = is_arabic or 'rtl' in attributes.get('dir', '').lower()
        
        return ElementInfo(
            tag_name=tag_name,
            element_type=element_type,
            text=text,
            attributes=attributes,
            position=position,
            size=size,
            is_visible=is_visible,
            is_clickable=is_clickable,
            is_arabic=is_arabic,
            is_rtl=is_rtl
        )
    
    def _extract_element_info_from_soup(self, element: Tag) -> ElementInfo:
        """Extract information from BeautifulSoup element"""
        tag_name = element.name
        text = element.get_text(strip=True)
        attributes = dict(element.attrs)
        
        # Determine element type
        element_type = self._determine_element_type(tag_name, attributes)
        
        # Check for Arabic content
        is_arabic = self._contains_arabic(text)
        is_rtl = is_arabic or 'rtl' in attributes.get('dir', '').lower()
        
        return ElementInfo(
            tag_name=tag_name,
            element_type=element_type,
            text=text,
            attributes=attributes,
            is_arabic=is_arabic,
            is_rtl=is_rtl
        )
    
    def _determine_element_type(self, tag_name: str, attributes: Dict[str, str]) -> ElementType:
        """Determine the type of element"""
        if tag_name == 'input':
            input_type = attributes.get('type', 'text')
            if input_type in ['button', 'submit']:
                return ElementType.BUTTON
            else:
                return ElementType.INPUT
        elif tag_name == 'button':
            return ElementType.BUTTON
        elif tag_name == 'a':
            return ElementType.LINK
        elif tag_name == 'img':
            return ElementType.IMAGE
        elif tag_name == 'form':
            return ElementType.FORM
        elif tag_name == 'table':
            return ElementType.TABLE
        elif tag_name == 'select':
            return ElementType.DROPDOWN
        elif tag_name in ['ul', 'ol']:
            return ElementType.LIST
        else:
            return ElementType.TEXT
    
    async def _extract_form_info(self, form_element: ElementHandle) -> FormInfo:
        """Extract form information from Playwright element"""
        action = await form_element.get_attribute('action') or ""
        method = await form_element.get_attribute('method') or "GET"
        
        # Find all form fields
        fields = []
        field_selectors = ['input', 'textarea', 'select']
        
        for selector in field_selectors:
            field_elements = await form_element.query_selector_all(selector)
            for field_elem in field_elements:
                field_info = await self._extract_element_info(field_elem)
                fields.append(field_info)
        
        # Find submit button
        submit_button = None
        submit_selectors = [
            'input[type="submit"]', 
            'button[type="submit"]', 
            'button:not([type])'
        ]
        
        for selector in submit_selectors:
            button_elem = await form_element.query_selector(selector)
            if button_elem:
                submit_button = await self._extract_element_info(button_elem)
                break
        
        return FormInfo(
            form_selector="form",  # Will be updated by caller
            action=action,
            method=method.upper(),
            fields=fields,
            submit_button=submit_button
        )
    
    def _extract_form_info_from_soup(self, form_element: Tag) -> FormInfo:
        """Extract form information from BeautifulSoup element"""
        action = form_element.get('action', '')
        method = form_element.get('method', 'GET').upper()
        
        # Find all form fields
        fields = []
        field_elements = form_element.find_all(['input', 'textarea', 'select'])
        
        for field_elem in field_elements:
            field_info = self._extract_element_info_from_soup(field_elem)
            fields.append(field_info)
        
        # Find submit button
        submit_button = None
        submit_elem = form_element.find(['input[type="submit"]', 'button[type="submit"]', 'button'])
        if submit_elem:
            submit_button = self._extract_element_info_from_soup(submit_elem)
        
        return FormInfo(
            form_selector="form",
            action=action,
            method=method,
            fields=fields,
            submit_button=submit_button
        )
    
    def _score_element(self, element: ElementInfo, criteria: Dict[str, Any]) -> float:
        """Score element based on how well it matches criteria"""
        score = 0.0
        
        # Text matching
        if 'text' in criteria:
            if criteria['text'].lower() in element.text.lower():
                score += 3.0
        
        # Attribute matching
        if 'attributes' in criteria:
            for attr, value in criteria['attributes'].items():
                if attr in element.attributes and element.attributes[attr] == value:
                    score += 2.0
        
        # Type matching
        if 'type' in criteria:
            element_type_name = criteria['type']
            if hasattr(ElementType, element_type_name.upper()):
                expected_type = ElementType[element_type_name.upper()]
                if element.element_type == expected_type:
                    score += 2.0
        
        # Visibility and clickability
        if element.is_visible:
            score += 1.0
        if element.is_clickable:
            score += 1.0
        
        # Arabic content preference
        if 'prefer_arabic' in criteria and criteria['prefer_arabic']:
            if element.is_arabic:
                score += 1.0
        
        return score
    
    def _is_iraqi_form(self, form_info: FormInfo) -> bool:
        """Detect if form is an Iraqi government form"""
        iraqi_indicators = [
            'passport', 'جواز', 'national_id', 'هوية',
            'ministry', 'وزارة', 'government', 'حكومة'
        ]
        
        form_text = form_info.action + " ".join(field.text for field in form_info.fields)
        
        return any(indicator in form_text.lower() for indicator in iraqi_indicators)
    
    def _detect_iraqi_required_fields(self, form_info: FormInfo) -> List[str]:
        """Detect required fields in Iraqi forms"""
        required = []
        
        for field in form_info.fields:
            # Check for required attribute
            if 'required' in field.attributes:
                required.append(field.attributes.get('name', ''))
            
            # Check for Iraqi-specific required field patterns
            field_name = field.attributes.get('name', '').lower()
            placeholder = field.attributes.get('placeholder', '').lower()
            
            if any(pattern in field_name or pattern in placeholder 
                   for pattern in ['passport', 'national', 'id', 'name']):
                required.append(field.attributes.get('name', ''))
        
        return required
    
    # Helper methods for Arabic text processing
    
    def _load_iraqi_patterns(self) -> Dict[str, List[str]]:
        """Load Iraqi-specific text patterns"""
        return {
            'government_terms': [
                'وزارة', 'ministry', 'حكومة', 'government',
                'جواز', 'passport', 'هوية', 'identity'
            ],
            'form_labels': [
                'الاسم', 'name', 'رقم الجواز', 'passport number',
                'الهاتف', 'phone', 'البريد', 'email'
            ],
            'buttons': [
                'إرسال', 'submit', 'التالي', 'next',
                'السابق', 'back', 'بحث', 'search'
            ]
        }
    
    def _setup_arabic_detector(self):
        """Setup Arabic text detection patterns"""
        return re.compile(r'[\u0600-\u06FF]')
    
    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        return bool(self.arabic_detector.search(text))
    
    def _normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text"""
        import unicodedata
        return unicodedata.normalize('NFKD', text)
    
    def _calculate_arabic_percentage(self, text: str) -> float:
        """Calculate percentage of Arabic characters in text"""
        if not text:
            return 0.0
        
        arabic_chars = len(self.arabic_detector.findall(text))
        total_chars = len([c for c in text if c.isalpha()])
        
        return (arabic_chars / total_chars * 100) if total_chars > 0 else 0.0
    
    def _count_arabic_elements(self) -> int:
        """Count elements containing Arabic text"""
        count = 0
        for elem in self.soup.find_all(string=True):
            if isinstance(elem, str) and self._contains_arabic(elem):
                count += 1
        return count
    
    def _count_rtl_elements(self) -> int:
        """Count elements with RTL direction"""
        return len(self.soup.find_all(attrs={'dir': 'rtl'}))
    
    def _is_external_link(self, href: str) -> bool:
        """Check if link is external"""
        return href and (href.startswith('http://') or href.startswith('https://'))
    
    def _analyze_semantic_structure(self) -> Dict[str, bool]:
        """Analyze semantic HTML structure"""
        return {
            'has_h1': bool(self.soup.find('h1')),
            'has_headings': bool(self.soup.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])),
            'has_paragraphs': bool(self.soup.find('p')),
            'has_lists': bool(self.soup.find(['ul', 'ol'])),
            'has_sections': bool(self.soup.find(['section', 'article', 'aside'])),
            'uses_semantic_html': bool(self.soup.find(['main', 'header', 'footer', 'nav', 'section', 'article']))
        }