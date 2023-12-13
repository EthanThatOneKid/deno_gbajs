import { encodePNG } from "gbajs/deps.ts";
import { BIOS, createGBACore, HEIGHT, WIDTH } from "gbajs/mod.ts";

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

let targetSteps = 10000;

while (targetSteps--) {
  // Run one step of the emulator.
  core.advanceFrame();

  // Create a PNG of the current frame.
  if (core.context && targetSteps % 100 === 0) {
    const pngData = await encodePNG(
      core.context.pixelData.data, // ??        new Uint8Array(WIDTH * HEIGHT * 4).fill(0xFF),
      WIDTH,
      HEIGHT,
    );
    await Deno.writeFile(
      `./test/frame-${targetSteps}.png`,
      pngData,
    );
  }
}
// Write save data to disk.
// const saveData = core.downloadSavedata();
// await Deno.writeFile("./save.dat", saveData);
