export class GBACore {
  // Constants
  LOG_ERROR: number;
  LOG_WARN: number;
  LOG_STUB: number;
  LOG_INFO: number;
  LOG_DEBUG: number;
  SYS_ID: string;

  // Properties
  logLevel: number;
  rom: null | ArrayBuffer;
  cpu: ARMCore;
  mmu: GameBoyAdvanceMMU;
  irq: GameBoyAdvanceInterruptHandler;
  io: GameBoyAdvanceIO;
  audio: GameBoyAdvanceAudio;
  video: GameBoyAdvanceVideo;
  keypad: GameBoyAdvanceKeypad;
  sio: GameBoyAdvanceSIO;
  context?: MemoryCanvas;

  // Public methods
  setCanvas(canvas: HTMLCanvasElement): void;
  setCanvasMemory(): void;
  setBios(bios: ArrayBuffer, real?: boolean): void;
  setRom(rom: ArrayBuffer): boolean;
  hasRom(): boolean;
  loadRomFromFile(romFile: File, callback?: (result: boolean) => void): void;
  reset(): void;
  step(): void;
  pause(): void;
  advanceFrame(): void;
  runStable(): void;
  setSavedata(data: ArrayBuffer): void;
  loadSavedataFromFile(saveFile: File): void;
  decodeSavedata(string: string): void;
  downloadSavedata(): void;
  storeSavedata(): void;
  retrieveSavedata(): boolean;
  freeze(): FrozenState;
  defrost(frost: FrozenState): void;
  setLogger(logger: (level: number, message: string) => void): void;
  decodeBase64(view: string): ArrayBuffer;
  encodeBase64(view: ArrayBuffer): string;
  ERROR(error: string): void;
  WARN(warn: string): void;
  STUB(func: string): void;
  INFO(info: string): void;
  DEBUG(info: string): void;
  ASSERT_UNREACHED(err: string): void;
  ASSERT(test: boolean, err: string): void;
}

interface ARMCore {
  // Public methods
  resetCPU(pc: number): void;
  step(): void;
}

interface GameBoyAdvanceMMU {
  // Constants
  REGION_CARTRIDGE: number;
  REGION_WRAM: number;
  REGION_IO: number;
  REGION_PALETTE_RAM: number;
  REGION_VRAM: number;
  REGION_OAM: number;

  // Properties
  save: {
    buffer: ArrayBuffer | null;
  };
  cart: {
    title: string;
    code: string;
    maker: string;
    saveType: number;
  };

  // Public methods
  clear(): void;
  loadBios(bios: ArrayBuffer, real?: boolean): void;
  loadRom(rom: ArrayBuffer, mapCart?: boolean): ArrayBuffer | null;
  mmap(region: number, instance: object): void;
  saveNeedsFlush(): boolean;
  flushSave(): void;
  loadSavedata(data: ArrayBuffer): void;
  freeze(): FrozenState;
  defrost(frost: FrozenState): void;
}

interface GameBoyAdvanceInterruptHandler {
  // Public methods
  freeze(): object;
  defrost(frost: object): void;
}

interface GameBoyAdvanceIO {
  // Public methods
  clear(): void;
  registerHandlers(): void;
  freeze(): object;
  defrost(frost: object): void;
}

interface GameBoyAdvanceAudio {
  // Public methods
  clear(): void;
  pause(pause: boolean): void;
  freeze(): object;
  defrost(frost: object): void;
}

interface GameBoyAdvanceVideo {
  // Public methods
  clear(): void;
  setBacking(context: CanvasRenderingContext2D): void;
  freeze(): object;
  defrost(frost: object): void;
}

interface GameBoyAdvanceKeypad {
  // Public methods
  registerHandlers(): void;
  press(key: number, time: number): void;
  keydown(key: number): void;
  keyup(key: number): void;
}

interface GameBoyAdvanceSIO {
  // Public methods
  clear(): void;
}

interface MemoryCanvas {
  pixelData: {
    width: number;
    height: number;
    data: Uint8Array;
  };
}

export interface FrozenState {
  cpu: {
    gprs: number[];
    mode: number;
    cpsrI: boolean;
    cpsrF: number;
    cpsrV: number;
    cpsrC: boolean;
    cpsrZ: boolean;
    cpsrN: number;
    bankedRegisters: number[][][];
    spsr: number;
    bankedSPSRs: number[];
    cycles: number;
  };
  mmu: {
    ram: Blob;
    iram: Blob;
  };
  irq: {
    enable: number;
    enabledIRQs: number;
    interruptFlags: number;
    dma: {
      source: number;
      dest: number;
      count: number;
      nextSource: number;
      nextDest: number;
      nextCount: number;
      srcControl: number;
      dstControl: number;
      repeat: boolean;
      width: number;
      drq: boolean;
      timing: number;
      doIrq: boolean;
      enable: boolean;
      nextIRQ: number;
    }[];
    timers: {
      reload: number;
      oldReload: number;
      prescaleBits: number;
      countUp: boolean;
      doIrq: boolean;
      enable: boolean;
      lastEvent: number;
      nextEvent: number;
      overflowInterval: number;
    }[];
    nextEvent: number;
    springIRQ: boolean;
  };
  io: {
    registers: Blob;
  };
  audio: {
    nextSample: number;
  };
  video: {
    inHblank: boolean;
    inVblank: boolean;
    vcounter: boolean;
    vblankIRQ: number;
    hblankIRQ: number;
    vcounterIRQ: number;
    vcountSetting: number;
    vcount: number;
    lastHblank: number;
    nextHblank: number;
    nextEvent: number;
    nextHblankIRQ: number;
    nextVblankIRQ: number;
    nextVcounterIRQ: number;
  };
}

export interface Serializer {
  TAG_INT: number;
  TAG_STRING: number;
  TAG_STRUCT: number;
  TAG_BLOB: number;
  TAG_BOOLEAN: number;
  TYPE: string;

  pointer(): void;

  pack(value: number): ArrayBuffer;
  pack8(value: number): ArrayBuffer;
  prefix(value: number): Blob;
  serialize(stream: FrozenState): ArrayBuffer;
  deserialize(
    blob: ArrayBuffer,
    callback: (result: FrozenState) => void,
  ): void;
  deserealizeStream(
    view: DataView,
    pointer: { index: number; top: number; stack: number[] },
  ): ArrayBuffer;
  serializePNG(
    blob: Blob,
    base: HTMLCanvasElement,
    callback: (dataURL: string) => void,
  ): HTMLCanvasElement;
  deserializePNG(
    blob: Blob,
    callback: (result: ArrayBuffer) => void,
  ): void;
}
