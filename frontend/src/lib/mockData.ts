export type GateLevel = "Low" | "Medium" | "High";

export type GateTrend = "Rising" | "Stable" | "Dropping";

export type GateOverview = {
  gate: string;
  status: GateLevel;
  zone: string;
  queueSize: number;
  throughputPerMin: number;
  advisory: string;
  trend: GateTrend;
  updatedAt: string;
};

export type FeedItem = {
  author: string;
  message: string;
  timestamp: string;
};

export const gateFallbackData: GateOverview[] = [
  {
    gate: "Gate 1",
    status: "Low",
    zone: "North Stand",
    queueSize: 14,
    throughputPerMin: 32,
    advisory: "Entry moving smoothly. Keep scanning lanes open.",
    trend: "Stable",
    updatedAt: "16:07",
  },
  {
    gate: "Gate 2",
    status: "Low",
    zone: "North-East Concourse",
    queueSize: 18,
    throughputPerMin: 29,
    advisory: "No intervention needed. Keep one reserve steward on standby.",
    trend: "Dropping",
    updatedAt: "16:06",
  },
  {
    gate: "Gate 3",
    status: "Medium",
    zone: "East Stand",
    queueSize: 42,
    throughputPerMin: 24,
    advisory: "Monitor queue splits and open overflow lane if needed.",
    trend: "Rising",
    updatedAt: "16:05",
  },
  {
    gate: "Gate 4",
    status: "Low",
    zone: "South-East",
    queueSize: 21,
    throughputPerMin: 31,
    advisory: "Clear flow. Keep hydration kiosk route unobstructed.",
    trend: "Stable",
    updatedAt: "16:04",
  },
  {
    gate: "Gate 5",
    status: "High",
    zone: "South Main",
    queueSize: 79,
    throughputPerMin: 18,
    advisory: "Critical build-up. Divert 20% crowd toward Gates 6 and 7.",
    trend: "Rising",
    updatedAt: "16:06",
  },
  {
    gate: "Gate 6",
    status: "Medium",
    zone: "South-West",
    queueSize: 53,
    throughputPerMin: 22,
    advisory: "Busy but controlled. Add one handheld scanner.",
    trend: "Stable",
    updatedAt: "16:06",
  },
  {
    gate: "Gate 7",
    status: "Low",
    zone: "West Stand",
    queueSize: 16,
    throughputPerMin: 35,
    advisory: "Clear corridor. Suitable for overflow diversion.",
    trend: "Dropping",
    updatedAt: "16:05",
  },
  {
    gate: "Gate 8",
    status: "Low",
    zone: "VIP & Hospitality",
    queueSize: 9,
    throughputPerMin: 14,
    advisory: "Low footfall. Continue premium lane operations.",
    trend: "Stable",
    updatedAt: "16:05",
  },
];

export const communityFeedFallback: FeedItem[] = [
  {
    author: "Organizer",
    message: "Turnstile checks complete. All gates are currently operational.",
    timestamp: "15:58",
  },
  {
    author: "Aarav M.",
    message: "Reached Gate 3. Queue is moving, just a little packed near the barricade.",
    timestamp: "16:00",
  },
  {
    author: "AI Monitor",
    message: "Density alert: Gate 5 crowd compression increased by 18% in last 4 minutes.",
    timestamp: "16:03",
  },
  {
    author: "Nina S.",
    message: "Security asked us to shift to Gate 7 and that line was much faster.",
    timestamp: "16:04",
  },
  {
    author: "Organizer",
    message: "Overflow routing active. Follow signage for Gates 6 and 7 for quicker entry.",
    timestamp: "16:05",
  },
];

const fanNames = [
  "Aarav M.",
  "Riya P.",
  "Kabir S.",
  "Anaya R.",
  "Rohan D.",
  "Meera T.",
  "Ishaan K.",
  "Nina S.",
];

const organizerUpdates = [
  "Steward team moved to Gate 5 for faster ID checks.",
  "Overflow routing now active toward Gates 6 and 7.",
  "North concourse barricade opened for smoother fan merge.",
  "Hydration lane moved 8 meters from East queue choke point.",
];

const aiUpdates = [
  "Density model indicates moderate crowd compression near East stand.",
  "Queue acceleration detected at Gate 2 after scanner recalibration.",
  "Heatmap trend shows improving flow around West stand lanes.",
  "Entry velocity dropped at South Main lane for the last 3 minutes.",
];

const fanUpdates = [
  "Just switched lines and this gate is moving way better now.",
  "Security checks are quick here, no major wait.",
  "Queue is packed near the barricade but still moving.",
  "Got in from this gate in under ten minutes.",
  "Crowd feels busier than before kickoff, plan extra time.",
];

export function getRandomCommunityUpdate(): FeedItem {
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const randomGate = gateFallbackData[Math.floor(Math.random() * gateFallbackData.length)];
  const randomWaitMins = Math.max(3, Math.round(randomGate.queueSize / 6 + Math.random() * 5));
  const sourceRoll = Math.random();

  if (sourceRoll > 0.72) {
    const message = organizerUpdates[Math.floor(Math.random() * organizerUpdates.length)];
    return {
      author: "Organizer",
      message: `${message} (${randomGate.gate}, ${randomGate.zone}).`,
      timestamp,
    };
  }

  if (sourceRoll > 0.45) {
    const message = aiUpdates[Math.floor(Math.random() * aiUpdates.length)];
    return {
      author: "AI Monitor",
      message: `${message} ${randomGate.gate} currently marked ${randomGate.status}.`,
      timestamp,
    };
  }

  const fanName = fanNames[Math.floor(Math.random() * fanNames.length)];
  const fanMessage = fanUpdates[Math.floor(Math.random() * fanUpdates.length)];
  return {
    author: fanName,
    message: `${fanMessage} Approx wait at ${randomGate.gate} is around ${randomWaitMins} min.`,
    timestamp,
  };
}

export function applyLiveStatuses(
  base: GateOverview[],
  statuses: Record<string, string>,
): GateOverview[] {
  const updatedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  return base.map((gate) => {
    const liveStatus = statuses[gate.gate];
    if (liveStatus === "Low" || liveStatus === "Medium" || liveStatus === "High") {
      return {
        ...gate,
        status: liveStatus,
        updatedAt,
      };
    }
    return gate;
  });
}

export function calculateGateSummary(gates: GateOverview[]) {
  const critical = gates.filter((gate) => gate.status === "High").length;
  const moderate = gates.filter((gate) => gate.status === "Medium").length;
  const clear = gates.filter((gate) => gate.status === "Low").length;
  const totalQueue = gates.reduce((sum, gate) => sum + gate.queueSize, 0);

  return {
    total: gates.length,
    critical,
    moderate,
    clear,
    totalQueue,
  };
}
