"use client";

import CreateMeetingForm from "@/components/CreateMeetingForm";

/** Thin wrapper for faculty dashboard; props accepted for API compatibility. */
export default function FacultyMeetingForm(_: { facultyName?: string }) {
  return <CreateMeetingForm />;
}
