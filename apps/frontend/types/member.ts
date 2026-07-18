export interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "USER";
  position?: { name: string };
}

export interface MemberListResponse {
  result: Member[];
  metadata: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}
