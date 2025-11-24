export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      return res.status(200).send("email-hook is running");
    }

    const { type, challenge, event } = req.body;

    // URL 验证
    if (type === "url_verification") {
      return res.status(200).json({ challenge });
    }

    const WEBHOOK =
      "https://open.feishu.cn/open-apis/bot/v2/hook/7e6eab23-9921-49f2-8c8b-a9b827407e5c";

    // 邮件事件
    if (event?.event_type === "mail:mail_received_v1") {
      const mail = event.mail;

      const text = `
📩 *收到一封新邮件*
———————————————
📌 发件人：${mail.sender}
📌 标  题：${mail.subject}
📌 摘  要：${mail.snippet || "(无摘要)"}
`;

      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          msg_type: "text",
          content: { text },
        }),
      });
    }

    return res.status(200).send("ok");
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send("Error");
  }
}
