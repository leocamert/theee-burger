import { json, requireAuth } from '../_utils.js';

const ALLOWED = ['new', 'preparing', 'served'];

// PATCH /api/orders/:id  — staff only: change an order's status
export async function onRequestPatch(context) {
  const denied = requireAuth(context);
  if (denied) return denied;

  const id = parseInt(context.params.id, 10);
  if (!id) return json({ error: 'Bad order id.' }, 400);

  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }
  const status = String(body.status || '');
  if (!ALLOWED.includes(status)) return json({ error: 'Bad status.' }, 400);

  try {
    await context.env.DB.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();
    return json({ ok: true });
  } catch (e) {
    return json({ error: 'Could not update the order.' }, 500);
  }
}
