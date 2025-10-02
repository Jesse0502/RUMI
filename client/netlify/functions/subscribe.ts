// @ts-ignore
import fetch from "node-fetch";
// @ts-ignore
export async function handler(event, context) {
  try {
    const { email } = JSON.parse(event.body);
    // return;
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required" }),
      };
    }

    // Call Flodesk API
    const response = await fetch("https://api.flodesk.com/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLODESK_API_KEY}`, // keep secret
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        status: "active",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, subscriber: data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      //   @ts-ignore
      body: JSON.stringify({ error: err.message }),
    };
  }
}
