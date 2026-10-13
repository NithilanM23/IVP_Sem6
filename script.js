/**
 * PulmoAI — AI Lung Disease Detection
 * script.js — Frontend demo logic
 */

'use strict';

/* ══════════════════════════════════════════════════
   DATA MAP — Predefined demo results
══════════════════════════════════════════════════ */
const dataMap = {
  "case1.png": {
    gradcam:      "images/gradcam/case1.png",
    prediction:   "Edema",
    confidence:   "76%",
    severity:     "Mild",
    affected_area:"13.05%",
    explanation:  "Highlighted regions indicate abnormal fluid accumulation in the interstitial spaces of the lung tissue. The model identified bilateral perihilar opacities consistent with pulmonary edema, likely of cardiogenic origin."
  },
  "case2.png": {
    gradcam:      "images/gradcam/case2.png",
    prediction:   "Pneumonia",
    confidence:   "82%",
    severity:     "Moderate",
    affected_area:"21.00%",
    explanation:  "Opacity regions in the right lower lobe suggest bacterial infection consolidating lung tissues. The Grad-CAM activation map highlights the primary area of pathology, consistent with lobar pneumonia."
  },
  "case3.png": {
    gradcam:      "images/gradcam/case3.png",
    prediction:   "Atelectasis",
    confidence:   "88%",
    severity:     "Moderate",
    affected_area:"17.42%",
    explanation:  "The Grad-CAM saliency map reveals linear band-like activations in the right lower lobe, consistent with subsegmental atelectasis — a partial collapse of alveolar air spaces. The model detected loss of volume and increased radiodensity along the basilar segments, suggesting airway obstruction or post-operative hypoventilation as likely contributing factors."
  },
  "case4.png": {
    gradcam:      "images/gradcam/case4.png",
    prediction:   "Pulmonary Nodule",
    confidence:   "91%",
    severity:     "Severe",
    affected_area:"6.78%",
    explanation:  "A focal high-activation region in the right upper lobe corresponds to a well-defined solitary pulmonary nodule approximately 1.8 cm in diameter. The model's attention is sharply localized, indicating a solid, non-calcified lesion with spiculated margins — a radiological pattern that warrants urgent follow-up CT imaging and possible biopsy to rule out malignancy."
  },
  "case5.png": {
    gradcam:      "images/gradcam/case5.png",
    prediction:   "Pleural Effusion",
    confidence:   "79%",
    severity:     "Mild",
    affected_area:"10.33%",
    explanation:  "Grad-CAM activations are concentrated in the left costophrenic angle and lower lateral pleural space, indicative of fluid accumulation between the visceral and parietal pleura. The blunting of the costophrenic angle and meniscus-shaped opacity are hallmarks of pleural effusion, likely transudate in origin. Clinical correlation with serum protein levels and cardiac function is recommended."
  }
};

/* ══════════════════════════════════════════════════
   STATE
══════════════════════════════════════════════════ */
let currentFile = null;
let uploadedObjectURL = null;

/* ══════════════════════════════════════════════════
   DOM REFERENCES
══════════════════════════════════════════════════ */
const sections = {
  landing:  document.getElementById('landing'),
  upload:   document.getElementById('upload'),
  loading:  document.getElementById('loading'),
  results:  document.getElementById('results')
};

const el = {
  btnPredict:     document.getElementById('btnPredict'),
  btnBack:        document.getElementById('btnBack'),
  btnAnalyze:     document.getElementById('btnAnalyze'),
  btnReset:       document.getElementById('btnReset'),
  btnNewScan:     document.getElementById('btnNewScan'),
  btnExport:      document.getElementById('btnExport'),
  fileInput:      document.getElementById('fileInput'),
  dropzone:       document.getElementById('dropzone'),
  previewCard:    document.getElementById('previewCard'),
  previewImg:     document.getElementById('previewImg'),
  piFileName:     document.getElementById('piFileName'),
  piFileSize:     document.getElementById('piFileSize'),
  piFileType:     document.getElementById('piFileType'),
  // Loading
  ls1:            document.getElementById('ls1'),
  ls2:            document.getElementById('ls2'),
  ls3:            document.getElementById('ls3'),
  ls4:            document.getElementById('ls4'),
  loadingBar:     document.getElementById('loadingBar'),
  loadingPct:     document.getElementById('loadingPct'),
  // Results
  resultOriginal: document.getElementById('resultOriginal'),
  resultGradcam:  document.getElementById('resultGradcam'),
  resPrediction:  document.getElementById('resPrediction'),
  resConfidence:  document.getElementById('resConfidence'),
  resConfBar:     document.getElementById('resConfBar'),
  resSeverity:    document.getElementById('resSeverity'),
  resArea:        document.getElementById('resArea'),
  resExplanation: document.getElementById('resExplanation'),
  reportTimestamp:document.getElementById('reportTimestamp'),
  // Modal
  noResultModal:  document.getElementById('noResultModal'),
  modalFileName:  document.getElementById('modalFileName'),
  btnModalClose:  document.getElementById('btnModalClose'),
};

/* ══════════════════════════════════════════════════
   SECTION NAVIGATION
══════════════════════════════════════════════════ */
function showSection(name) {
  Object.entries(sections).forEach(([key, sec]) => {
    if (key === name) {
      sec.classList.remove('exit');
      sec.classList.add('active');
    } else if (sec.classList.contains('active')) {
      sec.classList.add('exit');
      setTimeout(() => {
        sec.classList.remove('active', 'exit');
      }, 600);
    }
  });
}

/* ══════════════════════════════════════════════════
   PARTICLE CANVAS — Background effect
══════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x:   Math.random() * W,
      y:   Math.random() * H,
      r:   Math.random() * 1.5 + 0.3,
      vx:  (Math.random() - 0.5) * 0.25,
      vy:  (Math.random() - 0.5) * 0.25,
      o:   Math.random() * 0.5 + 0.1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 130) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.o})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  draw();
})();

/* ══════════════════════════════════════════════════
   TYPED ANIMATION — Landing title
══════════════════════════════════════════════════ */
(function typedAnimation() {
  const el = document.getElementById('typed-ai');
  if (!el) return;
  const text = 'AI Lung';
  el.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  let i = 0;
  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      setTimeout(type, 80 + Math.random() * 60);
    } else {
      // Keep cursor blinking for 2s then remove
      setTimeout(() => cursor.remove(), 2000);
    }
  }
  setTimeout(type, 600);
})();

/* ══════════════════════════════════════════════════
   LANDING → UPLOAD
══════════════════════════════════════════════════ */
el.btnPredict.addEventListener('click', () => {
  el.btnPredict.style.transform = 'scale(0.96)';
  setTimeout(() => { el.btnPredict.style.transform = ''; }, 150);

  // Glow pulse on button
  el.btnPredict.style.boxShadow = '0 0 60px rgba(56,189,248,0.6), 0 8px 32px rgba(2,132,199,0.5)';
  setTimeout(() => {
    el.btnPredict.style.boxShadow = '';
    showSection('upload');
  }, 350);
});

/* ══════════════════════════════════════════════════
   FILE INPUT — Drag-and-drop + Browse
══════════════════════════════════════════════════ */
el.dropzone.addEventListener('click', (e) => {
  if (e.target.tagName !== 'LABEL') el.fileInput.click();
});

el.dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  el.dropzone.classList.add('drag-over');
});
el.dropzone.addEventListener('dragleave', () => {
  el.dropzone.classList.remove('drag-over');
});
el.dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  el.dropzone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

el.fileInput.addEventListener('change', () => {
  const file = el.fileInput.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  currentFile = file;

  // Revoke previous object URL
  if (uploadedObjectURL) URL.revokeObjectURL(uploadedObjectURL);
  uploadedObjectURL = URL.createObjectURL(file);

  // Fill preview info
  el.piFileName.textContent = file.name;
  el.piFileSize.textContent = formatBytes(file.size);
  el.piFileType.textContent = file.type || 'image/*';
  el.previewImg.src = uploadedObjectURL;

  // Show preview card
  el.previewCard.style.display = 'flex';

  // Enable analyze button
  el.btnAnalyze.disabled = false;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ══════════════════════════════════════════════════
   ANALYZE BUTTON → LOADING
══════════════════════════════════════════════════ */
el.btnAnalyze.addEventListener('click', () => {
  if (!currentFile) return;
  showSection('loading');
  runLoadingSequence().then(() => {
    processResult();
  });
});

/* ── Loading sequence ── */
function runLoadingSequence() {
  return new Promise((resolve) => {
    const steps = [el.ls1, el.ls2, el.ls3, el.ls4];
    const stepDurations = [400, 600, 500, 400]; // ms each
    const totalDuration = stepDurations.reduce((a, b) => a + b, 0) + 300;

    // Reset
    steps.forEach(s => { s.classList.remove('active', 'done'); });
    el.loadingBar.style.width = '0%';
    el.loadingPct.textContent = '0%';
    // Reset ring
    const ring = document.querySelector('.ring-progress');
    if (ring) { ring.style.animation = 'none'; void ring.offsetWidth; ring.style.animation = ''; }

    // Animate steps
    let elapsed = 0;
    steps.forEach((step, idx) => {
      setTimeout(() => {
        // Mark previous as done
        if (idx > 0) steps[idx - 1].classList.replace('active', 'done');
        step.classList.add('active');
      }, elapsed);
      elapsed += stepDurations[idx];
    });

    // Mark last as done
    setTimeout(() => steps[steps.length - 1].classList.replace('active', 'done'), elapsed);

    // Progress bar animation
    const startTime = Date.now();
    function animateBar() {
      const t = Date.now() - startTime;
      const pct = Math.min(100, Math.round((t / totalDuration) * 100));
      el.loadingBar.style.width = pct + '%';
      el.loadingPct.textContent = pct + '%';
      if (pct < 100) requestAnimationFrame(animateBar);
    }
    requestAnimationFrame(animateBar);

    setTimeout(resolve, totalDuration + 200);
  });
}

/* ══════════════════════════════════════════════════
   PROCESS RESULT
══════════════════════════════════════════════════ */
function processResult() {
  const fileName = currentFile.name;
  const data = dataMap[fileName];

  if (!data) {
    // Show no-result modal, return to upload
    el.modalFileName.textContent = fileName;
    showSection('upload');
    setTimeout(() => el.noResultModal.classList.add('show'), 100);
    return;
  }

  // Populate result section
  el.resultOriginal.src = uploadedObjectURL;
  el.resultGradcam.src  = data.gradcam;
  el.resPrediction.textContent  = data.prediction;
  el.resArea.textContent        = data.affected_area;
  el.resExplanation.textContent = data.explanation;

  // Confidence
  el.resConfidence.textContent = data.confidence;
  // Delay to allow transition in
  setTimeout(() => {
    el.resConfBar.style.width = data.confidence;
  }, 500);

  // Severity badge
  const sev = data.severity.toLowerCase();
  el.resSeverity.textContent = data.severity;
  el.resSeverity.className = 'sev-badge'; // reset
  el.resSeverity.classList.add(sev);

  // Timestamp
  el.reportTimestamp.textContent = `Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;

  showSection('results');
}

/* ══════════════════════════════════════════════════
   BACK / RESET / NEW SCAN
══════════════════════════════════════════════════ */
el.btnBack.addEventListener('click', () => showSection('landing'));

el.btnReset.addEventListener('click', () => {
  resetAll();
  showSection('landing');
});

el.btnNewScan.addEventListener('click', () => {
  resetAll();
  showSection('upload');
});

function resetAll() {
  currentFile = null;
  if (uploadedObjectURL) { URL.revokeObjectURL(uploadedObjectURL); uploadedObjectURL = null; }
  el.fileInput.value = '';
  el.previewCard.style.display = 'none';
  el.previewImg.src = '';
  el.btnAnalyze.disabled = true;
  el.piFileName.textContent = '—';
  el.piFileSize.textContent  = '—';
  el.piFileType.textContent  = '—';
  el.resConfBar.style.width  = '0%';
}

/* ══════════════════════════════════════════════════
   MODAL — No result
══════════════════════════════════════════════════ */
el.btnModalClose.addEventListener('click', () => {
  el.noResultModal.classList.remove('show');
});
el.noResultModal.addEventListener('click', (e) => {
  if (e.target === el.noResultModal) el.noResultModal.classList.remove('show');
});

/* ══════════════════════════════════════════════════
   EXPORT REPORT — Download as text
══════════════════════════════════════════════════ */
el.btnExport.addEventListener('click', () => {
  if (!currentFile) return;
  const data = dataMap[currentFile.name];
  if (!data) return;

  const report = `
PULMO AI — DIAGNOSTIC REPORT
════════════════════════════════════════
Generated : ${new Date().toLocaleString()}
Patient   : Demo Case (${currentFile.name})
Model     : ResNet-50 + Grad-CAM v2.4
════════════════════════════════════════

FINDINGS
────────
Prediction    : ${data.prediction}
Confidence    : ${data.confidence}
Severity      : ${data.severity}
Affected Area : ${data.affected_area}

CLINICAL INTERPRETATION
───────────────────────
${data.explanation}

EXPLAINABILITY
──────────────
Grad-CAM heatmap generated highlighting
class-discriminative regions.

DISCLAIMER
──────────
This report is generated by an AI demo system 
for research and educational purposes ONLY. It 
does NOT constitute a medical diagnosis. Always 
consult a qualified radiologist.

════════════════════════════════════════
PulmoAI v2.4 · Explainable AI · Research Demo
`.trim();

  const blob = new Blob([report], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `pulmoai_report_${currentFile.name.replace('.png','')}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

/* ══════════════════════════════════════════════════
   INJECT SVG GRADIENT into loading ring
══════════════════════════════════════════════════ */
(function injectRingGradient() {
  const svg = document.querySelector('.loader-ring svg');
  if (!svg) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#2dd4bf"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>`;
  svg.insertBefore(defs, svg.firstChild);
})();

/* ══════════════════════════════════════════════════
   INIT — show landing
══════════════════════════════════════════════════ */
showSection('landing');
