// Document Upload Component with Arabic RTL Support
// Based on react-dropzone best practices and Iraqi user needs

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  preview?: string;
}

interface DocumentUploadProps {
  language: 'arabic' | 'english';
  onFilesUploaded: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
}

export function DocumentUpload({ 
  language, 
  onFilesUploaded, 
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024 // 10MB
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${file.name}-${Date.now()}`,
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);

    // Upload files with progress tracking
    for (const uploadFile of newFiles) {
      try {
        await uploadFileWithProgress(uploadFile);
      } catch (error) {
        updateFileStatus(uploadFile.id, 'error', 0, String(error));
      }
    }

    setIsUploading(false);
    onFilesUploaded(uploadedFiles);
  }, [uploadedFiles, onFilesUploaded]);

  const uploadFileWithProgress = async (uploadFile: UploadedFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);
    formData.append('language', language);

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      // Simulate progress for demo (in real app, use XMLHttpRequest for progress)
      for (let progress = 10; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        updateFileStatus(uploadFile.id, 'uploading', progress);
      }

      const result = await response.json();
      updateFileStatus(uploadFile.id, 'completed', 100);
      
    } catch (error) {
      updateFileStatus(uploadFile.id, 'error', 0, String(error));
    }
  };

  const updateFileStatus = (
    id: string, 
    status: UploadedFile['status'], 
    progress: number, 
    error?: string
  ) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, status, progress, error } : file
      )
    );
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    maxFiles,
    maxSize,
  });

  const direction = language === 'arabic' ? 'rtl' : 'ltr';
  const textAlign = language === 'arabic' ? 'text-right' : 'text-left';
  const fontFamily = language === 'arabic' ? 'font-arabic' : 'font-sans';

  const texts = {
    arabic: {
      title: 'رفع المستندات',
      dragText: 'اسحب الملفات هنا أو انقر للاختيار',
      dragActive: 'أفلت الملفات هنا...',
      supportedFormats: 'الصيغ المدعومة: PDF, DOC, DOCX, صور, Excel, PowerPoint',
      maxSize: `الحد الأقصى للحجم: ${maxSize / (1024 * 1024)}MB`,
      maxFiles: `عدد الملفات الأقصى: ${maxFiles}`,
      uploading: 'جاري الرفع...',
      completed: 'اكتمل الرفع',
      error: 'خطأ في الرفع',
      remove: 'إزالة',
    },
    english: {
      title: 'Upload Documents',
      dragText: 'Drag files here or click to select',
      dragActive: 'Drop files here...',
      supportedFormats: 'Supported: PDF, DOC, DOCX, Images, Excel, PowerPoint',
      maxSize: `Max size: ${maxSize / (1024 * 1024)}MB`,
      maxFiles: `Max files: ${maxFiles}`,
      uploading: 'Uploading...',
      completed: 'Upload complete',
      error: 'Upload error',
      remove: 'Remove',
    },
  };

  const t = texts[language];

  return (
    <div className={`w-full ${fontFamily}`} dir={direction}>
      <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
        {t.title}
      </h3>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${textAlign} cursor-pointer transition-colors
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? t.dragActive : t.dragText}
            </p>
            <p className="text-sm text-gray-500 mt-2">{t.supportedFormats}</p>
            <p className="text-xs text-gray-400 mt-1">
              {t.maxSize} • {t.maxFiles}
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className={`font-medium ${textAlign}`}>
            {language === 'arabic' ? 'الملفات المرفوعة' : 'Uploaded Files'}
          </h4>
          
          {uploadedFiles.map((uploadFile) => (
            <div
              key={uploadFile.id}
              className="flex items-center justify-between p-3 border rounded-lg"
              dir={direction}
            >
              <div className="flex items-center space-x-3 flex-1">
                <File className="w-8 h-8 text-gray-400 flex-shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadFile.file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadFile.file.size / 1024).toFixed(1)} KB
                  </p>
                  
                  {/* Progress Bar */}
                  {uploadFile.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadFile.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Status Messages */}
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <p className="text-red-500 text-xs mt-1">{uploadFile.error}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Status Icon */}
                {uploadFile.status === 'uploading' && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                )}
                {uploadFile.status === 'completed' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {uploadFile.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(uploadFile.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title={t.remove}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className={`mt-4 p-3 bg-blue-50 rounded-lg ${textAlign}`}>
          <p className="text-blue-700 font-medium">{t.uploading}</p>
        </div>
      )}
    </div>
  );
}