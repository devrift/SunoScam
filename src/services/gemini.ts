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

// Active models supporting generateContent on current Google AI Studio API:
// 1. gemini-3.1-flash-lite (high rate limits, instant structured JSON, ultra responsive)
// 2. gemini-3.5-flash-lite (modern low-latency multimodal reasoning)
// 3. gemini-flash-lite-latest (stable alias)
// 4. gemini-3.8-flash (heavy analysis engine)
// 5. gemini-3.7-flash (deep reasoning tier)
const CASCADE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.8-flash',
  'gemini-3.7-flash'
];

export async function analyzeWithGemini(
  message: string,
  attachedFiles: AttachedFile[],
  settings: UserSettings
): Promise<ScanResult> {
  const apiKey =
    settings.customApiKey?.trim() ||
    localStorage.getItem('scamsuno_custom_api_key')?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    '';

  const linkEval = evaluateLinksSandboxed(message);

  // Elite Fraud Investigator System Prompt
  const userGreetingName = settings.userName?.trim() || 'Family Member';

  const systemPrompt = `You are ScamSuno, an elite Anti-Fraud & Cybercrime Intelligence Engine specifically trained to protect Indian families and elderly parents against digital scams, phishing, social engineering, financial theft, and cyber manipulation.

YOUR SOLE MISSION:
Investigate every input with extreme forensic scrutiny. You are an uncompromising adversarial scam investigator, NOT a generic conversational bot.

TARGET RECIPIENT CONTEXT:
The user has configured this phone for: "${userGreetingName}".
Tailor the "familyReply" so it is an affectionate, clear, protective message addressing ${userGreetingName} (e.g. if name is "Papa", start with "Papa, yeh message...").

THREAT VECTORS TO DETECT & CLASSIFY IMMEDIATELY:
1. FINANCIAL LURES & GAMING TRAPS:
   - Claims of free gaming currency (BGMI UC, Free Fire Diamonds, skins, steam codes, gift cards).
   - Instant lottery wins (KBC lucky draw, WhatsApp lottery number, car/iPhone won).
   - Work-from-home tasks, YouTube like/subscribe payouts, rating hotels on Telegram, crypto double schemes.
   - Government grant / subsidy schemes (PM Kisan, Ladli Behna, free electricity solar subsidy, student laptop welfare).
   -> VERDICT: 'SCAM DETECTED', Probability: 95%-100%.

2. ARTIFICIAL PANIC & SCARE TACTICS:
   - Electricity power cut at 9:30 PM, water disconnection, gas pipeline booking pending.
   - Banking account blocked (SBI YONO, HDFC NetBanking, PNB, ICICI) requiring PAN card update or KYC re-verification.
   - Fake law enforcement coercion (Digital arrest, CBI, Mumbai Police, Narcotics parcel seized at customs, TRAI mobile disconnection).
   -> VERDICT: 'SCAM DETECTED', Probability: 98%-100%.

3. CREDENTIAL HARVESTING & MALWARE:
   - Requests to install unknown APKs (e.g., sbi_reward.apk, update.apk) or screen-sharing software (AnyDesk, TeamViewer, RustDesk).
   - Demands for OTP, UPI PIN, CVV, debit card expiry, net banking passwords.
   - Shortlinks (bit.ly, tinyurl, ngrok, is.gd, duckdns, rebrand.ly) leading to non-bank domains.
   -> VERDICT: 'SCAM DETECTED', Probability: 96%-100%.

4. BENIGN COMMUNICATIONS:
   - Routine personal conversations without payment links, threats, urgent deadlines, or financial requests -> 'SAFE' (0%-15% probability).
   - Ambiguous, unverified commercial ads without proof -> 'SUSPICIOUS' (50%-80% probability).

STRICT OUTPUT RULES:
- Output STRICT JSON matching the schema below.
- Language: Provide the "intent" and "familyReply" strictly in ${settings.language} language.
- ZERO EMOJIS: Do not use any emoji characters anywhere in your output.

JSON OUTPUT FORMAT:
{
  "verdict": "SCAM DETECTED" | "SUSPICIOUS" | "SAFE",
  "probability": <number between 0 and 100>,
  "intent": "<Clear, analytical explanation of the scammer's real trick/chaal, how they exploit human psychology, and what they want to steal>",
  "redFlags": [
    "<Specific forensic red flag 1>",
    "<Specific forensic red flag 2>",
    "<Specific forensic red flag 3>"
  ],
  "familyReply": "<A protective Hindi/English message addressing ${userGreetingName} ready to copy-paste into family WhatsApp groups>"
}`;

  const parts: Array<Record<string, unknown>> = [];
  let queryText = `Message / Input to investigate:\n"""\n${message.trim()}\n"""`;

  if (linkEval.hasLink) {
    queryText += `\n\n[Sandboxed URL Telemetry]:
- Extracted URL: ${linkEval.extractedUrl}
- Hostname: ${linkEval.hostname}
- Protocol/Path Signals: ${linkEval.riskFlags.length > 0 ? linkEval.riskFlags.join(', ') : 'No obvious structural flaw'}`;
  }

  if (attachedFiles.length > 0) {
    queryText += `\n\n[Attached File Analysis (${attachedFiles.length} files)]:`;
    for (const af of attachedFiles) {
      if (af.isExecutable) {
        queryText += `\n- Unverified Binary/Package: Filename="${af.name}", Size=${af.formattedSize}, Extension="${af.extension}", MIME="${af.type}". Treat untrusted side-loaded APK / executable as critical hazard.`;
      } else if (af.isMediaOrDoc) {
        queryText += `\n- Attached Image/Document: Filename="${af.name}", Size=${af.formattedSize}. Run visual OCR on attached image payload.`;
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

  // Execute across active Gemini models with fallback
  let lastError: Error | null = null;

  for (const model of CASCADE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            responseMimeType: 'application/json',
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
          const rawVerdict = String(parsed.verdict || '').toUpperCase();
          const verdict: Verdict =
            rawVerdict.includes('SCAM') ? 'SCAM DETECTED' :
            rawVerdict.includes('SUSPICIOUS') ? 'SUSPICIOUS' :
            rawVerdict.includes('SAFE') ? 'SAFE' : 'SCAM DETECTED';

          const rawFlags: string[] = Array.isArray(parsed.redFlags) ? parsed.redFlags : [];
          const cleanedFlags = rawFlags.map((f) => stripEmojis(String(f))).filter(Boolean);

          let probability = Number(parsed.probability);
          if (isNaN(probability)) {
            probability = verdict === 'SCAM DETECTED' ? 98 : verdict === 'SUSPICIOUS' ? 65 : 12;
          }

          return {
            id: 'scan-' + Date.now(),
            timestamp: Date.now(),
            originalMessage: message.trim(),
            verdict,
            probability: Math.min(100, Math.max(0, Math.round(probability))),
            intent: stripEmojis(String(parsed.intent || 'Scammer intent detected.')),
            redFlags:
              cleanedFlags.length > 0
                ? cleanedFlags
                : ['High-risk suspicious pattern detected by fraud engine'],
            familyReply: stripEmojis(String(parsed.familyReply || 'Yeh sandesh farzi lag raha hai, ispe bilkul click mat karna.')),
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
        const errBody = await response.text().catch(() => '');
        console.warn(`[Gemini Model ${model}] returned ${response.status}: ${errBody.substring(0, 150)}`);
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Gemini Model ${model}] fetch failed:`, lastError.message);
    }
  }

  // If all models failed or offline, fall back to intelligent heuristic engine
  console.info('[ScamSuno] External models temporarily unreachable. Running deterministic heuristic engine.');
  return runIntelligentLocalHeuristic(message, attachedFiles, settings, linkEval);
}

function runIntelligentLocalHeuristic(
  message: string,
  attachedFiles: AttachedFile[],
  settings: UserSettings,
  linkEval: LinkEvaluation
): ScanResult {
  const lower = message.toLowerCase();

  const isFreeGiftOrLure =
    lower.includes('free') ||
    lower.includes('uc') ||
    lower.includes('bgmi') ||
    lower.includes('diamond') ||
    lower.includes('skin') ||
    lower.includes('bonus') ||
    lower.includes('gift') ||
    lower.includes('claim') ||
    lower.includes('welfare') ||
    lower.includes('lottery') ||
    lower.includes('kbc') ||
    lower.includes('won') ||
    lower.includes('cashback') ||
    lower.includes('reward');

  const isUrgentBankingOrUtility =
    lower.includes('kyc') ||
    lower.includes('blocked') ||
    lower.includes('suspend') ||
    lower.includes('deactivat') ||
    lower.includes('power cut') ||
    lower.includes('electricity') ||
    lower.includes('disconnect') ||
    lower.includes('bill overdue') ||
    lower.includes('pan card') ||
    lower.includes('yono') ||
    lower.includes('sbi') ||
    lower.includes('hdfc') ||
    lower.includes('icici') ||
    lower.includes('credit card') ||
    lower.includes('debit card') ||
    lower.includes('cvv') ||
    lower.includes('otp') ||
    lower.includes('pin');

  const hasMaliciousFile = attachedFiles.some((f) => f.isExecutable);

  if (isFreeGiftOrLure || isUrgentBankingOrUtility || hasMaliciousFile || linkEval.riskFlags.length > 0) {
    const motive = isFreeGiftOrLure
      ? 'The message uses fake promises of free money, gaming currency, or prizes to lure you into clicking a malicious link or giving credentials.'
      : hasMaliciousFile
      ? 'The scammer sent an unverified executable or APK package designed to bypass security checks and compromise your device.'
      : 'The scammer is using urgency and threats of disconnection or account blocking to panic you into sharing sensitive banking information.';

    const flags: string[] = [];
    if (isFreeGiftOrLure) flags.push('Promises free cash, rewards, or gaming currency with zero verification');
    if (isUrgentBankingOrUtility) flags.push('Artificial urgency threatening account closure or power disconnection');
    if (hasMaliciousFile) flags.push('Contains unverified APK or binary attachment payload');
    if (linkEval.riskFlags.length > 0) flags.push(...linkEval.riskFlags);

    const familyReply =
      settings.language === 'English'
        ? "Mom/Dad, please don't click on this message. It is a fake phishing scam designed to steal your credentials."
        : settings.language === 'Hindi'
        ? "मम्मी/पापा, यह संदेश पूरी तरह फर्जी है। इस पर बिल्कुल भी क्लिक न करें और न ही कोई विवरण साझा करें।"
        : "Mummy/Papa, yeh message bilkul fake scam hai. Ispe click mat karna aur koi bhi detail share mat karna.";

    return {
      id: 'scan-' + Date.now(),
      timestamp: Date.now(),
      originalMessage: message.trim(),
      verdict: 'SCAM DETECTED',
      probability: 99,
      intent: stripEmojis(motive),
      redFlags: flags.map(stripEmojis),
      familyReply: stripEmojis(familyReply),
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

  return {
    id: 'scan-' + Date.now(),
    timestamp: Date.now(),
    originalMessage: message.trim(),
    verdict: 'SAFE',
    probability: 12,
    intent: 'No high-risk fraud signatures, urgency traps, or phishing links detected.',
    redFlags: ['Message appears to be routine communication with no overt deception markers'],
    familyReply:
      settings.language === 'Hindi'
        ? "यह संदेश सुरक्षित लग रहा है, लेकिन कभी भी किसी के साथ अपना ओटीपी या बैंक पासवर्ड साझा न करें।"
        : "Yeh message theek lag raha hai, par kisi ke sath bhi apna OTP ya bank password share mat karna.",
    isOfflineFallback: true
  };
}
