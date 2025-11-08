import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log("📩 Sending to Watson:", message);

    const url = `${process.env.WATSON_SERVICE_URL}/v2/assistants/${process.env.WATSON_ASSISTANT_ID}/environments/${process.env.WATSON_ENVIRONMENT_ID}/message?version=${process.env.WATSON_API_VERSION}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from("apikey:" + process.env.WATSON_API_KEY).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "numina-user", // 👈 REQUIRED by Watson Actions
        input: {
          text: message,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Watson API error:", response.status, errText);
      return NextResponse.json(
        { reply: `Watson API error ${response.status}: ${response.statusText}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("🔍 Watson full response:", JSON.stringify(data, null, 2));

    const reply =
      data.output?.generic?.map((x: any) => x.text).join(" ") ||
      "Sorry, I didn’t get that.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("💥 Fatal error:", error);
    return NextResponse.json(
      { reply: `Fatal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
