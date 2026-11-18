// See all configuration options: https://remotion.dev/docs/config
// Each option also is available as a CLI flag: https://remotion.dev/docs/cli

// Note: When using the Node.JS APIs, the config file doesn't apply. Instead, pass options directly to the APIs

import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Quebra Padrão: qualidade máxima (h264, CRF 14, AAC 320k)
Config.setCodec("h264");
Config.setCrf(14);
Config.setAudioBitrate("320k");
Config.setPixelFormat("yuv420p");

// Em ambientes sem acesso ao download do Chrome Headless Shell, usa o Chromium local.
import { existsSync } from "node:fs";
const LOCAL_CHROMIUM = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
if (existsSync(LOCAL_CHROMIUM)) Config.setBrowserExecutable(LOCAL_CHROMIUM);
