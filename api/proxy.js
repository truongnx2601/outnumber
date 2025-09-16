export default async function handler(req, res) {
  try {
    let body = req.body;
    if (typeof body === "string" && body.length) {
      try { body = JSON.parse(body); } catch (e) {}
    }

    // Lấy IP client từ request
    const xff = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "";
    const clientIp = xff ? xff.split(",")[0].trim() : (req.socket && req.socket.remoteAddress) || null;

    if (!clientIp) {
      return res.status(400).json({ error: "Không lấy được IP client" });
    }

    // API gọi đến chính IP client
    const targetUrl = `http://${clientIp}:9004/api/OutputNumber/configurations`;

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // giữ nguyên payload user nhập
    });

    const text = await response.text();

    res.setHeader("Content-Type", "application/json");
    return res.status(response.status).send(JSON.stringify({
      calledUrl: targetUrl,
      proxiedStatus: response.status,
      proxiedBody: text,
    }));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.message });
  }
}
