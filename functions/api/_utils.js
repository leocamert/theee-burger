// Shared helpers for THEEE BURGER Pages Functions

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

// Shared-password gate for staff endpoints.
// Returns null when authorized, or a 401 Response when not.
export function requireAuth(context) {
  const expected = context.env.KITCHEN_PASSWORD;
  if (!expected) return json({ error: 'Dashboard password is not configured yet.' }, 503);
  const given = context.request.headers.get('x-kitchen-pass') || '';
  if (given !== expected) return json({ error: 'Wrong password.' }, 401);
  return null;
}

export const nowIso = () => new Date().toISOString();
