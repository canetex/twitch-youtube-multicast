export type ChannelEntry = {
  id: string;
  label: string;
  /** URL original informada pelo usuário */
  url: string;
};

export type Team = {
  id: string;
  name: string;
  channels: ChannelEntry[];
};

/** Estado persistido (localStorage + URL) */
export type AppStateV1 = {
  v: 1;
  teams: Team[];
};
