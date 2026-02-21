import { Resend } from 'resend';
import { config } from '../config.js';

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

const FROM_EMAIL = 'SummitR <noreply@summitr.app>';

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.log(`[email] Resend not configured, skipping email to ${to}: ${subject}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  } catch (err) {
    console.error(`[email] Failed to send email to ${to}:`, err);
  }
}

export async function sendWelcomeEmail(to: string, username: string): Promise<void> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #2563eb; margin-bottom: 16px;">Welcome to SummitR!</h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey ${username},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        Thanks for joining SummitR — the community for mountaineers and climbers.
        Start exploring peaks, logging climbs, and connecting with fellow climbers.
      </p>
      <a href="${config.appUrl}/explore"
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px;
                border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: 600;">
        Start Exploring
      </a>
      <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
        Happy climbing!<br>The SummitR Team
      </p>
    </div>
  `;
  await sendEmail(to, 'Welcome to SummitR!', html);
}

export async function sendPasswordResetEmail(to: string, username: string, resetToken: string): Promise<void> {
  const resetUrl = `${config.appUrl}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #2563eb; margin-bottom: 16px;">Reset Your Password</h1>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey ${username},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        We received a request to reset your password. Click the button below to set a new one.
        This link expires in 1 hour.
      </p>
      <a href="${resetUrl}"
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px;
                border-radius: 6px; text-decoration: none; margin-top: 16px; font-weight: 600;">
        Reset Password
      </a>
      <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.<br>
        The SummitR Team
      </p>
    </div>
  `;
  await sendEmail(to, 'Reset your SummitR password', html);
}

export async function sendForumReplyEmail(
  to: string,
  recipientName: string,
  threadTitle: string,
  replierName: string,
  replySnippet: string,
  threadUrl: string,
): Promise<void> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2563eb; margin-bottom: 16px;">New Reply to Your Thread</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey ${recipientName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        <strong>${replierName}</strong> replied to your thread "<strong>${threadTitle}</strong>":
      </p>
      <blockquote style="border-left: 3px solid #d1d5db; padding-left: 12px; color: #4b5563; margin: 16px 0; font-style: italic;">
        ${replySnippet}
      </blockquote>
      <a href="${threadUrl}"
         style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px;
                border-radius: 6px; text-decoration: none; font-weight: 600;">
        View Thread
      </a>
    </div>
  `;
  await sendEmail(to, `New reply: ${threadTitle}`, html);
}

export async function sendCommentNotificationEmail(
  to: string,
  recipientName: string,
  commenterName: string,
  commentSnippet: string,
  climbLogUrl: string,
): Promise<void> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2563eb; margin-bottom: 16px;">New Comment on Your Climb</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey ${recipientName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        <strong>${commenterName}</strong> commented on your climb log:
      </p>
      <blockquote style="border-left: 3px solid #d1d5db; padding-left: 12px; color: #4b5563; margin: 16px 0; font-style: italic;">
        ${commentSnippet}
      </blockquote>
      <a href="${climbLogUrl}"
         style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px;
                border-radius: 6px; text-decoration: none; font-weight: 600;">
        View Comment
      </a>
    </div>
  `;
  await sendEmail(to, `${commenterName} commented on your climb`, html);
}

export async function sendFollowNotificationEmail(
  to: string,
  recipientName: string,
  followerName: string,
  followerProfileUrl: string,
): Promise<void> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #2563eb; margin-bottom: 16px;">New Follower</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hey ${recipientName},</p>
      <p style="color: #374151; font-size: 16px; line-height: 1.6;">
        <strong>${followerName}</strong> started following you on SummitR!
      </p>
      <a href="${followerProfileUrl}"
         style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px;
                border-radius: 6px; text-decoration: none; font-weight: 600;">
        View Profile
      </a>
    </div>
  `;
  await sendEmail(to, `${followerName} is now following you`, html);
}
