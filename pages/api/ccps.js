export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 🔑 API Key environment variable se utha li
    const apiKey = process.env.CCPS_API_KEY;

    const apiRes = await fetch("https://dbimtoolkit.digifootprint.gov.in/backend/api/ccps", {
      method: "POST",
      headers: {
        "Apikey": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        host_url: "https://probeqa.example.gov.in"
      }),
      cache: 'no-store'
    });

    const textData = await apiRes.text();
    let jsonData;
    try {
      jsonData = JSON.parse(textData);
    } catch (e) {
      jsonData = { rawText: textData };
    }

    return res.status(apiRes.status).json({
      status: apiRes.status,
      ok: apiRes.ok,
      data: jsonData
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}