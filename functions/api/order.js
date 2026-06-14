import { json, nowIso } from './_utils.js';

// POST /api/order  — public: a seated customer places an order
export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch (e) {
    return json({ error: 'Invalid request.' }, 400);
  }

  const table = String(body.table || '').trim().slice(0, 20);
  const customer = String(body.customer || '').trim().slice(0, 20);
  const items = Array.isArray(body.items) ? body.items : [];

  if (!table || !customer) return json({ error: 'Table and customer number are required.' }, 400);
  if (!items.length) return json({ error: 'Your order is empty.' }, 400);

  // Recompute the total server-side from the submitted items (trust nothing from the client price-wise beyond sanity)
  const clean = items
    .map((i) => {
      const extras = Array.isArray(i.extras)
        ? i.extras
            .map((e) => ({ name: String(e.name || '').slice(0, 60), price: Math.max(0, Number(e.price) || 0) }))
            .filter((e) => e.name)
            .slice(0, 10)
        : [];
      return {
        id: String(i.id || '').slice(0, 40),
        name: String(i.name || '').slice(0, 80),
        qty: Math.max(1, Math.min(99, parseInt(i.qty, 10) || 0)),
        price: Math.max(0, Number(i.price) || 0),
        extras,
        note: String(i.note || '').slice(0, 200),
      };
    })
    .filter((i) => i.id && i.qty > 0)
    .slice(0, 100);
  if (!clean.length) return json({ error: 'Your order is empty.' }, 400);
  const total = clean.reduce((s, i) => s + i.qty * (i.price + i.extras.reduce((a, e) => a + e.price, 0)), 0);
  const notes = String(body.notes || '').trim().slice(0, 500);

  try {
    const res = await context.env.DB.prepare(
      'INSERT INTO orders (table_number, customer_number, items, total, status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(table, customer, JSON.stringify(clean), total, 'new', notes, nowIso())
      .run();
    return json({ ok: true, id: res.meta.last_row_id });
  } catch (e) {
    return json({ error: 'Could not save the order.' }, 500);
  }
}
