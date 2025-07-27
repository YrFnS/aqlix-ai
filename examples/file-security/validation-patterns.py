"""
File Security and Validation Patterns for Iraqi Document Processing
Comprehensive security checks for user uploads
"""

import magic
import hashlib
import zipfile
import py7zr
import os
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import mimetypes
from PIL import Image
import fitz  # PyMuPDF
from pydantic import BaseModel, validator
import tempfile
import subprocess
import shutil

class FileValidationError(Exception):
    """Custom exception for file validation errors"""
    pass

class SecurityConfig(BaseModel):
    """Security configuration for file validation"""
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.xls', '.xlsx', '.ppt', '.pptx']
    allowed_mime_types: List[str] = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    enable_virus_scan: bool = False  # Set to True in production
    quarantine_directory: str = "./quarantine"
    max_filename_length: int = 255

class FileInfo(BaseModel):
    """File information after validation"""
    filename: str
    original_filename: str
    file_size: int
    mime_type: str
    file_extension: str
    file_hash: str
    is_safe: bool
    validation_warnings: List[str] = []
    metadata: Dict[str, any] = {}

class IraqiFileValidator:
    """Comprehensive file validator for Iraqi document processing"""
    
    def __init__(self, config: SecurityConfig = None):
        self.config = config or SecurityConfig()
        self._ensure_quarantine_dir()
        
        # Dangerous file signatures (magic numbers)
        self.dangerous_signatures = {
            b'\x4D\x5A': 'Windows Executable',
            b'\x50\x4B\x03\x04': 'ZIP Archive (potential)',
            b'\x50\x4B\x05\x06': 'ZIP Archive (empty)',
            b'\x50\x4B\x07\x08': 'ZIP Archive (spanned)',
            b'\x7F\x45\x4C\x46': 'Linux Executable',
            b'\xCA\xFE\xBA\xBE': 'Mac Executable',
            b'\x21\x3C\x61\x72\x63\x68\x3E': 'Linux Archive',
        }
        
        # Arabic filename patterns (for better handling)
        self.arabic_filename_chars = set(
            '\u0600\u0601\u0602\u0603\u0604\u0605\u0606\u0607\u0608\u0609'
            '\u060A\u060B\u060C\u060D\u060E\u060F\u0610\u0611\u0612\u0613'
            '\u0614\u0615\u0616\u0617\u0618\u0619\u061A\u061B\u061C\u061D'
            '\u061E\u061F\u0620\u0621\u0622\u0623\u0624\u0625\u0626\u0627'
            '\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631'
            '\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\u063B'
            '\u063C\u063D\u063E\u063F\u0640\u0641\u0642\u0643\u0644\u0645'
            '\u0646\u0647\u0648\u0649\u064A\u064B\u064C\u064D\u064E\u064F'
            '\u0650\u0651\u0652\u0653\u0654\u0655\u0656\u0657\u0658\u0659'
            '\u065A\u065B\u065C\u065D\u065E\u065F\u0660\u0661\u0662\u0663'
            '\u0664\u0665\u0666\u0667\u0668\u0669\u066A\u066B\u066C\u066D'
            '\u066E\u066F\u0670\u0671\u0672\u0673\u0674\u0675\u0676\u0677'
            '\u0678\u0679\u067A\u067B\u067C\u067D\u067E\u067F\u0680\u0681'
            '\u0682\u0683\u0684\u0685\u0686\u0687\u0688\u0689\u068A\u068B'
            '\u068C\u068D\u068E\u068F\u0690\u0691\u0692\u0693\u0694\u0695'
            '\u0696\u0697\u0698\u0699\u069A\u069B\u069C\u069D\u069E\u069F'
        )

    def _ensure_quarantine_dir(self):
        """Create quarantine directory if it doesn't exist"""
        Path(self.config.quarantine_directory).mkdir(parents=True, exist_ok=True)

    def validate_filename(self, filename: str) -> Tuple[bool, List[str]]:
        """Validate filename for security issues"""
        warnings = []
        is_valid = True
        
        # Check filename length
        if len(filename) > self.config.max_filename_length:
            warnings.append(f"Filename too long ({len(filename)} > {self.config.max_filename_length})")
            is_valid = False
        
        # Check for path traversal attempts
        dangerous_patterns = ['../', '..\\', '/..', '\\..', '../', '.\\']
        if any(pattern in filename for pattern in dangerous_patterns):
            warnings.append("Path traversal attempt detected in filename")
            is_valid = False
        
        # Check for null bytes
        if '\x00' in filename:
            warnings.append("Null byte detected in filename")
            is_valid = False
        
        # Check for reserved Windows names
        reserved_names = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9', 'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9']
        name_without_ext = Path(filename).stem.upper()
        if name_without_ext in reserved_names:
            warnings.append(f"Reserved system name detected: {name_without_ext}")
            is_valid = False
        
        # Check file extension
        file_ext = Path(filename).suffix.lower()
        if file_ext not in self.config.allowed_extensions:
            warnings.append(f"File extension not allowed: {file_ext}")
            is_valid = False
        
        # Check for Arabic characters in filename (not an error, just info)
        if any(char in self.arabic_filename_chars for char in filename):
            warnings.append("Filename contains Arabic characters (handled properly)")
        
        return is_valid, warnings

    def validate_file_content(self, file_content: bytes, filename: str) -> Tuple[bool, List[str], str]:
        """Validate file content using magic numbers and deep inspection"""
        warnings = []
        is_safe = True
        
        if len(file_content) == 0:
            return False, ["Empty file"], "unknown"
        
        # Detect actual MIME type using python-magic
        try:
            mime_type = magic.from_buffer(file_content, mime=True)
            file_type_desc = magic.from_buffer(file_content)
        except Exception as e:
            warnings.append(f"Could not detect file type: {e}")
            mime_type = "unknown"
            file_type_desc = "unknown"
        
        # Check against allowed MIME types
        if mime_type not in self.config.allowed_mime_types:
            warnings.append(f"MIME type not allowed: {mime_type}")
            is_safe = False
        
        # Check for dangerous file signatures
        for signature, description in self.dangerous_signatures.items():
            if file_content.startswith(signature):
                warnings.append(f"Dangerous file signature detected: {description}")
                is_safe = False
        
        # Additional checks based on file type
        if mime_type == 'application/pdf':
            is_safe, pdf_warnings = self._validate_pdf_content(file_content)
            warnings.extend(pdf_warnings)
        elif mime_type.startswith('image/'):
            is_safe, img_warnings = self._validate_image_content(file_content)
            warnings.extend(img_warnings)
        elif 'office' in mime_type or mime_type in ['application/msword']:
            is_safe, office_warnings = self._validate_office_content(file_content, mime_type)
            warnings.extend(office_warnings)
        
        return is_safe, warnings, mime_type

    def _validate_pdf_content(self, pdf_content: bytes) -> Tuple[bool, List[str]]:
        """Validate PDF file content for security issues"""
        warnings = []
        is_safe = True
        
        try:
            # Open PDF with PyMuPDF for analysis
            pdf_doc = fitz.open(stream=pdf_content, filetype="pdf")
            
            # Check for JavaScript in PDF
            for page_num in range(pdf_doc.page_count):
                page = pdf_doc[page_num]
                
                # Check for embedded JavaScript
                if page.get_text().find('/JavaScript') != -1:
                    warnings.append("PDF contains JavaScript code")
                    is_safe = False
                
                # Check for forms with JavaScript
                widgets = page.widgets()
                for widget in widgets:
                    if hasattr(widget, 'field_type') and widget.field_type == 'Button':
                        warnings.append("PDF contains interactive elements")
            
            # Check for embedded files
            embedded_files = pdf_doc.embfile_count()
            if embedded_files > 0:
                warnings.append(f"PDF contains {embedded_files} embedded files")
                # In production, you might want to extract and scan these
            
            # Check for suspicious metadata
            metadata = pdf_doc.metadata
            suspicious_keys = ['javascript', 'script', 'action', 'openaction']
            for key, value in metadata.items():
                if any(sus_key in key.lower() or sus_key in str(value).lower() for sus_key in suspicious_keys):
                    warnings.append(f"Suspicious metadata found: {key}")
            
            pdf_doc.close()
            
        except Exception as e:
            warnings.append(f"Error analyzing PDF: {e}")
            is_safe = False
        
        return is_safe, warnings

    def _validate_image_content(self, image_content: bytes) -> Tuple[bool, List[str]]:
        """Validate image file content"""
        warnings = []
        is_safe = True
        
        try:
            with Image.open(io.BytesIO(image_content)) as img:
                # Check image dimensions (prevent decompression bombs)
                width, height = img.size
                max_pixels = 50000000  # 50 megapixels
                
                if width * height > max_pixels:
                    warnings.append(f"Image too large: {width}x{height} pixels")
                    is_safe = False
                
                # Check for suspicious EXIF data
                if hasattr(img, '_getexif') and img._getexif():
                    exif_data = img._getexif()
                    if exif_data:
                        # Check for GPS data (privacy concern)
                        gps_tags = [34853]  # GPS Info tag
                        if any(tag in exif_data for tag in gps_tags):
                            warnings.append("Image contains GPS location data")
                
        except Exception as e:
            warnings.append(f"Error analyzing image: {e}")
            is_safe = False
        
        return is_safe, warnings

    def _validate_office_content(self, file_content: bytes, mime_type: str) -> Tuple[bool, List[str]]:
        """Validate Microsoft Office document content"""
        warnings = []
        is_safe = True
        
        # Check if it's actually a ZIP file (modern Office formats)
        if mime_type.startswith('application/vnd.openxmlformats'):
            try:
                # Modern Office files are ZIP archives
                with zipfile.ZipFile(io.BytesIO(file_content), 'r') as zip_file:
                    file_list = zip_file.namelist()
                    
                    # Check for macros
                    macro_files = [f for f in file_list if 'vbaProject.bin' in f or 'macros/' in f]
                    if macro_files:
                        warnings.append("Document contains macros")
                        is_safe = False
                    
                    # Check for external links
                    rels_files = [f for f in file_list if 'rels' in f]
                    for rels_file in rels_files:
                        try:
                            content = zip_file.read(rels_file).decode('utf-8', errors='ignore')
                            if 'External' in content or 'http://' in content or 'https://' in content:
                                warnings.append("Document contains external links")
                        except:
                            pass
                            
            except zipfile.BadZipFile:
                warnings.append("Invalid Office document format")
                is_safe = False
            except Exception as e:
                warnings.append(f"Error analyzing Office document: {e}")
                is_safe = False
        
        return is_safe, warnings

    def calculate_file_hash(self, file_content: bytes) -> str:
        """Calculate SHA-256 hash of file content"""
        return hashlib.sha256(file_content).hexdigest()

    def scan_for_viruses(self, file_content: bytes, filename: str) -> Tuple[bool, List[str]]:
        """Basic virus scanning (integrate with antivirus service in production)"""
        warnings = []
        is_clean = True
        
        if not self.config.enable_virus_scan:
            return is_clean, warnings
        
        # In production, integrate with services like:
        # - VirusTotal API
        # - ClamAV
        # - Windows Defender
        # - Commercial antivirus APIs
        
        # For now, basic signature detection
        suspicious_patterns = [
            b'CreateProcess',
            b'WinExec',
            b'ShellExecute',
            b'VirtualAlloc',
            b'LoadLibrary',
            b'GetProcAddress'
        ]
        
        content_lower = file_content.lower()
        for pattern in suspicious_patterns:
            if pattern.lower() in content_lower:
                warnings.append(f"Suspicious pattern detected: {pattern.decode('utf-8', errors='ignore')}")
                is_clean = False
        
        return is_clean, warnings

    def quarantine_file(self, file_content: bytes, filename: str, reason: str) -> str:
        """Move suspicious file to quarantine"""
        quarantine_filename = f"{hashlib.md5(filename.encode()).hexdigest()}_{filename}"
        quarantine_path = Path(self.config.quarantine_directory) / quarantine_filename
        
        with open(quarantine_path, 'wb') as f:
            f.write(file_content)
        
        # Log quarantine action
        log_path = Path(self.config.quarantine_directory) / 'quarantine.log'
        with open(log_path, 'a') as log_file:
            log_file.write(f"{quarantine_filename}: {reason}\n")
        
        return str(quarantine_path)

    def validate_file(self, file_content: bytes, filename: str) -> FileInfo:
        """Complete file validation workflow"""
        warnings = []
        
        # Check file size
        if len(file_content) > self.config.max_file_size:
            raise FileValidationError(f"File size ({len(file_content)} bytes) exceeds maximum allowed ({self.config.max_file_size} bytes)")
        
        # Validate filename
        filename_valid, filename_warnings = self.validate_filename(filename)
        warnings.extend(filename_warnings)
        
        # Validate file content
        content_safe, content_warnings, mime_type = self.validate_file_content(file_content, filename)
        warnings.extend(content_warnings)
        
        # Virus scan
        virus_clean, virus_warnings = self.scan_for_viruses(file_content, filename)
        warnings.extend(virus_warnings)
        
        # Calculate file hash
        file_hash = self.calculate_file_hash(file_content)
        
        # Determine overall safety
        is_safe = filename_valid and content_safe and virus_clean
        
        # Quarantine if not safe
        if not is_safe and self.config.enable_virus_scan:
            quarantine_path = self.quarantine_file(
                file_content, 
                filename, 
                f"Validation failed: {'; '.join(warnings)}"
            )
            warnings.append(f"File quarantined: {quarantine_path}")
        
        # Create sanitized filename
        sanitized_filename = self._sanitize_filename(filename)
        
        return FileInfo(
            filename=sanitized_filename,
            original_filename=filename,
            file_size=len(file_content),
            mime_type=mime_type,
            file_extension=Path(filename).suffix.lower(),
            file_hash=file_hash,
            is_safe=is_safe,
            validation_warnings=warnings,
            metadata={
                'quarantined': not is_safe and self.config.enable_virus_scan
            }
        )

    def _sanitize_filename(self, filename: str) -> str:
        """Sanitize filename for safe storage"""
        # Remove or replace dangerous characters
        sanitized = filename.replace('..', '_').replace('/', '_').replace('\\', '_')
        sanitized = ''.join(char for char in sanitized if ord(char) < 127 or char in self.arabic_filename_chars)
        
        # Ensure it's not too long
        if len(sanitized) > self.config.max_filename_length:
            name, ext = os.path.splitext(sanitized)
            max_name_length = self.config.max_filename_length - len(ext)
            sanitized = name[:max_name_length] + ext
        
        return sanitized

# Usage example
if __name__ == "__main__":
    import io
    
    # Initialize validator
    config = SecurityConfig(
        enable_virus_scan=True,
        max_file_size=5 * 1024 * 1024  # 5MB
    )
    validator = IraqiFileValidator(config)
    
    # Example: validate a file
    try:
        with open("sample.pdf", "rb") as f:
            file_content = f.read()
        
        file_info = validator.validate_file(file_content, "sample.pdf")
        
        print(f"File: {file_info.filename}")
        print(f"Safe: {file_info.is_safe}")
        print(f"MIME Type: {file_info.mime_type}")
        print(f"Hash: {file_info.file_hash}")
        print(f"Warnings: {file_info.validation_warnings}")
        
    except FileValidationError as e:
        print(f"Validation error: {e}")
    except FileNotFoundError:
        print("Sample file not found - this is just an example")