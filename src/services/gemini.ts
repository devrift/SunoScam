import type { ScanResult, Verdict, UserSettings, AttachedFile } from '../types';
import { evaluateLinksSandboxed } from './linkEvaluator';

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
  // Read custom API key from settings or localStorage first, fallback to .env
  const apiKey =
    settings.customApiKey?.trim() ||
    localStorage.getItem('scamsuno_custom_api_key')?.trim() ||
    import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('API Error: Check API Key in Settings');
  }

  // 1. Sandboxed zero-risk link evaluation
  const linkEval = evaluateLinksSandboxed(message);

  // 2. Build system prompt as requested
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

  // 3. Assemble Gemini parts (Text + Multimodal Vision / File Metadata)
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

  // Process attached files
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

  // Attempt candidate models with 4s timeout
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let quotaExceeded = false;
  let authFailed = false;

  for (const model of modelsToTry) {
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
              : undefined
          };
        }
      } else {
        if (response.status === 429) {
          quotaExceeded = true;
        } else if (response.status === 401 || response.status === 403) {
          authFailed = true;
        }
        console.warn(`Model ${model} returned status ${response.status}`);
      }
    } catch (err: unknown) {
      console.warn(`Error querying model ${model}:`, err);
    }
  }

  if (quotaExceeded) {
    throw new Error('API Error: Quota exceeded (429). Check API Key in Settings.');
  }

  if (authFailed) {
    throw new Error('API Error: Invalid API key (401/403). Check API Key in Settings.');
  }

  throw new Error('API Error: Check API Key in Settings');
}
