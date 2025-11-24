export const config = {
  runtime: "edge", // 让 fetch 原生可用
};

// Edge Functions 写法（req.json() 才能解析 body）
export default async function handler(req) {
  try {
    const body = await req.json();
    const { type, challenge, event } = body;

    // 飞书 URL 验证
    if (type === "url_verification") {
      return new Response(JSON.stringify({ challenge }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

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

    return new Response("ok", { status: 200 });

  } catch (err) {
    console.error("Error:", err);
    return new Response("Error", { status: 500 });
  }
}
