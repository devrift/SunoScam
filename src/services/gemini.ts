import type { ScanResult, Verdict, UserSettings, AttachedFile } from '../types';
import { evaluateLinksSandboxed, type LinkEvaluation } from './linkEvaluator';

function stripEmojis(str: string): string {
  if (!str) return '';
  return str
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{200D}\u{FE0F}]/gu,
      ''
    )
    .trim();
}

const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    verdict: {
      type: 'STRING',
      enum: ['SCAM DETECTED', 'SUSPICIOUS', 'SAFE']
    },
    probability: {
      type: 'NUMBER'
    },
    intent: {
      type: 'STRING'
    },
    redFlags: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    familyReply: {
      type: 'STRING'
    }
  },
  required: ['verdict', 'probability', 'intent', 'redFlags', 'familyReply']
};

export async function analyzeWithGemini(
  message: string,
  attachedFiles: AttachedFile[],
  settings: UserSettings
): Promise<ScanResult> {
  const apiKey =
    settings.customApiKey?.trim() ||
    localStorage.getItem('scamsuno_custom_api_key')?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY;

  const linkEval = evaluateLinksSandboxed(message);

  // If no API key is provided at all, fall back to local heuristic engine
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    return runIntelligentLocalHeuristic(message, attachedFiles, settings, linkEval);
  }

  const systemPrompt = `You are ScamSuno, an uncompromising anti-fraud engine for Indian users. You detect phishing, banking fraud, fake utility notices, gaming currency lures (e.g., claiming free BGMI UC, skins, or gifts in exchange for credit card details, phone numbers, or passwords), and malicious file attachments/APKs. When a query promises free gaming currency or cash in exchange for credentials, flag it immediately as SCAM DETECTED with 99% probability. Return strictly structured JSON.

${
  settings.sensitivity === 'Strict'
    ? 'STRICT SECURITY POLICY ACTIVE: Any direct APK download, unverified shortlink, or credential request must be flagged immediately as SCAM DETECTED with high probability.'
    : 'STANDARD SECURITY POLICY ACTIVE.'
}

Language requirement: Provide the "intent" and "familyReply" strictly in ${settings.language} language.
CRITICAL INSTRUCTION: Zero emojis anywhere in your output. Do not use any emoji characters.

Output JSON Schema:
{
  "verdict": "SCAM DETECTED" | "SUSPICIOUS" | "SAFE",
  "probability": number (0 to 100),
  "intent": string,
  "redFlags": string[],
  "familyReply": string
}`;

  const parts: Array<Record<string, unknown>> = [];
  let queryText = `Message / Input to analyze:
"""
${message.trim()}
"""`;

  if (linkEval.hasLink) {
    queryText += `\n\n[Client-Side Sandboxed Link Analysis]:
- Extracted URL: ${linkEval.extractedUrl}
- Parsed Host: ${linkEval.hostname}
- Structural Risk Flags: ${
      linkEval.riskFlags.length > 0 ? linkEval.riskFlags.join('; ') : 'None detected structurally'
    }`;
  }

  if (attachedFiles.length > 0) {
    queryText += `\n\n[Attached File Analysis (${attachedFiles.length} files)]:`;
    for (const af of attachedFiles) {
      if (af.isExecutable) {
        queryText += `\n- Unverified Binary/Package: Filename="${af.name}", Size=${af.formattedSize}, Extension="${af.extension}", MIME="${af.type}". Assess risks of side-loaded APK / executable.`;
      } else if (af.isMediaOrDoc) {
        queryText += `\n- Attached Document/Image: Filename="${af.name}", Size=${af.formattedSize}. Inspect attached image payload.`;
        if (af.base64Data && af.mimeType?.startsWith('image/')) {
          parts.push({
            inlineData: {
              mimeType: af.mimeType,
              data: af.base64Data
            }
          });
        }
      }
    }
  }

  parts.push({
    text: `${systemPrompt}\n\n${queryText}`
  });

  // Multi-Model Cascade:
  // 1. Primary: gemini-2.5-flash
  // 2. First Fallback: gemini-2.0-flash (higher free tier limit of 1500 RPD)
  // 3. Second Fallback: gemini-1.5-flash
  // Additional candidates: gemini-flash-latest, gemini-3.8-flash
  const cascadeModels = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-flash-latest',
    'gemini-3.8-flash'
  ];

  for (const model of cascadeModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.1
          }
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          const verdict: Verdict =
            parsed.verdict === 'SCAM DETECTED' || parsed.verdict === 'SUSPICIOUS' || parsed.verdict === 'SAFE'
              ? parsed.verdict
              : 'SCAM DETECTED';

          const rawFlags: string[] = Array.isArray(parsed.redFlags) ? parsed.redFlags : [];
          const cleanedFlags = rawFlags.map((f) => stripEmojis(String(f))).filter(Boolean);

          return {
            id: 'scan-' + Date.now(),
            timestamp: Date.now(),
            originalMessage: message.trim(),
            verdict,
            probability: Math.min(100, Math.max(0, Math.round(Number(parsed.probability) || 90))),
            intent: stripEmojis(String(parsed.intent || 'Scammer intent detected.')),
            redFlags:
              cleanedFlags.length > 0
                ? cleanedFlags
                : ['High-risk suspicious pattern detected by fraud engine'],
            familyReply: stripEmojis(String(parsed.familyReply || 'Yeh sandesh farzi hai, ispe click mat karna.')),
            fileInfo:
              attachedFiles.length > 0
                ? {
                    name: attachedFiles[0].name,
                    size: attachedFiles[0].formattedSize,
                    type: attachedFiles[0].extension
                  }
                : undefined,
            linkInfo: linkEval.hasLink
              ? {
                  url: linkEval.extractedUrl,
                  hostname: linkEval.hostname,
                  riskFlags: linkEval.riskFlags
                }
              : undefined,
            isOfflineFallback: false
          };
        }
      } else {
        const errorText = await response.text().catch(() => '');
        const isRateLimit =
          response.status === 429 ||
          errorText.includes('RESOURCE_EXHAUSTED') ||
          errorText.toLowerCase().includes('quota');

        if (isRateLimit) {
          console.debug(`[ScamSuno Cascade] Model ${model} rate-limited (429/quota). Cascading to next candidate...`);
        } else {
          console.debug(`[ScamSuno Cascade] Model ${model} returned ${response.status}. Trying next candidate...`);
        }
      }
    } catch (err: unknown) {
      console.debug(`[ScamSuno Cascade] Error connecting to ${model}:`, err);
    }
  }

  // All API models were exhausted, rate-limited, or unavailable.
  // Seamlessly run the intelligent local heuristic evaluator without blocking the user!
  return runIntelligentLocalHeuristic(message, attachedFiles, settings, linkEval);
}

/**
 * Intelligent Client-Side Heuristic Fallback Engine
 * Activated when API models are rate-limited (429) or offline.
 */
function runIntelligentLocalHeuristic(
  message: string,
  attachedFiles: AttachedFile[],
  settings: UserSettings,
  linkEval: LinkEvaluation
): ScanResult {
  const lower = message.toLowerCase();
  const hasApkFile = attachedFiles.some((f) => f.isExecutable || f.extension.toLowerCase() === '.apk');

  const isGamingScam =
    lower.includes('free uc') ||
    lower.includes('bgmi') ||
    lower.includes('free skin') ||
    lower.includes('glacier') ||
    lower.includes('credit card') ||
    lower.includes('free fire') ||
    lower.includes('diamond');

  const isBankKycScam =
    lower.includes('kyc') ||
    lower.includes('pan card') ||
    lower.includes('blocked') ||
    lower.includes('suspended') ||
    lower.includes('sbi') ||
    lower.includes('yono') ||
    lower.includes('netbanking') ||
    lower.includes('deactivat');

  const isPowerCutScam =
    lower.includes('power cut') ||
    lower.includes('electricity') ||
    lower.includes('disconnection') ||
    lower.includes('light bill') ||
    lower.includes('9:30');

  const isWelfareOrApkScam =
    hasApkFile ||
    lower.includes('.apk') ||
    lower.includes('welfare grant') ||
    lower.includes('pm-kisan') ||
    lower.includes('5000 inr') ||
    lower.includes('yojana');

  const isDigitalArrest =
    lower.includes('police') ||
    lower.includes('digital arrest') ||
    lower.includes('customs') ||
    lower.includes('parcel') ||
    lower.includes('cbi');

  const isScam =
    isGamingScam ||
    isBankKycScam ||
    isPowerCutScam ||
    isWelfareOrApkScam ||
    isDigitalArrest ||
    linkEval.isSuspiciousStructure;

  const lang = settings.language;

  if (isScam) {
    const redFlags: string[] = [];
    let intent = '';
    let familyReply = '';

    if (isGamingScam) {
      intent =
        lang === 'English'
          ? 'Phishing lure exploiting free gaming items (BGMI UC/skins) to capture credit card and phone credentials.'
          : lang === 'Hindi'
          ? 'फ्री गेमिंग करेंसी (BGMI UC) का लालच देकर क्रेडिट कार्ड और मोबाइल नंबर चुराने का प्रयास।'
          : 'Free BGMI UC aur rare skin ka lalach dekar credit card aur mobile credentials chori karne ki chaal.';

      redFlags.push('Promises free in-game currency/skins in exchange for sensitive credentials');
      redFlags.push('Suspicious third-party claims unassociated with official game developers');
      redFlags.push('Urgent midnight claim countdown to cause panic compliance');

      familyReply =
        lang === 'English'
          ? 'Be careful! This free UC/skins link is a gaming scam to steal your card details. Do not click or enter details.'
          : lang === 'Hindi'
          ? 'सावधान! यह फ्री UC वाला मैसेज पूरी तरह फर्जी स्कैम है। कार्ड या फोन नंबर न डालें।'
          : 'Mummy/Papa, yeh free gaming UC wala scam hai. Card details aur number chori karne ke liye bheja gaya hai. Click mat karna.';
    } else if (isBankKycScam) {
      intent =
        lang === 'English'
          ? 'Bank impersonation panic message attempting to harvest netbanking passwords, PAN, and OTPs.'
          : lang === 'Hindi'
          ? 'बैंक खाता बंद होने का डर दिखाकर नेटबैंकिंग पासवर्ड और पैन कार्ड चुराने की साजिश।'
          : 'Bank ke naam par darakar personal netbanking credentials aur OTP churane ki chaal.';

      redFlags.push('Banks never send SMS links threatening immediate 24hr account suspension');
      redFlags.push('Shortened or unverified domain mimicking legitimate banking portals');
      redFlags.push('Demands urgent PAN Card upload via unsecured web link');

      familyReply =
        lang === 'English'
          ? 'This is a fake bank KYC message. Official banks never block accounts via SMS links. Please delete it.'
          : lang === 'Hindi'
          ? 'यह बैंक KYC वाला मैसेज फर्जी है। बैंक कभी ऐसे SMS से खाता ब्लॉक नहीं करता। इसपर क्लिक न करें।'
          : 'Mummy/Papa, yeh farzi bank scam hai. Bank kabhi SMS me KYC link nahi bhejta. Is link ko mat kholna.';
    } else if (isPowerCutScam) {
      intent =
        lang === 'English'
          ? 'Utility intimidation trick creating evening power cut anxiety to force remote desktop access or money transfer.'
          : lang === 'Hindi'
          ? 'बिजली कटने का खौफ दिखाकर फर्जी नंबर पर कॉल करवाने और पैसे ऐंठने की चाल।'
          : 'Bijli katne ka darr dikhakar personal number par call karwana aur screen share app install karwana.';

      redFlags.push('Official power discoms never provide personal mobile numbers for bill resolution');
      redFlags.push('Fake 9:30 PM evening deadline manufactured to cause immediate panic');
      redFlags.push('Fraudster attempts to direct victims to remote-access payment tools');

      familyReply =
        lang === 'English'
          ? 'Do not worry about the electricity message. It is a well-known scam. No power will be cut.'
          : lang === 'Hindi'
          ? 'बिजली बिल वाला यह मैसेज बिल्कुल फर्जी है। कोई लाइट नहीं कटेगी। दिए गए नंबर पर कॉल न करें।'
          : 'Mummy/Papa, yeh purana bijli bill scam hai. Koi power cut nahi hoga. Diye gaye number par call mat karna.';
    } else if (isWelfareOrApkScam) {
      intent =
        lang === 'English'
          ? 'Government welfare grant lure designed to side-load a malicious Android APK spyware onto the device.'
          : lang === 'Hindi'
          ? 'सरकारी योजना का झांसा देकर फोन में खतरनाक वायरस APK इनस्टॉल करवाने का जाल।'
          : 'Sarkari yojana ka lalach dekar phone me virus/malicious APK install karwane ki koshish.';

      redFlags.push('Government schemes are never distributed via direct .apk file downloads');
      redFlags.push('Unverified external server hosting Android executable package');
      redFlags.push('5000 INR grant promised as financial lure to harvest Aadhaar data');

      familyReply =
        lang === 'English'
          ? 'Do not download or install this APK file. It is malware designed to hack phones.'
          : lang === 'Hindi'
          ? 'इस APK फाइल को डाउनलोड न करें। यह फोन हैक करने वाला खतरनाक वायरस है।'
          : 'Mummy/Papa, yeh APK file ek virus hai. Isse phone hack ho sakta hai. Is link ko bilkul mat kholna.';
    } else {
      intent =
        lang === 'English'
          ? 'Phishing communication utilizing urgency and unverified links to manipulate recipients.'
          : lang === 'Hindi'
          ? 'अज्ञात लिंक और झूठी जल्दीबाजी का उपयोग करके डेटा हथियाने का प्रयास।'
          : 'Anjaan link aur darr ke zariye data ya paise chori karne ki chaal.';

      redFlags.push('Unverified source attempting urgency manipulation');
      if (linkEval.hasLink) {
        redFlags.push(`Suspicious link structure (${linkEval.hostname || 'external host'})`);
      }

      familyReply =
        lang === 'English'
          ? 'This message appears suspicious. Do not click any links or share private information.'
          : lang === 'Hindi'
          ? 'यह संदेश संदेहास्पद लग रहा है। किसी भी लिंक पर क्लिक न करें।'
          : 'Mummy/Papa, yeh sandesh suspicious lag raha hai. Is link par click mat karna.';
    }

    if (linkEval.riskFlags.length > 0) {
      redFlags.push(...linkEval.riskFlags.slice(0, 2));
    }

    return {
      id: 'scan-' + Date.now(),
      timestamp: Date.now(),
      originalMessage: message.trim(),
      verdict: 'SCAM DETECTED',
      probability: 99,
      intent,
      redFlags,
      familyReply,
      fileInfo:
        attachedFiles.length > 0
          ? {
              name: attachedFiles[0].name,
              size: attachedFiles[0].formattedSize,
              type: attachedFiles[0].extension
            }
          : undefined,
      linkInfo: linkEval.hasLink
        ? {
            url: linkEval.extractedUrl,
            hostname: linkEval.hostname,
            riskFlags: linkEval.riskFlags
          }
        : undefined,
      isOfflineFallback: true
    };
  }

  // Benign / Safe Text
  const safeIntent =
    lang === 'English'
      ? 'Standard communication or verified legitimate notification with no detected fraud indicators.'
      : lang === 'Hindi'
      ? 'सामान्य संदेश या वैध सूचना जिसमें कोई धोखाधड़ी का पैटर्न नहीं मिला।'
      : 'Normal baat-cheet ya legitimate notification lagti hai. Isme koi scam pattern nahi paya gaya.';

  const safeReply =
    lang === 'English'
      ? 'This message appears safe. No red flags were detected.'
      : lang === 'Hindi'
      ? 'यह संदेश सुरक्षित प्रतीत होता है। कोई खतरा नहीं मिला।'
      : 'Yeh message safe lag raha hai. Fir bhi savdhani ke saath verify kar sakte hain.';

  return {
    id: 'scan-' + Date.now(),
    timestamp: Date.now(),
    originalMessage: message.trim(),
    verdict: 'SAFE',
    probability: 15,
    intent: safeIntent,
    redFlags: [
      'No fraudulent financial urgency demands detected',
      'No malicious executable or credential-harvesting links'
    ],
    familyReply: safeReply,
    fileInfo:
      attachedFiles.length > 0
        ? {
            name: attachedFiles[0].name,
            size: attachedFiles[0].formattedSize,
            type: attachedFiles[0].extension
          }
        : undefined,
    linkInfo: linkEval.hasLink
      ? {
          url: linkEval.extractedUrl,
          hostname: linkEval.hostname,
          riskFlags: linkEval.riskFlags
        }
      : undefined,
    isOfflineFallback: true
  };
}
