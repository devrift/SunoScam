export interface LinkEvaluation {
  hasLink: boolean;
  extractedUrl?: string;
  hostname?: string;
  pathname?: string;
  riskFlags: string[];
  isSuspiciousStructure: boolean;
}

const DECEPTIVE_TLDS = [
  '.xyz',
  '.top',
  '.cc',
  '.click',
  '.vip',
  '.live',
  '.work',
  '.rest',
  '.buzz',
  '.fit',
  '.gq',
  '.cf',
  '.tk',
  '.ml',
  '.ga',
  '.support',
  '.icu',
  '.cam',
  '.online'
];

const SUSPICIOUS_KEYWORDS = [
  'free-uc',
  'bgmi',
  'free-skin',
  'free-fire',
  'kyc',
  'pan-card',
  'yono',
  'sbi',
  'verification',
  'verify',
  'login',
  'signin',
  'bank-update',
  'bonus',
  'gift',
  'claim',
  'lottery',
  'welfare',
  'apk',
  'download',
  'cut-off',
  'electricity-bill',
  'free-cash',
  'airdrop'
];

const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'is.gd',
  'rb.gy',
  'shorturl.at',
  'ow.ly'
];

// IP address regex (IPv4)
const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

export function evaluateLinksSandboxed(text: string): LinkEvaluation {
  const urlRegex = /(?:https?:\/\/|www\.)[^\s<>"{}|\^~`\[\]]+/gi;
  const match = text.match(urlRegex);

  if (!match || match.length === 0) {
    return {
      hasLink: false,
      riskFlags: [],
      isSuspiciousStructure: false
    };
  }

  // Clean trailing punctuation
  let rawUrl = match[0].replace(/[.,;:!?)'"]+$/, '');
  const riskFlags: string[] = [];

  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    const fullSearch = parsed.search.toLowerCase();

    // 1. Raw IP Host check (severe risk)
    if (IP_REGEX.test(hostname)) {
      riskFlags.push(`Direct IP Address Host (${hostname}) - High risk of unverified malicious server`);
    }

    // 2. Suspicious TLD check
    for (const tld of DECEPTIVE_TLDS) {
      if (hostname.endsWith(tld)) {
        riskFlags.push(`Suspicious top-level domain (${tld}) commonly used for throwaway phishing sites`);
        break;
      }
    }

    // 3. URL shortener check
    if (URL_SHORTENERS.includes(hostname)) {
      riskFlags.push(`Shortened URL (${hostname}) hiding the actual destination endpoint`);
    }

    // 4. Keyword check in URL string
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (hostname.includes(keyword) || pathname.includes(keyword) || fullSearch.includes(keyword)) {
        riskFlags.push(`High-risk keyword pattern detected: "${keyword}"`);
        break;
      }
    }

    // 5. Deceptive subdomain check (e.g. sbi.com.malicious.xyz)
    const hostParts = hostname.split('.');
    if (hostParts.length > 2) {
      const subdomains = hostParts.slice(0, -2).join('.');
      if (['sbi', 'hdfc', 'icici', 'axis', 'paytm', 'yono', 'gov', 'police'].some(b => subdomains.includes(b))) {
        riskFlags.push(`Brand spoofing subdomain pattern detected in host "${hostname}"`);
      }
    }

    return {
      hasLink: true,
      extractedUrl: rawUrl,
      hostname,
      pathname,
      riskFlags,
      isSuspiciousStructure: riskFlags.length > 0
    };
  } catch {
    return {
      hasLink: true,
      extractedUrl: rawUrl,
      riskFlags: ['Malformed or deceptive URL structure'],
      isSuspiciousStructure: true
    };
  }
}
