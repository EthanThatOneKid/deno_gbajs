import { encodePNG } from "gbajs/deps.ts";
import { BIOS, createGBACore, HEIGHT, KeyCode, WIDTH } from "gbajs/mod.ts";

const core = createGBACore();

// Load the BIOS.
core.setBios(BIOS.buffer);

// Set canvas memory.
core.setCanvasMemory();

// Load the ROM.
const rom = await Deno.readFile("./game.gba");
core.setRom(rom.buffer);

// Load the save data.
try {
  const save = await Deno.readFile("./save.dat");
  core.setSavedata(save.buffer);
} catch {
  // No save data found.
}

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
      core.context.pixelData.data, // ?? new Uint8Array(WIDTH * HEIGHT * 4).fill(0xFF),
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

// Write save data to disk.
// const saveData = core.downloadSavedata();
// await Deno.writeFile("./save.dat", saveData);
