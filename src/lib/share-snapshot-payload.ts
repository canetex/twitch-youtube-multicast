export type SnapshotStream = {
  id: string;
  playerLabel: string;
  sourceUrl: string;
  platform: string;
};

export type SnapshotTeam = {
  id: string;
  name: string;
  streams: SnapshotStream[];
};

export type ShareSnapshotPayloadV1 = {
  v: 1;
  teams: SnapshotTeam[];
};
