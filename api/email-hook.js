export default async function handler(req, res) {
  const { type, challenge, event } = req.body;

  // 事件验证（飞书会在第一次请求时发送）
  if (type === "url_verification") {
    return res.status(200).json({ challenge });
  }

  // 你的机器人 webhook 填这里
  const WEBHOOK = "https://open.feishu.cn/open-apis/bot/v2/hook/7e6eab23-9921-49f2-8c8b-a9b827407e5c";

  // 邮件事件处理
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
        content: { text }
      })
    });
  }

  res.status(200).send("ok");
}
