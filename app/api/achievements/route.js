export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userOcId = searchParams.get("ocId");

    if (!userOcId) {
      return new Response(JSON.stringify({ error: "User OCID is required" }), { status: 400 });
    }

    // ✅ Load API Key from environment variables
    const apiKey = process.env.OPENCAMPUS_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing API Key");
      return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API Key" }), { status: 500 });
    }

    console.log(`🔍 Fetching achievements for: ${userOcId}`);

    // ✅ Test different API URLs
    const possibleUrls = [
      `https://api.vc.staging.opencampus.xyz/admin/vc/${userOcId}`, // Original
      `https://api.vc.staging.opencampus.xyz/issuer/vc/${userOcId}`, // Alternate
      `https://api.vc.opencampus.xyz/admin/vc/${userOcId}`, // Production?
    ];

    let response;
    for (const url of possibleUrls) {
      try {
        console.log(`🔍 Trying URL: ${url}`);
        response = await fetch(url, {
          method: "GET",
          headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        });

        if (response.ok) break; // ✅ Stop if we get a successful response
      } catch (error) {
        console.error(`❌ Failed request to: ${url}`);
      }
    }

    if (!response?.ok) {
      return new Response(JSON.stringify({ error: "API unreachable or incorrect endpoint" }), { status: 500 });
    }

    const data = await response.json();
    console.log("✅ Open Campus API Response:", data);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}
