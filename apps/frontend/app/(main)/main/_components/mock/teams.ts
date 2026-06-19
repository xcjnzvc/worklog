interface Team {
  name: string;
  status: string[];
  rate: string;
  overtimeHours: number;
  overtimeMembers: string[];
  teamType: "dev" | "design" | "marketing" | "sales" | "hr";
}

const MOCK_TEAMS: Team[] = [
  {
    name: "개발팀",
    status: [
      "present",
      "present",
      "present",
      "present",
      "present",
      "present",
      "leave",
    ],
    rate: "88%",
    overtimeHours: 42,
    overtimeMembers: ["김개발", "이코딩"],
    teamType: "dev",
  },
  {
    name: "디자인팀",
    status: ["present", "present", "late", "absent"],
    rate: "75%",
    overtimeHours: 15,
    overtimeMembers: ["박디자인"],
    teamType: "design",
  },
  {
    name: "마케팅팀",
    status: ["present", "present", "present", "present", "absent"],
    rate: "80%",
    overtimeHours: 8,
    overtimeMembers: [],
    teamType: "marketing",
  },
  {
    name: "영업팀",
    status: ["present", "present", "present", "leave"],
    rate: "75%",
    overtimeHours: 24,
    overtimeMembers: ["최영업"],
    teamType: "sales",
  },
  {
    name: "인사팀",
    status: ["present", "present", "present"],
    rate: "100%",
    overtimeHours: 0,
    overtimeMembers: [],
    teamType: "hr",
  },
];

export default MOCK_TEAMS;
