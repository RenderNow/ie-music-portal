// app/api/submitBadge/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  // Construct your payload here. You can also extract request body if needed.
  const payload = {
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "<VC_ID>",
    "type": ["VerifiableCredential", "OpenBadgeCredential"],
    "issuer": {
      "id": "<OC_ID_OF_ISSUER>",
      "type": "Organization",
      "name": "Open Campus ID"
    },
    "awardedDate": "2024-01-01", 
    "validFrom": "2024-01-01",
    "validTo": "2024-01-01",
    "image": "https://example.com/profiles/johndoe.png",
    "description": "Lorem Ipsum",
    "proof": {
      "type": "<SIGNATURE_TYPE>",
      "created": "<ISOSTRONG>",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "<did:web:network.learncard.com#owner>",
      "@context": [
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "proofValue": "<PROOF_VALUE>"
    },
    "credentialSubject": {
      "id": "<OC_ID_OF_HOLDER>",
      "type": "Person",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "profileUrl": "https://id.opencampus.com/profiles/johndoe.edu",
      "achievement": {
        "id": "<OC_ID_OF_ISSUER:ACHIEVEMENT_ID>",
        "type": "Achievement",
        "achievementType": "Certification",
        "image": "<IMAGE_URL_OF_CREDENTIAL>",
        "name": "Blockchain Certification",
        "description": "Completed a comprehensive blockchain certification program.",
        "criteria": {
          "narrative": "Students of Rise In are awarded this after completing the Blockchain Fundamentals course."
        },
        "attachments": [
          {
            "url": "<URL_OF_ATTACHMENT>",
            "type": "certificate", 
            "title": "Certificate Attachment"
          }
        ]
      },
      "ext:OC_CUSTOM:custom": {
        "ext:OC_CUSTOM:<OC_ID_OF_ISSUER>:key1": "custom value 1",
        "ext:OC_CUSTOM:<OC_ID_OF_ISSUER>:key2": "custom value 2"
      }
    }
  };

  try {
    const response = await fetch('https://api.vc.staging.opencampus.xyz/issuer/vc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.OPENCAMPUS_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    // Attempt to parse the response from the OCID API
    let data = {};
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (jsonError) {
      console.error('Error parsing JSON from OCID API:', jsonError);
    }

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    return NextResponse.json({ message: 'Badge submitted successfully', data });
  } catch (error) {
    console.error('Error submitting badge:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

