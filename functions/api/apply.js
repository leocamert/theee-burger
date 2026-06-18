import { json, nowIso } from './_utils.js';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const OK_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function bufToBase64(buf) {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

// POST /api/apply  — public: a job application with an optional résumé file
export async function onRequestPost(context) {
  let form;
  try {
    form = await context.request.formData();
  } catch (e) {
    return json({ error: 'Invalid form submission.' }, 400);
  }

  const name = String(form.get('name') || '').trim().slice(0, 120);
  const email = String(form.get('email') || '').trim().slice(0, 160);
  const phone = String(form.get('phone') || '').trim().slice(0, 40);
  const position = String(form.get('position') || '').trim().slice(0, 80);
  const message = String(form.get('message') || '').trim().slice(0, 2000);

  if (!name || !email) return json({ error: 'Name and email are required.' }, 400);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: 'Please enter a valid email.' }, 400);

  let resumeName = null, resumeType = null, resumeData = null;
  const file = form.get('resume');
  if (file && typeof file === 'object' && file.size) {
    if (file.size > MAX_BYTES) return json({ error: 'Résumé must be under 4 MB.' }, 400);
    const rawName = String(file.name || 'resume').slice(0, 160);
    const ext = rawName.split('.').pop().toLowerCase();
    const allowedExts = ['pdf', 'doc', 'docx'];
    
    const mimeOk = file.type && OK_TYPES.includes(file.type);
    const extOk = allowedExts.includes(ext);
    
    if (!mimeOk && !extOk) {
      return json({ error: 'Résumé must be a PDF or Word document.' }, 400);
    }
    
    const buf = await file.arrayBuffer();
    resumeName = rawName;
    resumeType = file.type || 'application/octet-stream';
    resumeData = bufToBase64(buf);
  }

  try {
    await context.env.DB.prepare(
      `INSERT INTO applications (name, email, phone, position, message, resume_name, resume_type, resume_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(name, email, phone, position, message, resumeName, resumeType, resumeData, nowIso())
      .run();
    return json({ ok: true });
  } catch (e) {
    console.error("Submission error:", e);
    return json({ error: 'Could not submit your application.' }, 500);
  }
}
