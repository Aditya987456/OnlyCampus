type MeetingLinkSource = {
  hostLink?: string | null;
  participantLink?: string | null;
};

function trimEnv(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "";
}

export function buildWherebyRoomName(uniqueSeed: string): string {
  return `classes-${uniqueSeed}`
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 64);
}

export function buildWherebyLinks(room: string, roomKey?: string) {
  const base = `https://onlycampus.whereby.com/${room}`;

  return {
    roomName: room,
    participantLink: base,
    hostLink: roomKey ? `${base}?roomKey=${roomKey}` : base,
  };
}

function roomNameFromLink(link: string): string {
  try {
    const url = new URL(link);
    return url.pathname.replace(/^\/+/, "").trim();
  } catch {
    return "";
  }
}

export function resolveWherebyMeetingDetails(uniqueSeed: string) {
  const configuredHostLink = trimEnv(process.env.WHEREBY_HOST_LINK);
  const configuredParticipantLink = trimEnv(process.env.WHEREBY_PARTICIPANT_LINK);
  const configuredRoomName = trimEnv(process.env.WHEREBY_ROOM_NAME);

  if (configuredHostLink || configuredParticipantLink || configuredRoomName) {
    const participantLink =
      configuredParticipantLink ||
      (configuredRoomName
        ? `https://onlycampus.whereby.com/${configuredRoomName}`
        : configuredHostLink.split("?")[0] || "");
    const hostLink = configuredHostLink || participantLink;
    const roomName =
      configuredRoomName ||
      roomNameFromLink(participantLink) ||
      roomNameFromLink(hostLink);

    return {
      roomName,
      hostLink,
      participantLink,
    };
  }

  const roomName = buildWherebyRoomName(uniqueSeed);
  const { hostLink, participantLink } = buildWherebyLinks(roomName);

  return {
    roomName,
    hostLink,
    participantLink,
  };
}

export function getMeetingLinkForRole(
  meeting: MeetingLinkSource,
  role?: string | null
): string {
  if (role?.toLowerCase() === "faculty") {
    return meeting.hostLink || meeting.participantLink || "";
  }
  return meeting.participantLink || meeting.hostLink || "";
}

export function serializeMeetingForRole<T extends MeetingLinkSource>(
  meeting: T & { toObject?: () => Record<string, unknown> },
  role?: string | null
) {
  const raw =
    typeof meeting?.toObject === "function"
      ? meeting.toObject()
      : ({ ...meeting } as Record<string, unknown>);

  return {
    ...raw,
    meetingLink: getMeetingLinkForRole(meeting, role),
  };
}
