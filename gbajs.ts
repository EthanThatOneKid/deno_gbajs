import { _GBACore, _Serializer, BIOS_BIN, decodeBase64 } from "gbajs/deps.ts";
import type { FrozenState, GBACore, Serializer } from "gbajs/gbajs.d.ts";

export const BIOS = decodeBase64(BIOS_BIN);
export const SERIALIZER: Serializer = _Serializer.Serializer;

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

export interface CreateGBACoreOptions {
  rom: ArrayBuffer;
  save?: ArrayBuffer;
  state?: FrozenState;
}

export function createGBACore(o?: CreateGBACoreOptions): GBACore {
  const core: GBACore = new _GBACore();
  core.setBios(BIOS.buffer);
  core.setCanvasMemory();
  if (o?.rom) {
    core.setRom(o.rom);
  }

  if (o?.save) {
    core.setSavedata(o.save);
  }

  if (o?.state) {
    console.log({ oldState: o.state });
    core.defrost(o.state);
  }

  return core;
}

function uriToArrayBuffer(uri: string): Promise<ArrayBuffer> {
  return fetch(uri).then((r) => r.arrayBuffer());
}

// function uriToBlob(uri: string): Promise<Blob> {
//   return fetch(uri).then((r) => r.blob());
// }

export async function deserializeState(
  serializedState: string,
): Promise<FrozenState> {
  // try {
  // 	Serializer.deserializePNG(state, function (result) {
  // 		gba.defrost(result);
  // 		gba.DEBUG('Loaded state');
  // 	});
  // } catch (exception) {
  // 	gba.ERROR('Failed to load savestate', exception);
  // }
  //
  // const { promise, resolve } = Promise.withResolvers<FrozenState>();
  // SERIALIZER.deserialize(serializedState, (result) => {
  //   resolve(result);
  // });
  // const state = await promise;
  // console.log({ state });
  // return state;

  const state = JSON.parse(serializedState);
  const ram = await uriToArrayBuffer(state.mmu.ram);
  const iram = await uriToArrayBuffer(state.mmu.iram);
  const registers = await uriToArrayBuffer(state.io.registers);
  return {
    ...state,
    mmu: {
      ...state.mmu,
      ram,
      iram,
    },
    io: {
      ...state.io,
      registers,
    },
  };
}

function blobToURI(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.onabort = () => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}

export async function serializeState(
  state: FrozenState,
): Promise<string> {
  // var state = gba.freeze();
  // Serializer.serializePNG(Serializer.serialize(state), master.document.getElementById('screen'), function(url) {
  // 	var img = document.getElementById('saveState');
  // 	img.setAttribute('src', url);
  // });
  //
  // const serializedState = SERIALIZER.serialize(state);
  // return Promise.resolve(serializedState);

  const serializedRam = await blobToURI(state.mmu.ram);
  const serializedIram = await blobToURI(state.mmu.iram);
  const serializedRegisters = await blobToURI(state.io.registers);
  return JSON.stringify(
    {
      ...state,
      mmu: {
        ram: serializedRam,
        iram: serializedIram,
      },
      io: {
        registers: serializedRegisters,
      },
    },
    null,
    2,
  );
}
