"use client";

import { createContext, useContext } from "react";
import type { DeviceKey } from "./types";

const DeviceContext = createContext<DeviceKey>("desktop");

export function DeviceProvider({
  device,
  children,
}: {
  device: DeviceKey;
  children: React.ReactNode;
}) {
  return (
    <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>
  );
}

export function usePreviewDevice(): DeviceKey {
  return useContext(DeviceContext);
}
