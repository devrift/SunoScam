import type { PresetMessage } from '../types';

export const PRESET_MESSAGES: PresetMessage[] = [
  {
    id: 'bgmi-uc',
    title: 'Free BGMI 6000 UC & Glacier M416',
    category: 'gaming',
    text: 'BGMI Official Giveaway: Claim 6000 UC and Glacier M416 Skin absolutely free! Enter your registered mobile number, BGMI ID, and verify credit card details at http://bgmi-free-uc-rewards.xyz/claim now before midnight.',
    hint: 'Gaming lure phishing for credentials & payment cards'
  },
  {
    id: 'sbi-kyc',
    title: 'SBI KYC Blocked',
    category: 'banking',
    text: 'Dear SBI Customer, your YONO account has been suspended due to incomplete KYC verification. Click immediately on http://bit.ly/sbi-kyc-update to upload PAN and avoid permanent account deactivation within 24 hours.',
    hint: 'Fake banking panic message with suspicious link'
  },
  {
    id: 'power-cut',
    title: 'Electricity Bill Cut-off 9:30 PM',
    category: 'utility',
    text: 'Dear Consumer, your electricity power will be disconnected tonight at 9:30 PM from the electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9876543210. Thank you.',
    hint: 'Utility scam exploiting urgent evening cut-off fear'
  },
  {
    id: 'welfare-grant',
    title: 'Claim 5000 INR Welfare Grant APK',
    category: 'scheme',
    text: 'PM Jan Dhan Yojana: You are eligible to receive 5000 INR monthly welfare grant bonus. Download PM-Kisan-Direct.apk from http://welfare-gov-scheme.in/claim to verify Aadhaar and credit immediately.',
    hint: 'Government grant lure distributing malicious Android APK'
  }
];

export const LINK_ANALYSIS_PRESET: PresetMessage = {
  id: 'link-check',
  title: 'Check Suspicious Link',
  category: 'url',
  text: 'http://secure-sbi-bank-login-verification.xyz/kyc?user=9820012345',
  hint: 'Phishing domain impersonating trusted brand'
};

export const NUMBER_ANALYSIS_PRESET: PresetMessage = {
  id: 'number-verify',
  title: 'Verify Unknown Number',
  category: 'number',
  text: 'Incoming call from +91-9123456789 claiming to be Mumbai Cyber Police Officer demanding urgent fine payment of 25,000 INR via UPI to avoid immediate digital arrest warrant.',
  hint: 'Digital arrest / impersonation threat'
};
