import { BIOS_BIN, decodeBase64, GBACore } from "gbajs/deps.ts";
import type { TypedGBACore } from "gbajs/gbajs.d.ts";

export const BIOS = decodeBase64(BIOS_BIN);

export const WIDTH = 240;
export const HEIGHT = 160;

export function createGBACore(): TypedGBACore {
  return new GBACore() as TypedGBACore;
}
