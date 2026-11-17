import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clipboard,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Paperclip,
  FileText,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { PRESET_MESSAGES } from '../data/presets';
import type { AttachedFile } from '../types';

interface ScanBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (text: string, files: AttachedFile[]) => void;
  initialText?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const ScanBottomSheet: React.FC<ScanBottomSheetProps> = ({
  isOpen,
  onClose,
  onAnalyze,
  initialText = ''
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [clipboardError, setClipboardError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 150);
    } else {
      setClipboardError(null);
      setIsDragging(false);
    }
  }, [isOpen]);

  const handlePaste = async () => {
    try {
      setClipboardError(null);
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
      }
    } catch {
      setClipboardError('Clipboard permission needed. Please paste manually.');
    }
  };

  const handleSelectPreset = (text: string) => {
    setInputText(text);
  };

  const processFiles = async (fileList: FileList | File[]) => {
    const newFiles: AttachedFile[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const isExe = ['apk', 'exe', 'deb', 'sh', 'ipa', 'dmg', 'bat', 'cmd', 'vbs', 'jar'].includes(extension);
      const isMedia = file.type.startsWith('image/') || ['pdf', 'txt', 'docx'].includes(extension);

      let base64Data: string | undefined = undefined;
      let mimeType = file.type || 'application/octet-stream';

      // Read image files client-side for multimodal vision
      if (file.type.startsWith('image/')) {
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          // Extract base64 payload
          const commaIdx = dataUrl.indexOf(',');
          if (commaIdx !== -1) {
            base64Data = dataUrl.slice(commaIdx + 1);
            mimeType = file.type;
          }
        } catch (e) {
          console.warn('Error reading file as data URL', e);
        }
      }

      newFiles.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        formattedSize: formatBytes(file.size),
        type: mimeType,
        extension: `.${extension}`,
        isExecutable: isExe,
        isMediaOrDoc: isMedia,
        base64Data,
        mimeType
      });
    }

    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveFile = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && attachedFiles.length === 0) return;
    onAnalyze(inputText.trim(), attachedFiles);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#131722] border-t border-white/10 rounded-t-[32px] p-5 pb-8 z-50 shadow-[0_-16px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center border border-[#FF6B00]/40">
                  <ShieldAlert className="w-4 h-4 text-[#FF7A00]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Scan Your Message</h3>
                  <p className="text-xs text-gray-400">SMS, WhatsApp, URL, or File Attachment</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Textarea Container with Drag and Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-2xl border transition-all ${
                  isDragging
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 shadow-[0_0_16px_rgba(255,107,0,0.3)]'
                    : 'border-white/10 bg-[#0B0D13]'
                }`}
              >
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste suspicious SMS, WhatsApp forward, gaming currency lure, or URL here..."
                  rows={4}
                  className="w-full bg-transparent p-3.5 pb-12 text-sm text-white placeholder-gray-500 focus:outline-none resize-none transition-colors"
                />

                {/* Bottom Action Bar inside Textarea */}
                <div className="absolute left-3 right-3 bottom-2.5 flex items-center justify-between pointer-events-auto">
                  {/* File Upload Trigger */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1.5 rounded-lg bg-[#181E2E] hover:bg-[#20273B] border border-white/10 text-xs font-medium text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
                      title="Attach screenshot, APK, or document"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-[#FFA14A]" />
                      <span>Attach File</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.apk,.exe,.sh,.deb,.dmg,.ipa,.txt,.docx"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>

                  {/* Paste from Clipboard Button */}
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="px-2.5 py-1.5 rounded-lg bg-[#181E2E] hover:bg-[#20273B] border border-white/10 text-xs font-medium text-gray-300 hover:text-white flex items-center space-x-1.5 transition-all active:scale-95 shadow-sm"
                  >
                    <Clipboard className="w-3.5 h-3.5 text-[#FFA14A]" />
                    <span>Paste</span>
                  </button>
                </div>
              </div>

              {clipboardError && (
                <p className="text-xs text-[#FF4D00] px-1">{clipboardError}</p>
              )}

              {/* Attached Files List */}
              {attachedFiles.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-1">
                    <span>Attached Files ({attachedFiles.length})</span>
                    <span className="text-[#FFA14A]">Multimodal Analysis Active</span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                    {attachedFiles.map((af) => (
                      <div
                        key={af.id}
                        className="p-2 px-3 rounded-xl bg-[#0B0D13] border border-white/10 flex items-center justify-between space-x-2"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                          <div className="w-7 h-7 rounded-lg bg-[#181E2E] flex items-center justify-center flex-shrink-0 text-[#FFA14A]">
                            {af.isExecutable ? (
                              <FileCode className="w-4 h-4" />
                            ) : af.mimeType?.startsWith('image/') ? (
                              <ImageIcon className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-white truncate">{af.name}</p>
                            <p className="text-[10px] text-gray-400">
                              {af.formattedSize} {af.isExecutable ? '(Static Metadata Scanner)' : '(Vision Input)'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFile(af.id)}
                          className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick-Select Test Pills */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Quick-Select Test Presets
                  </span>
                  <span className="text-[11px] text-[#FFA14A]">1-Tap Demo</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_MESSAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.text)}
                      className="text-xs px-2.5 py-1.5 rounded-full bg-[#181D2B] border border-white/10 hover:border-[#FF6B00]/40 text-gray-300 hover:text-white transition-all active:scale-95 flex items-center space-x-1"
                    >
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Now Button */}
              <button
                type="submit"
                disabled={!inputText.trim() && attachedFiles.length === 0}
                className={`w-full py-3.5 rounded-full font-bold text-sm tracking-wide text-white flex items-center justify-center space-x-2 transition-all shadow-[0_8px_24px_rgba(255,107,0,0.4)] ${
                  inputText.trim() || attachedFiles.length > 0
                    ? 'orange-gradient-btn cursor-pointer'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-60'
                }`}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Analyze Now</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
