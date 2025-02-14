import { connectToDatabase } from "../../lib/mongodb"; // Use "lib" instead of "utils"

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🔍 Incoming Request Body:", body); // Debugging log

    const { ocId, name, email, ethAddress } = body;

    if (!ocId) {
      return new Response(JSON.stringify({ error: "Missing OCID" }), { status: 400 });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    let user = await usersCollection.findOne({ ocId });

    if (!user) {
      if (!name || !email || !ethAddress) {
        return new Response(JSON.stringify({ error: "User does not exist. Missing required fields to create." }), { status: 400 });
      }

      user = { ocId, name, email, ethAddress, achievements: [], createdAt: new Date() };
      await usersCollection.insertOne(user);
      console.log("✅ New User Created:", user);
    } else {
      // If `ethAddress` is provided, update the user.
      if (ethAddress) {
        await usersCollection.updateOne({ ocId }, { $set: { ethAddress } });
        console.log("🟢 User exists. Updated `ethAddress`:", ethAddress);
      }
    }

    return new Response(JSON.stringify({ achievements: user.achievements || [] }), { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
