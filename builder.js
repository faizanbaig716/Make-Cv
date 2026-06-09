/* ========================================
   PROCV BUILDER – FULL JS
   ======================================== */

/* STATE */
let template = 'modern';
let photoData = null;
let edu = [], exp = [], skills = [], langs = [], certs = [], projs = [];
let uid = 1;
const id = () => uid++;

/* INIT */
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const t = params.get('template');
  if (['modern','classic','minimal','creative'].includes(t)) setTemplate(t);
  renderEduList(); renderExpList(); renderCertList(); renderProjList();
  render(); calcATS();
});

/* TABS */
function gotoTab(name, btn) {
  document.querySelectorAll('.btab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.bpane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('bpane-' + name).classList.add('active');
}

/* TEMPLATE */
function setTemplate(t) {
  template = t;
  document.getElementById('current-template-name').textContent = t.charAt(0).toUpperCase() + t.slice(1);
  document.querySelectorAll('.mt-card').forEach(c => c.classList.remove('active'));
  const el = document.getElementById('mt-' + t);
  if (el) el.classList.add('active');
  document.getElementById('template-modal').style.display = 'none';
  render();
}

function openTemplateModal() {
  const m = document.getElementById('template-modal');
  m.style.display = 'flex';
  document.querySelectorAll('.mt-card').forEach(c => c.classList.remove('active'));
  const el = document.getElementById('mt-' + template);
  if (el) el.classList.add('active');
}

function closeTemplateModal(e) {
  if (e.target === document.getElementById('template-modal'))
    document.getElementById('template-modal').style.display = 'none';
}

/* PHOTO */
function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('⚠ Photo must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    photoData = e.target.result;
    document.getElementById('photo-img').src = photoData;
    document.getElementById('photo-img').style.display = 'block';
    document.getElementById('photo-empty').style.display = 'none';
    document.getElementById('btn-photo-remove').style.display = 'inline-flex';
    render();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  photoData = null;
  document.getElementById('photo-img').style.display = 'none';
  document.getElementById('photo-file').value = '';
  document.getElementById('photo-empty').style.display = 'flex';
  document.getElementById('btn-photo-remove').style.display = 'none';
  render();
}

/* HELPERS */
function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

function formatDesc(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(line => {
    line = line.trim();
    const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const content = isBullet ? line.replace(/^[•\-\*]\s*/, '') : line;
    return `<div class="cv-desc-line">${isBullet ? '<span class="cv-bullet">•</span>' : ''}<span>${content}</span></div>`;
  }).join('');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* EDUCATION */
function addEdu() {
  edu.push({ id: id(), degree: '', school: '', year: '', grade: '' });
  renderEduList(); render();
}
function delEdu(i) { edu = edu.filter(e => e.id !== i); renderEduList(); render(); }
function renderEduList() {
  document.getElementById('edu-list').innerHTML = edu.map(e => `
    <div class="entry-card">
      <div class="ec-header">
        <span class="ec-title">🎓 ${e.degree || 'Education entry'}</span>
        <div class="ec-actions">
          <button class="btn-ec-del" onclick="delEdu(${e.id})" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      <div class="ec-body">
        <div class="ec-full"><label>Degree / Qualification</label><input value="${e.degree}" placeholder="BS Computer Science" oninput="edu.find(x=>x.id===${e.id}).degree=this.value;renderEduList();render()"></div>
        <div class="ec-full"><label>Institution</label><input value="${e.school}" placeholder="FAST University, Lahore" oninput="edu.find(x=>x.id===${e.id}).school=this.value;render()"></div>
        <div><label>Year / Period</label><input value="${e.year}" placeholder="2018 – 2022" oninput="edu.find(x=>x.id===${e.id}).year=this.value;render()"></div>
        <div><label>Grade / GPA</label><input value="${e.grade}" placeholder="3.8 / 4.0" oninput="edu.find(x=>x.id===${e.id}).grade=this.value;render()"></div>
      </div>
    </div>`).join('');
}

/* EXPERIENCE */
function addExp() {
  exp.push({ id: id(), role: '', company: '', period: '', desc: '' });
  renderExpList(); render();
}
function delExp(i) { exp = exp.filter(e => e.id !== i); renderExpList(); render(); }
function renderExpList() {
  document.getElementById('exp-list').innerHTML = exp.map(e => `
    <div class="entry-card">
      <div class="ec-header">
        <span class="ec-title">💼 ${e.role || 'Experience entry'}</span>
        <div class="ec-actions">
          <button class="btn-ec-del" onclick="delExp(${e.id})" title="Delete">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
          </button>
        </div>
      </div>
      <div class="ec-body">
        <div class="ec-full"><label>Job title</label><input value="${e.role}" placeholder="Senior Frontend Developer" oninput="exp.find(x=>x.id===${e.id}).role=this.value;renderExpList();render();calcATS()"></div>
        <div class="ec-full"><label>Company</label><input value="${e.company}" placeholder="Systems Limited" oninput="exp.find(x=>x.id===${e.id}).company=this.value;render()"></div>
        <div class="ec-full"><label>Period</label><input value="${e.period}" placeholder="Jan 2022 – Present" oninput="exp.find(x=>x.id===${e.id}).period=this.value;render()"></div>
        <div class="ec-full"><label>Description <span style="font-weight:400;color:#9aa0a6">(start lines with • for bullets)</span></label>
          <textarea rows="4" placeholder="• Built REST APIs with Node.js&#10;• Reduced page load by 40%&#10;• Led team of 5 developers" oninput="exp.find(x=>x.id===${e.id}).desc=this.value;render();calcATS()">${e.desc}</textarea>
        </div>
      </div>
    </div>`).join('');
}

/* SKILLS */
function addSkill() {
  const inp = document.getElementById('skill-inp');
  const v = inp.value.trim();
  if (v && !skills.includes(v)) { skills.push(v); inp.value = ''; renderSkillTags(); render(); calcATS(); }
}
function qSkill(s) { if (!skills.includes(s)) { skills.push(s); renderSkillTags(); render(); calcATS(); } }
function removeSkill(s) { skills = skills.filter(x => x !== s); renderSkillTags(); render(); calcATS(); }
function renderSkillTags() {
  document.getElementById('skill-tags').innerHTML = skills.map(s =>
    `<div class="stag">${s}<button onclick="removeSkill(${JSON.stringify(s)})">×</button></div>`).join('');
}

function addLang() {
  const inp = document.getElementById('lang-inp');
  const v = inp.value.trim();
  if (v && !langs.includes(v)) { langs.push(v); inp.value = ''; renderLangTags(); render(); }
}
function qLang(l) { if (!langs.includes(l)) { langs.push(l); renderLangTags(); render(); } }
function removeLang(l) { langs = langs.filter(x => x !== l); renderLangTags(); render(); }
function renderLangTags() {
  document.getElementById('lang-tags').innerHTML = langs.map(l =>
    `<div class="stag">${l}<button onclick="removeLang(${JSON.stringify(l)})">×</button></div>`).join('');
}

/* CERTIFICATIONS */
function addCert() {
  certs.push({ id: id(), name: '', org: '', year: '' });
  renderCertList(); render();
}
function delCert(i) { certs = certs.filter(c => c.id !== i); renderCertList(); render(); }
function renderCertList() {
  document.getElementById('cert-list').innerHTML = certs.map(c => `
    <div class="entry-card">
      <div class="ec-header">
        <span class="ec-title">🏅 ${c.name || 'Certification'}</span>
        <button class="btn-ec-del" onclick="delCert(${c.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="ec-body">
        <div class="ec-full"><label>Certification name</label><input value="${c.name}" placeholder="AWS Certified Solutions Architect" oninput="certs.find(x=>x.id===${c.id}).name=this.value;renderCertList();render()"></div>
        <div><label>Issuing organization</label><input value="${c.org}" placeholder="Amazon Web Services" oninput="certs.find(x=>x.id===${c.id}).org=this.value;render()"></div>
        <div><label>Year</label><input value="${c.year}" placeholder="2024" oninput="certs.find(x=>x.id===${c.id}).year=this.value;render()"></div>
      </div>
    </div>`).join('');
}

/* PROJECTS */
function addProj() {
  projs.push({ id: id(), name: '', tech: '', url: '', desc: '' });
  renderProjList(); render();
}
function delProj(i) { projs = projs.filter(p => p.id !== i); renderProjList(); render(); }
function renderProjList() {
  document.getElementById('proj-list').innerHTML = projs.map(p => `
    <div class="entry-card">
      <div class="ec-header">
        <span class="ec-title">💻 ${p.name || 'Project'}</span>
        <button class="btn-ec-del" onclick="delProj(${p.id})">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="ec-body">
        <div class="ec-full"><label>Project name</label><input value="${p.name}" placeholder="E-commerce Platform" oninput="projs.find(x=>x.id===${p.id}).name=this.value;renderProjList();render()"></div>
        <div><label>Tech stack</label><input value="${p.tech}" placeholder="React, Node.js, MongoDB" oninput="projs.find(x=>x.id===${p.id}).tech=this.value;render()"></div>
        <div><label>URL (optional)</label><input value="${p.url}" placeholder="github.com/ahmed/project" oninput="projs.find(x=>x.id===${p.id}).url=this.value;render()"></div>
        <div class="ec-full"><label>Description</label><textarea rows="3" placeholder="Brief description of the project and your role..." oninput="projs.find(x=>x.id===${p.id}).desc=this.value;render()">${p.desc}</textarea></div>
      </div>
    </div>`).join('');
}

/* ATS SCORE */
function calcATS() {
  const checks = [];
  let score = 0;

  const name = val('p-name');
  const email = val('p-email');
  const phone = val('p-phone');
  const summary = val('p-summary');
  const title = val('p-title');

  // Contact info (20pts)
  if (name) { score += 8; checks.push({ pass: true, text: 'Name present' }); }
  else checks.push({ pass: false, text: 'Name missing — required' });

  if (email) { score += 7; checks.push({ pass: true, text: 'Email present' }); }
  else checks.push({ pass: false, text: 'Email missing — required' });

  if (phone) { score += 5; checks.push({ pass: true, text: 'Phone number present' }); }
  else checks.push({ warn: true, text: 'Phone number missing' });

  // Summary (15pts)
  if (summary && summary.length >= 50) { score += 15; checks.push({ pass: true, text: 'Professional summary found' }); }
  else if (summary) { score += 7; checks.push({ warn: true, text: 'Summary too short (aim for 50+ chars)' }); }
  else checks.push({ fail: true, text: 'No summary — add one to boost ATS' });

  // Job title (10pts)
  if (title) { score += 10; checks.push({ pass: true, text: 'Job title present' }); }
  else checks.push({ warn: true, text: 'Job title missing' });

  // Experience (20pts)
  const validExp = exp.filter(e => e.role && e.company);
  if (validExp.length >= 2) { score += 20; checks.push({ pass: true, text: `${validExp.length} work experiences listed` }); }
  else if (validExp.length === 1) { score += 10; checks.push({ warn: true, text: 'Only 1 experience (add more if possible)' }); }
  else checks.push({ fail: true, text: 'No work experience — add at least one' });

  // Skills (15pts)
  if (skills.length >= 5) { score += 15; checks.push({ pass: true, text: `${skills.length} skills listed (great!)` }); }
  else if (skills.length >= 2) { score += 8; checks.push({ warn: true, text: `${skills.length} skills (aim for 5+)` }); }
  else checks.push({ fail: true, text: 'Too few skills listed (add 5+)' });

  // Education (10pts)
  const validEdu = edu.filter(e => e.degree || e.school);
  if (validEdu.length) { score += 10; checks.push({ pass: true, text: 'Education listed' }); }
  else checks.push({ warn: true, text: 'No education listed' });

  // Bullet points in exp (5pts)
  const hasBullets = exp.some(e => e.desc && (e.desc.includes('•') || e.desc.includes('-')));
  if (hasBullets) { score += 5; checks.push({ pass: true, text: 'Bullet points in experience ✓' }); }
  else if (validExp.length) checks.push({ warn: true, text: 'Add bullet points to experience' });

  // Certs bonus (5pts)
  if (certs.filter(c => c.name).length) { score += 5; checks.push({ pass: true, text: 'Certifications listed' }); }

  score = Math.min(100, score);

  // Update mini display
  const circumference = 100;
  const fill = (score / 100) * circumference;
  const ring = document.getElementById('ats-ring');
  if (ring) {
    ring.setAttribute('stroke-dasharray', `${fill} ${circumference}`);
    ring.setAttribute('stroke', score >= 70 ? '#4ade80' : score >= 40 ? '#fbbf24' : '#f87171');
  }
  document.getElementById('ats-score-mini').textContent = score;
  document.getElementById('ats-mini-sub').textContent =
    score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';

  // Update panel
  const donut = document.getElementById('ats-donut-ring');
  if (donut) {
    const circ = 201;
    donut.setAttribute('stroke-dasharray', `${(score / 100) * circ} ${circ}`);
    donut.setAttribute('stroke', score >= 70 ? '#188038' : score >= 40 ? '#ea8600' : '#d93025');
  }
  const scoreEl = document.getElementById('ats-donut-score');
  if (scoreEl) scoreEl.textContent = score;
  const labelEl = document.getElementById('ats-score-label');
  if (labelEl) labelEl.textContent =
    score >= 80 ? '🟢 Excellent — ATS ready!' :
    score >= 60 ? '🟡 Good — minor improvements needed' :
    score >= 40 ? '🟠 Fair — needs more content' :
    '🔴 Needs work — fill more sections';

  const checksEl = document.getElementById('ats-checks');
  if (checksEl) {
    checksEl.innerHTML = '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin-bottom:6px">Checklist</div>' +
      checks.map(c => `
        <div class="ats-check-item ${c.pass ? 'pass' : c.warn ? 'warn' : 'fail'}">
          <span>${c.pass ? '✓' : c.warn ? '⚠' : '✗'}</span>
          <span>${c.text}</span>
        </div>`).join('');
  }

  const tips = [];
  if (!summary) tips.push('💡 Add a professional summary — it significantly boosts ATS score');
  if (skills.length < 5) tips.push('💡 List at least 5 relevant skills matching the job description');
  if (!hasBullets && validExp.length) tips.push('💡 Use bullet points (•) in experience to list achievements clearly');
  if (validExp.length === 0) tips.push('💡 Add work experience — even internships count');
  if (!certs.length) tips.push('💡 Certifications stand out — add any relevant ones');

  const tipsEl = document.getElementById('ats-tips');
  if (tipsEl && tips.length) {
    tipsEl.innerHTML = '<div class="ats-tips-title">Tips to improve</div>' +
      tips.map(t => `<div class="ats-tip">${t}</div>`).join('');
  } else if (tipsEl) tipsEl.innerHTML = '';
}

/* RENDER PREVIEW */
function render() {
  const name = val('p-name');
  const title = val('p-title');
  const email = val('p-email');
  const phone = val('p-phone');
  const loc = val('p-loc');
  const link = val('p-link');
  const summary = val('p-summary');

  const hasContent = name || email || exp.length || edu.length || skills.length;

  if (!hasContent) {
    document.getElementById('cv-preview').className = 'cv-page';
    document.getElementById('cv-preview').innerHTML = `
      <div class="cv-empty">
        <div class="cv-empty-icon">📄</div>
        <h3>Your CV will appear here</h3>
        <p>Start filling in your details on the left and watch your professional CV come to life in real time.</p>
      </div>`;
    return;
  }

  const contacts = [
    email ? `✉ ${email}` : '',
    phone ? `✆ ${phone}` : '',
    loc ? `⌖ ${loc}` : '',
    link ? `⬡ ${link}` : ''
  ].filter(Boolean);

  const page = document.getElementById('cv-preview');
  page.className = `cv-page tpl-${template}`;

  let html = '';

  if (template === 'modern') html = renderModern(name, title, contacts, summary);
  else if (template === 'classic') html = renderClassic(name, title, contacts, summary);
  else if (template === 'minimal') html = renderMinimal(name, title, contacts, summary);
  else if (template === 'creative') html = renderCreative(name, title, contacts, summary);

  page.innerHTML = html;
}

function photoHTML(cls) {
  return photoData ? `<img class="${cls}" src="${photoData}" alt="Profile photo">` : '';
}

function contactsHTML(contacts) {
  return contacts.map(c => `<span>${c}</span>`).join('');
}

function renderModern(name, title, contacts, summary) {
  let h = `<div class="cv-header">`;
  if (photoData) h += photoHTML('cv-photo');
  h += `<div class="cv-header-text">
    <div class="cv-name">${name || 'Your Name'}</div>
    ${title ? `<div class="cv-title">${title}</div>` : ''}
    <div class="cv-contacts">${contactsHTML(contacts)}</div>
  </div></div>`;
  h += bodyHTML(summary);
  return h;
}

function renderClassic(name, title, contacts, summary) {
  let h = `<div class="cv-header">`;
  if (photoData) h += photoHTML('cv-photo');
  h += `<div class="cv-name">${name || 'Your Name'}</div>
    ${title ? `<div class="cv-title">${title}</div>` : ''}
    <div class="cv-contacts">${contactsHTML(contacts)}</div>
  </div>`;
  h += bodyHTML(summary);
  return h;
}

function renderMinimal(name, title, contacts, summary) {
  let h = `<div class="cv-header" style="overflow:hidden">`;
  if (photoData) h += photoHTML('cv-photo');
  h += `<div class="cv-name">${name || 'Your Name'}</div>
    ${title ? `<div class="cv-title">${title}</div>` : ''}
    <div class="cv-contacts">${contactsHTML(contacts)}</div>
  </div>`;
  h += bodyHTML(summary);
  return h;
}

function renderCreative(name, title, contacts, summary) {
  let h = `<div class="cv-header">`;
  if (photoData) h += photoHTML('cv-photo');
  h += `<div class="cv-header-text">
    <div class="cv-name">${name || 'Your Name'}</div>
    ${title ? `<div class="cv-title">${title}</div>` : ''}
    <div class="cv-contacts">${contactsHTML(contacts)}</div>
  </div></div>`;
  h += bodyHTML(summary);
  return h;
}

function bodyHTML(summary) {
  let h = '';

  if (summary) {
    h += `<div class="cv-section">
      <div class="cv-sec-title">Professional Summary</div>
      <div class="cv-summary">${summary}</div>
    </div>`;
  }

  const validExp = exp.filter(e => e.role || e.company);
  if (validExp.length) {
    h += `<div class="cv-section"><div class="cv-sec-title">Work Experience</div>`;
    validExp.forEach(e => {
      h += `<div class="cv-item">
        <div class="cv-item-row">
          <div class="cv-item-name">${e.role || 'Position'}</div>
          ${e.period ? `<div class="cv-item-date">${e.period}</div>` : ''}
        </div>
        ${e.company ? `<div class="cv-item-sub">${e.company}</div>` : ''}
        ${e.desc ? `<div class="cv-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`;
    });
    h += `</div>`;
  }

  const validEdu = edu.filter(e => e.degree || e.school);
  if (validEdu.length) {
    h += `<div class="cv-section"><div class="cv-sec-title">Education</div>`;
    validEdu.forEach(e => {
      h += `<div class="cv-item">
        <div class="cv-item-row">
          <div class="cv-item-name">${e.degree || 'Qualification'}</div>
          ${e.year ? `<div class="cv-item-date">${e.year}</div>` : ''}
        </div>
        <div class="cv-item-row" style="margin-top:1px">
          ${e.school ? `<div class="cv-item-sub">${e.school}</div>` : '<div></div>'}
          ${e.grade ? `<div style="font-size:10px;color:#9aa0a6">${e.grade}</div>` : ''}
        </div>
      </div>`;
    });
    h += `</div>`;
  }

  if (skills.length) {
    h += `<div class="cv-section">
      <div class="cv-sec-title">Technical Skills</div>
      <div class="cv-chips">${skills.map(s => `<span class="cv-chip">${s}</span>`).join('')}</div>
    </div>`;
  }

  if (langs.length) {
    h += `<div class="cv-section">
      <div class="cv-sec-title">Languages</div>
      <div class="cv-chips">${langs.map(l => `<span class="cv-chip">${l}</span>`).join('')}</div>
    </div>`;
  }

  const validCerts = certs.filter(c => c.name);
  if (validCerts.length) {
    h += `<div class="cv-section"><div class="cv-sec-title">Certifications</div>`;
    validCerts.forEach(c => {
      h += `<div class="cv-item">
        <div class="cv-item-row">
          <div class="cv-item-name">${c.name}</div>
          ${c.year ? `<div class="cv-item-date">${c.year}</div>` : ''}
        </div>
        ${c.org ? `<div class="cv-item-sub">${c.org}</div>` : ''}
      </div>`;
    });
    h += `</div>`;
  }

  const validProjs = projs.filter(p => p.name);
  if (validProjs.length) {
    h += `<div class="cv-section"><div class="cv-sec-title">Projects</div>`;
    validProjs.forEach(p => {
      h += `<div class="cv-item">
        <div class="cv-item-row">
          <div class="cv-item-name">${p.name}</div>
          ${p.url ? `<div class="cv-item-date" style="font-size:9px">${p.url}</div>` : ''}
        </div>
        ${p.tech ? `<div class="cv-item-sub">${p.tech}</div>` : ''}
        ${p.desc ? `<div class="cv-desc"><div class="cv-desc-line"><span>${p.desc}</span></div></div>` : ''}
      </div>`;
    });
    h += `</div>`;
  }

  return h;
}

/* DOWNLOAD PDF */
function downloadPDF() {
  const page = document.getElementById('cv-preview');
  const empty = page.querySelector('.cv-empty');
  if (empty) { showToast('⚠ Please add some details first!'); return; }

  const name = val('p-name') || 'My_CV';
  const filename = name.replace(/\s+/g, '_') + `_${template}_CV.pdf`;

  // Clone for clean export
  const clone = page.cloneNode(true);
  clone.style.cssText = 'width:170mm;padding:15mm 18mm;font-size:11.5px;line-height:1.55;';

  const opt = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2.5, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const btn = document.querySelector('.btn-dl-nav');
  btn.textContent = 'Generating...';

  html2pdf().set(opt).from(page).save().then(() => {
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download PDF';
    showToast('✓ PDF downloaded successfully!');
  }).catch(() => {
    btn.innerHTML = 'Download PDF';
    showToast('⚠ Download failed — try again');
  });
}

function toggleFullscreen() {
  const area = document.getElementById('preview-area');
  area.classList.toggle('fullscreen-preview');
}
