import { connectToDatabase } from "../../lib/mongodb";

export async function POST(req) {
  try {
    const { holderOcId, name, description, image } = await req.json();

    if (!holderOcId || !name || !description || !image) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // ✅ Load credentials from .env.local
    const apiKey = process.env.OPENCAMPUS_API_KEY;
    const did = process.env.OPENCAMPUS_DID;
    const ethAddress = process.env.OPENCAMPUS_ETH_ADDRESS;

    if (!apiKey || !did || !ethAddress) {
      console.error("❌ Missing API credentials");
      return new Response(JSON.stringify({ error: "Server misconfiguration: Missing API credentials" }), { status: 500 });
    }

    // ✅ Create the payload for OpenCampus API
    const payload = {
      credentialPayload: {
        validFrom: new Date().toISOString(),
        awardedDate: new Date().toISOString(),
        description,
        credentialSubject: {
          name,
          type: "Person",
          email: `${holderOcId}@example.edu`,
          image,
          profileUrl: `https://id.opencampus.xyz/profiles/${holderOcId}`,
          achievement: {
            name,
            identifier: `oc:cert:${Date.now()}`,
            description,
            achievementType: "Badge",
          },
        },
      },
      holderOcId,
    };

    let response, data;
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        console.log(`🔄 Attempt ${attempt} to issue badge on OpenCampus...`);

        response = await fetch("https://api.vc.staging.opencampus.xyz/issuer/vc", {
          method: "POST",
          headers: {
            "X-API-KEY": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        data = await response.json();

        if (response.ok) {
          console.log("✅ Badge issued successfully on attempt:", attempt);
          break; // ✅ Exit loop if successful
        } else {
          console.error(`❌ Attempt ${attempt} failed:`, data);
          if (attempt < maxRetries) await new Promise((resolve) => setTimeout(resolve, 2000)); // ⏳ Wait 2s before retrying
        }
      } catch (error) {
        console.error(`❌ Error on attempt ${attempt}:`, error);
        if (attempt < maxRetries) await new Promise((resolve) => setTimeout(resolve, 2000)); // ⏳ Wait 2s before retrying
      }
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.message || "API Error" }), { status: response.status });
    }

    // ✅ Store badge in MongoDB
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    const badge = { name, description, image, issuedAt: new Date() };
    const result = await usersCollection.updateOne(
      { ocId: holderOcId },
      { $push: { achievements: badge } }
    );

    if (result.modifiedCount === 0) {
      console.error("❌ Failed to update user achievements");
      return new Response(JSON.stringify({ error: "Failed to update user achievements" }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Badge Issued Successfully!", badge }), { status: 200 });
  } catch (error) {
    console.error("❌ Server Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}

