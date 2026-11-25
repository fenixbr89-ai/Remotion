import React, { createContext, useContext } from "react";
import { THEMES, Theme, ThemeName } from "./theme";

const Ctx = createContext<Theme>(THEMES.escuro);

export const ThemeProvider: React.FC<{ name: ThemeName; children: React.ReactNode }> = ({ name, children }) => (
  <Ctx.Provider value={THEMES[name]}>{children}</Ctx.Provider>
);

export const useTheme = () => useContext(Ctx);

/** Caption animation style: "desfoque" (blur + scale) or "mascara" (rise from a mask + colour sweep). */
export type CaptionStyle = "desfoque" | "mascara";
const CapCtx = createContext<CaptionStyle>("desfoque");
export const CaptionProvider = CapCtx.Provider;
export const useCaptionStyle = () => useContext(CapCtx);
