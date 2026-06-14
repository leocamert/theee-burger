import { json, requireAuth } from './_utils.js';

// GET /api/orders  — staff only: list recent orders for the kitchen dashboard
export async function onRequestGet(context) {
  const denied = requireAuth(context);
  if (denied) return denied;

  const url = new URL(context.request.url);
  const includeServed = url.searchParams.get('all') === '1';
  const where = includeServed ? '' : "WHERE status != 'served'";

  try {
    const { results } = await context.env.DB.prepare(
      `SELECT id, table_number, customer_number, items, total, status, created_at
       FROM orders ${where} ORDER BY created_at DESC LIMIT 100`
    ).all();
    const orders = (results || []).map((r) => ({ ...r, items: JSON.parse(r.items || '[]') }));
    return json({ ok: true, orders });
  } catch (e) {
    return json({ error: 'Could not load orders.' }, 500);
  }
}
