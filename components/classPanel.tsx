"use client";
import React from "react";

type Props = {
  isFaculty?: boolean;
};

export default function ClassPanel({ isFaculty = false }: Props) {
  return (
    <div className="flex-1 p-4">
      <h3 className="text-lg font-semibold mb-4">Classes / Chat</h3>
      {isFaculty ? (
        <p>Here faculty can start a class (Zegocloud integration later)</p>
      ) : (
        <p>Students can join class or chat here</p>
      )}
    </div>
  );
}
