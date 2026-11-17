export type Screen = 'onboarding' | 'dashboard' | 'report';

export type Verdict = 'SCAM DETECTED' | 'SUSPICIOUS' | 'SAFE';

export interface ScanResult {
  id: string;
  timestamp: number;
  originalMessage: string;
  verdict: Verdict;
  probability: number;
  intent: string;
  redFlags: string[];
  familyReply: string;
  fileInfo?: {
    name: string;
    size: string;
    type: string;
  };
  linkInfo?: {
    url?: string;
    hostname?: string;
    riskFlags?: string[];
  };
}

export interface PresetMessage {
  id: string;
  title: string;
  category: 'banking' | 'utility' | 'scheme' | 'gaming' | 'url' | 'number';
  text: string;
  hint?: string;
}

export type ThemeMode = 'dark' | 'slate';
export type AppLanguage = 'Hinglish' | 'English' | 'Hindi';
export type SecuritySensitivity = 'Standard' | 'Strict';

export interface UserSettings {
  theme: ThemeMode;
  language: AppLanguage;
  sensitivity: SecuritySensitivity;
  customApiKey?: string;
}

export interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  extension: string;
  isExecutable: boolean;
  isMediaOrDoc: boolean;
  base64Data?: string;
  mimeType?: string;
}
