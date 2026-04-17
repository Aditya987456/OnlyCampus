type MailRecipient = {
  email: string;
  name?: string | null;
};

type MeetingEmailPayload = {
  facultyName: string;
  groupName: string;
  meetingTitle: string;
  scheduledAt: Date;
};

type AnnouncementEmailPayload = {
  facultyName: string;
  groupName: string;
  title: string;
  description: string;
  targetAll: boolean;
  attachmentCount?: number;
};

function requiredMailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.EMAIL_FROM?.trim() || user;

  if (!host || !user || !pass || !from || Number.isNaN(port)) {
    return null;
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465,
  };
}

async function createMailerTransport() {
  const config = requiredMailConfig();
  if (!config) return null;

  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  return { transporter, config };
}

function formatMeetingDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function buildMeetingEmailHtml(
  recipientName: string,
  payload: MeetingEmailPayload
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin-bottom: 12px; color: #166534;">OnlyCampus Meeting Scheduled</h2>
      <p>Hello ${recipientName},</p>
      <p>A new meeting has been scheduled for your group.</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Title</td>
          <td style="padding: 6px 0;">${payload.meetingTitle}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Group</td>
          <td style="padding: 6px 0;">${payload.groupName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Scheduled For</td>
          <td style="padding: 6px 0;">${formatMeetingDate(payload.scheduledAt)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Faculty</td>
          <td style="padding: 6px 0;">${payload.facultyName}</td>
        </tr>
      </table>
      <p>Please check the meetings section on OnlyCampus to join when the session starts.</p>
    </div>
  `;
}

function buildAnnouncementEmailHtml(
  recipientName: string,
  payload: AnnouncementEmailPayload
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
      <h2 style="margin-bottom: 12px; color: #166534;">OnlyCampus Announcement</h2>
      <p>Hello ${recipientName},</p>
      <p>${
        payload.targetAll
          ? "A new campus-wide announcement has been posted."
          : "A new class announcement has been posted for your group."
      }</p>
      <table style="border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Title</td>
          <td style="padding: 6px 0;">${payload.title}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Audience</td>
          <td style="padding: 6px 0;">${payload.targetAll ? "Everyone" : payload.groupName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 12px 6px 0; font-weight: 600;">Posted By</td>
          <td style="padding: 6px 0;">${payload.facultyName}</td>
        </tr>
      </table>
      <p style="margin: 16px 0 8px;"><strong>Description</strong></p>
      <p style="white-space: pre-wrap;">${payload.description}</p>
      ${
        payload.attachmentCount
          ? `<p style="margin-top: 16px;">This announcement includes ${payload.attachmentCount} attachment${payload.attachmentCount > 1 ? "s" : ""}. Please open OnlyCampus to view them.</p>`
          : ""
      }
      <p>Please open the announcements section in OnlyCampus for the full post.</p>
    </div>
  `;
}

export async function sendMeetingScheduledEmails(
  recipients: MailRecipient[],
  payload: MeetingEmailPayload
) {
  if (recipients.length === 0) {
    return {
      sent: false,
      reason: "no-recipients",
    };
  }

  const mailer = await createMailerTransport();
  if (!mailer) {
    return { sent: false, reason: "mail-not-configured" };
  }

  await Promise.allSettled(
    recipients.map((recipient) =>
      mailer.transporter.sendMail({
        from: mailer.config.from,
        to: recipient.email,
        subject: `Meeting scheduled: ${payload.meetingTitle}`,
        text: [
          `Hello ${recipient.name || "Student"},`,
          "",
          `A new meeting has been scheduled in OnlyCampus.`,
          `Title: ${payload.meetingTitle}`,
          `Group: ${payload.groupName}`,
          `Scheduled For: ${formatMeetingDate(payload.scheduledAt)}`,
          `Faculty: ${payload.facultyName}`,
          "",
          "Please open the meetings section in OnlyCampus to join when the session starts.",
        ].join("\n"),
        html: buildMeetingEmailHtml(recipient.name || "Student", payload),
      })
    )
  );

  return { sent: true };
}

export async function sendAnnouncementEmails(
  recipients: MailRecipient[],
  payload: AnnouncementEmailPayload
) {
  if (recipients.length === 0) {
    return {
      sent: false,
      reason: "no-recipients",
    };
  }

  const mailer = await createMailerTransport();
  if (!mailer) {
    return { sent: false, reason: "mail-not-configured" };
  }

  await Promise.allSettled(
    recipients.map((recipient) =>
      mailer.transporter.sendMail({
        from: mailer.config.from,
        to: recipient.email,
        subject: payload.targetAll
          ? `Campus announcement: ${payload.title}`
          : `Announcement for ${payload.groupName}: ${payload.title}`,
        text: [
          `Hello ${recipient.name || "Student"},`,
          "",
          payload.targetAll
            ? "A new campus-wide announcement has been posted in OnlyCampus."
            : `A new announcement has been posted for ${payload.groupName}.`,
          `Title: ${payload.title}`,
          `Posted By: ${payload.facultyName}`,
          "",
          payload.description,
          "",
          payload.attachmentCount
            ? `Attachments: ${payload.attachmentCount} (open OnlyCampus to view them)`
            : "",
          "Please open the announcements section in OnlyCampus for the full post.",
        ]
          .filter(Boolean)
          .join("\n"),
        html: buildAnnouncementEmailHtml(
          recipient.name || "Student",
          payload
        ),
      })
    )
  );

  return { sent: true };
}
