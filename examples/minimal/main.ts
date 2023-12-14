import { encodePNG } from "gbajs/deps.ts";
import {
  createGBACore,
  deserializeState,
  GBACore,
  HEIGHT,
  KeyCode,
  serializeState,
  WIDTH,
} from "gbajs/mod.ts";

async function readROM() {
  return (await Deno.readFileSync("./game.gba")).buffer;
}

async function readSave() {
  try {
    return (await Deno.readFile("./game.sav")).buffer;
  } catch {
    return;
  }
}

async function writeSave(c: GBACore) {
  const saveData = c.mmu?.save?.buffer;
  if (saveData) {
    await Deno.writeFile("./game.sav", new Uint8Array(saveData));
  }
}

async function readState() {
  try {
    const serializedState = Deno.readTextFileSync("./state.sav");
    const state = await deserializeState(serializedState);
    // TODO: Fix state deserialization because it's not working.
    return state;
  } catch (error) {
    console.log({ error });
    return;
  }
}

async function writeState(c: GBACore) {
  const state = c.freeze();
  console.log({ newState: state });
  const serializedState = await serializeState(state);
  Deno.writeTextFileSync("./state.sav", serializedState);
}

// Create the core.
const core = createGBACore({
  rom: await readROM(),
  save: await readSave(),
  state: await readState(),
});

const framesPerTick = 1600;
let frame = 0;

while (frame < framesPerTick) {
  // Run one step of the emulator.
  // core.advanceFrame();
  core.step();

  // Create a PNG of the current frame.
  if (core.context && frame % 10 === 0) {
    core.keypad.press(KeyCode.START, 1);
    const pngData = await encodePNG(
      core.context.pixelData.data,
      WIDTH,
      HEIGHT,
    );
    await Deno.writeFile(
      `./test/frame-${frame}.png`,
      pngData,
    );
  }

  frame++;
}

// Write state to disk.
await writeState(core);

// Write save data to disk.
await writeSave(core);
