import { json, requireAuth } from '../_utils.js';

// GET /api/resume/:id  — staff only: download an applicant's résumé file
export async function onRequestGet(context) {
  const denied = requireAuth(context);
  if (denied) return denied;

  const id = parseInt(context.params.id, 10);
  if (!id) return json({ error: 'Bad id.' }, 400);

  try {
    const row = await context.env.DB.prepare(
      'SELECT resume_name, resume_type, resume_data FROM applications WHERE id = ?'
    ).bind(id).first();
    if (!row || !row.resume_data) return json({ error: 'No résumé on file.' }, 404);

    const binary = atob(row.resume_data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    return new Response(bytes, {
      headers: {
        'content-type': row.resume_type || 'application/octet-stream',
        'content-disposition': `attachment; filename="${(row.resume_name || 'resume').replace(/"/g, '')}"`,
        'cache-control': 'no-store',
      },
    });
  } catch (e) {
    return json({ error: 'Could not load the résumé.' }, 500);
  }
}
