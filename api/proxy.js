export default async function handler(req, res) {
  try {
    const body = req.body ? JSON.parse(req.body) : {};
    const targetUrl = `http://${body.ipServer}:${body.portServer}/api/OutputNumber/configurations`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.text();
    res.setHeader("Content-Type", "application/json");
    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}