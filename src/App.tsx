import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import { Header } from "@/components/Header";
import { AppStateProvider, useAppState } from "@/context/AppStateContext";
import { ChannelFocus } from "@/views/ChannelFocus";
import { Home } from "@/views/Home";
import { TeamEditor } from "@/views/TeamEditor";
import { TeamMosaic } from "@/views/TeamMosaic";

function Shell() {
  const { teams, hydrated } = useAppState();
  const share_state = hydrated ? ({ v: 1 as const, teams }) : null;

  return (
    <div className="min-h-screen bg-slate-950">
      <Header share_state={share_state} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamId/focus/:channelId" element={<ChannelFocus />} />
        <Route path="/team/:teamId" element={<TeamMosaic />} />
        <Route path="/edit/:teamId" element={<TeamEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppStateProvider>
        <Shell />
      </AppStateProvider>
    </HashRouter>
  );
}
