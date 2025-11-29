import React from "react";

interface ProfileCardProps {
  name: string;
  email: string;
  role: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  role,
}) => {
  return (
    <div style={{ padding: "20px", borderBottom: "1px solid #e0e0e0" }}>
      <h3>{name}</h3>
      <p>{email}</p>
      <p style={{ fontSize: "12px", color: "#666" }}>
        Role: <strong>{role}</strong>
      </p>
    </div>
  );
};
