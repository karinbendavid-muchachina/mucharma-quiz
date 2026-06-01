export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "אימייל לא תקין" });
  }

  try {
    const response = await fetch("https://rest.smoove.io/v1/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SMOOV_API_KEY}`,
      },
      body: JSON.stringify({
        Email: email,
        FirstName: name || "",
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Smoov error:", err);
      throw new Error("Smoov API error");
    }

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "שגיאה בהרשמה — נסי שוב" });
  }
}
