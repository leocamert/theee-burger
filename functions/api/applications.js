import { json, requireAuth } from './_utils.js';

// GET /api/applications  — staff only: list job applications (metadata, no file blob)
export async function onRequestGet(context) {
  const denied = requireAuth(context);
  if (denied) return denied;
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, name, email, phone, position, message, resume_name, created_at,
              (resume_data IS NOT NULL) AS has_resume
       FROM applications ORDER BY created_at DESC LIMIT 200`
    ).all();
    return json({ ok: true, applications: results || [] });
  } catch (e) {
    return json({ error: 'Could not load applications.' }, 500);
  }
}
