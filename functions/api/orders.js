import { json, requireAuth } from './_utils.js';

// GET /api/orders  — staff only: list recent orders for the kitchen dashboard
export async function onRequestGet(context) {
  const denied = requireAuth(context);
  if (denied) return denied;

  const url = new URL(context.request.url);
  const history = url.searchParams.get('history') === '1';

  try {
    let stmt;
    if (history) {
      // Owner view: everything from the last 365 days, all statuses
      const cutoff = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
      stmt = context.env.DB.prepare(
        `SELECT id, table_number, customer_number, items, total, status, created_at
         FROM orders WHERE created_at >= ? ORDER BY created_at DESC LIMIT 2000`
      ).bind(cutoff);
    } else {
      // Live board: active orders only
      stmt = context.env.DB.prepare(
        `SELECT id, table_number, customer_number, items, total, status, created_at
         FROM orders WHERE status != 'served' ORDER BY created_at DESC LIMIT 100`
      );
    }
    const { results } = await stmt.all();
    const orders = (results || []).map((r) => ({ ...r, items: JSON.parse(r.items || '[]') }));
    return json({ ok: true, orders });
  } catch (e) {
    return json({ error: 'Could not load orders.' }, 500);
  }
}
