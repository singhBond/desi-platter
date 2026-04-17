// app/api/menu/route.ts
export async function GET() {
  try {
    const res = await fetch(
      'https://shibim.com/billing/shibim-billing/get-items.php?client_id=3',
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return Response.json(
      { status: false, message: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}