export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/gold-price' && request.method === 'GET') {
      return handleGoldPrice();
    }

    // Everything else falls through to static assets
    return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler;

async function handleGoldPrice(): Promise<Response> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=900',
  };

  // Strategy 1: goldprice.org
  try {
    const res = await fetch('https://data-asg.goldprice.org/dbXRates/USD', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (res.ok) {
      const data: Record<string, unknown> = await res.json();
      const items = data.items as Array<Record<string, number>> | undefined;
      const pricePerOz = items?.[0]?.xauPrice;
      if (pricePerOz && pricePerOz > 0) {
        return new Response(JSON.stringify({
          pricePerGramUSD: pricePerOz / 31.1035,
          source: 'goldprice.org',
          timestamp: new Date().toISOString(),
        }), { headers });
      }
    }
  } catch { /* try next */ }

  // Strategy 2: NBP (Poland Central Bank) — gold price in PLN, convert to USD
  try {
    const [nbpRes, ratesRes] = await Promise.all([
      fetch('https://api.nbp.pl/api/cenyzlota/?format=json'),
      fetch('https://open.er-api.com/v6/latest/USD'),
    ]);
    if (nbpRes.ok && ratesRes.ok) {
      const nbpData = await nbpRes.json() as Array<{ cena: number }>;
      const ratesData = await ratesRes.json() as { rates: Record<string, number> };
      const plnPerUsd = ratesData.rates?.PLN;
      const goldPricePLN = nbpData?.[0]?.cena;
      if (plnPerUsd && goldPricePLN) {
        return new Response(JSON.stringify({
          pricePerGramUSD: goldPricePLN / plnPerUsd,
          source: 'nbp.pl',
          timestamp: new Date().toISOString(),
        }), { headers });
      }
    }
  } catch { /* try next */ }

  return new Response(JSON.stringify({ error: 'Unable to fetch gold price' }), {
    status: 502,
    headers,
  });
}
