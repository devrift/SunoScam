import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Launch Web Companion button in hero
html = html.replace(/<a class="btn btn-glass" href="\/app"[\s\S]*?<span>Launch Web Companion<\/span>\s*<\/a>\s*/, '');

// 2. Remove Web Companion from footer platform column
html = html.replace(/<li><a href="\/app">Web Companion<\/a><\/li>\s*/, '');

// 3. Update kicker badge in hero to indicate PROTOTYPE PHASE
html = html.replace(
  /<span>REAL-TIME SCAM GUARD &bull; v1\.0\.0 VERIFIED<\/span>/,
  '<span>PROTOTYPE PHASE &bull; REAL-TIME AI SCAM GUARD</span>'
);

// 4. Update banner / callout or hero note indicating Prototype status
html = html.replace(
  /<div class="callout safety">[\s\S]*?<strong>The Core Tenet:<\/strong>/,
  `<div class="callout safety">
            <div style="display:inline-block; font-size:0.75rem; font-weight:800; color:#f59e0b; background:rgba(245,158,11,0.2); padding:2px 8px; border-radius:4px; margin-bottom:8px;">EXPERIMENTAL PROTOTYPE NOTICE</div><br>
            <strong>The Core Tenet:</strong>`
);

// 5. In Section 2 (Quickstart), replace Web Companion tab
html = html.replace(
  /<button class="tab-btn active" data-tab="tab-win">Web Companion<\/button>/,
  '<button class="tab-btn active" data-tab="tab-win">Android Sideloading</button>'
);
html = html.replace(
  /<button class="tab-btn" data-tab="tab-linux">Android Sideloading<\/button>/,
  '<button class="tab-btn" data-tab="tab-linux">CLI &amp; ADB</button>'
);
html = html.replace(
  /<button class="tab-btn" data-tab="tab-android">CLI &amp; ADB<\/button>/,
  '<button class="tab-btn" data-tab="tab-android">Prototype Advisory</button>'
);

// Update Quickstart tab contents
html = html.replace(
  /<div class="tab-panel active" id="tab-win">[\s\S]*?<\/div>\s*<!-- Android Sideloading Tab -->\s*<div class="tab-panel" id="tab-linux">[\s\S]*?<\/div>\s*<!-- CLI Tab -->\s*<div class="tab-panel" id="tab-android">[\s\S]*?<\/div>/,
  `<div class="tab-panel active" id="tab-win">
              <p>Download and sideload the experimental APK build directly to your Android device:</p>
              <pre data-lang="bash" data-name="Direct Download">curl -O https://sunoscam.vercel.app/SunoScam-v1.0.0.apk
# Open Downloads on your phone &gt; tap 'SunoScam-v1.0.0.apk' &gt; Install</pre>
              <p>Supports Android 7.0+ (Nougat through Android 15).</p>
            </div>

            <!-- CLI Tab -->
            <div class="tab-panel" id="tab-linux">
              <p>Deploy via Android Debug Bridge (ADB):</p>
              <pre data-lang="bash" data-name="ADB Terminal">adb devices
adb install -r SunoScam-v1.0.0.apk</pre>
            </div>

            <!-- Prototype Tab -->
            <div class="tab-panel" id="tab-android">
              <p>Prototype Phase Advisory: SunoScam is actively undergoing experimental safety evaluation. Cloud model evaluations are throttled and backed up by local offline heuristics.</p>
            </div>`
);

// 6. In hero right column Tier 2 card, update text to reflect Prototype status
html = html.replace(
  /<strong style="font-size:0.92rem;">Android APK &amp; Web Companion<\/strong>/,
  '<strong style="font-size:0.92rem;">Android APK &bull; Prototype Build</strong>'
);
html = html.replace(
  /One-tap clipboard pasting, direct image uploads, file inspectors, and instant Hindi\/English family WhatsApp reply generator\./,
  'Experimental prototype APK with one-tap clipboard parsing, multimodal image OCR, file attachment inspection, and offline fraud heuristics.'
);

// 7. Add top Prototype Notice Banner
const protoBanner = `  <!-- Top Prototype Phase Notice Banner -->
  <div style="background: linear-gradient(90deg, rgba(245,158,11,0.15), rgba(234,88,12,0.2), rgba(245,158,11,0.15)); border-bottom: 1px solid rgba(245,158,11,0.3); padding: 8px 16px; text-align: center; font-size: 0.82rem; font-weight: 600; color: #fbbf24; letter-spacing: 0.02em; z-index: 100; position: relative;">
    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; margin-right: 8px; vertical-align: middle; box-shadow: 0 0 8px #f59e0b;"></span>
    PROTOTYPE PHASE: SunoScam is currently an experimental pre-release build. Features, detection heuristics, and weights are actively undergoing testing.
  </div>\n\n`;

if (!html.includes('PROTOTYPE PHASE: SunoScam is currently')) {
  html = html.replace('<body>', '<body>\n' + protoBanner);
}

fs.writeFileSync('index.html', html);
console.log('Successfully updated index.html for prototype phase and removed launch web companion');
