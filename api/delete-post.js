export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'DELETE') return new Response('-1', { status: 405 });

  const authHeader = req.headers.get('x-delete-key');
  if (authHeader !== process.env.DELETE_KEY) return new Response('-1', { status: 401 });

  const { postId } = await req.json();

  // auth check only, no postId supplied
  if (!postId) return new Response('1', { status: 200 });

  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/posts?id=eq.${postId}`, {
    method: 'DELETE',
    headers: {
      'apikey': process.env.SUPABASE_KEY,
      'Authorization': 'Bearer ' + process.env.SUPABASE_KEY,
    }
  });

  return new Response(res.ok ? '1' : '-1', { status: res.ok ? 200 : 500 });
}
