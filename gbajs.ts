import { BIOS_BIN, decodeBase64, GBACore } from "gbajs/deps.ts";
import type { TypedGBACore } from "gbajs/gbajs.d.ts";

export const BIOS = decodeBase64(BIOS_BIN);

export const WIDTH = 240;
export const HEIGHT = 160;

export enum KeyCode {
  A = 0,
  B = 1,
  SELECT = 2,
  START = 3,
  RIGHT = 4,
  LEFT = 5,
  UP = 6,
  DOWN = 7,
  R = 8,
  L = 9,
}

export function createGBACore(): TypedGBACore {
  return new GBACore() as TypedGBACore;
}
