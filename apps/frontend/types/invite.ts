// types/invite.ts
export interface InviteResponse {
  inviteLink: string;
  token: string;
  expiresAt: string;
}

export interface InviteHistoryItem {
  id: string;
  displayId: string;
  email: string;
  role: "ADMIN" | "USER";
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
}

export type InviteMobileItem = InviteHistoryItem;
