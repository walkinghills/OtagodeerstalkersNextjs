/**
 * Otago Deerstalkers – Cloudflare Email Worker
 * =============================================
 * Receives emails sent to the newsletter address, parses them,
 * and triggers the GitHub Actions publish-newsletter workflow via
 * the GitHub repository_dispatch API.
 *
 * SETUP STEPS (once you have the email address):
 * -----------------------------------------------
 * 1. In Cloudflare Dashboard → Email → Email Routing → Rules
 *    Add a rule: if To = newsletter@yourdomain.co.nz → send to this Worker
 *
 * 2. Deploy this Worker:
 *    - Go to Workers & Pages → Create Worker
 *    - Paste this file
 *    - Set the following Worker Environment Variables (Settings → Variables):
 *        GITHUB_TOKEN   – A GitHub Personal Access Token with repo scope
 *        GITHUB_OWNER   – Your GitHub username (e.g. walkinghills)
 *        GITHUB_REPO    – Repository name (e.g. otago-deerstalkers)
 *        ALLOWED_SENDER – The email address authorised to send newsletters
 *                         (prevents anyone emailing the address and publishing)
 *
 * 3. In Email Routing, create a Custom Address that routes to this Worker.
 *
 * EMAIL FORMAT FOR SENDERS:
 * --------------------------
 * Subject: [Issue #N] Your newsletter title here
 * Body:    Plain text or simple HTML. Use # Heading or ALL CAPS for section headings.
 *          Use - or * for bullet points.
 *
 * Example subject: [Issue #3] April 2026 – Range Reopens & Goat Hunt Results
 */

export default {
  async email(message, env, ctx) {

    // -----------------------------------------------------------------------
    // 1. Security: only allow emails from the configured sender
    // -----------------------------------------------------------------------
    const fromAddress = message.from.toLowerCase();
    const allowedSender = (env.ALLOWED_SENDER || "").toLowerCase();

    if (allowedSender && fromAddress !== allowedSender) {
      console.log(`Rejected email from unauthorised sender: ${fromAddress}`);
      message.setReject("Unauthorised sender");
      return;
    }

    // -----------------------------------------------------------------------
    // 2. Parse subject line
    //    Expected format: [Issue #N] Title text
    //    Falls back gracefully if format is not followed
    // -----------------------------------------------------------------------
    const subject = message.headers.get("subject") || "Untitled Newsletter";
    const today   = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    let issueNumber = "1";
    let title       = subject;

    const issueMatch = subject.match(/\[Issue\s*#?(\d+)\]\s*(.+)/i);
    if (issueMatch) {
      issueNumber = issueMatch[1];
      title       = issueMatch[2].trim();
    }

    // -----------------------------------------------------------------------
    // 3. Read email body (plain text preferred, fallback to stripping HTML)
    // -----------------------------------------------------------------------
    let bodyContent = "";

    // Cloudflare Email Workers provide the raw message as a stream
    const rawEmail = await new Response(message.raw).text();

    // Simple MIME parser: extract text/plain part
    // For production use, consider a proper MIME library via npm
    const textPlainMatch = rawEmail.match(
      /Content-Type:\s*text\/plain[^\r\n]*\r?\n(?:.*\r?\n)*?\r?\n([\s\S]+?)(?=\r?\n--|\r?\n\r?\n--|\s*$)/i
    );

    if (textPlainMatch) {
      bodyContent = textPlainMatch[1]
        .replace(/=\r?\n/g, "")   // decode quoted-printable soft line breaks
        .replace(/=([0-9A-F]{2})/gi, (_, hex) =>
          String.fromCharCode(parseInt(hex, 16))
        )
        .trim();
    }

    // Fallback: strip HTML tags from the raw email if no plain text found
    if (!bodyContent) {
      const htmlMatch = rawEmail.match(
        /Content-Type:\s*text\/html[^\r\n]*\r?\n(?:.*\r?\n)*?\r?\n([\s\S]+?)(?=\r?\n--|\s*$)/i
      );
      if (htmlMatch) {
        bodyContent = htmlMatch[1]
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s{2,}/g, " ")
          .trim();
      }
    }

    if (!bodyContent) {
      bodyContent = "(No content found in email body)";
    }

    // -----------------------------------------------------------------------
    // 4. Trigger GitHub Actions via repository_dispatch
    // -----------------------------------------------------------------------
    const payload = {
      event_type: "new-newsletter",
      client_payload: {
        issue_number: issueNumber,
        title:        title,
        date:         today,
        content:      bodyContent,
      },
    };

    const githubUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/dispatches`;

    const response = await fetch(githubUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "Accept":        "application/vnd.github+json",
        "Content-Type":  "application/json",
        "User-Agent":    "OtagoDeerstalkers-EmailWorker/1.0",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 204) {
      console.log(`✓ Triggered GitHub Action for: ${title} (Issue #${issueNumber})`);
    } else {
      const body = await response.text();
      console.error(`✗ GitHub API error ${response.status}: ${body}`);
      // Don't reject the email — log the error and investigate via Worker logs
    }
  },
};
