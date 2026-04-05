/**
 * Video room link. Default: Jitsi (no API key).
 *
 * Optional env (client-safe):
 * - NEXT_PUBLIC_MEETING_URL_TEMPLATE — must include `{room}`, e.g.
 *   `https://meet.jit.si/{room}` or `https://your-subdomain.whereby.com/{room}`
 */
export function buildMeetingUrl(uniqueSeed: string): string {
  const room = `onlycampus-${uniqueSeed}`.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 56);
  const template = process.env.NEXT_PUBLIC_MEETING_URL_TEMPLATE?.trim();
  if (template && template.includes("{room}")) {
    return template.replace(/\{room\}/g, room);
  }
  return `https://meet.jit.si/${room}`;
}
