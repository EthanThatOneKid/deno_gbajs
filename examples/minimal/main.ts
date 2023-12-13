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

const stepsToProcess = 100_000;
let step = 0;
while (step < stepsToProcess) {
  // Run one step of the emulator.
  core.step();
  step++;

  if (step % 100 === 0) {
    core.keypad.press(KeyCode.START, 1);
    console.log("Pressed START");
    saveFrame();
  }
}

saveFrame(0);

// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

async function saveFrame(n = step) {
  if (core.context) {
    const pngData = encodePNG(
      core.context.pixelData.data, // ?? new Uint8Array(WIDTH * HEIGHT * 4).fill(0xFF),
      WIDTH,
      HEIGHT,
    );
    await Deno.writeFile(
      `./test/frame-${n}.png`,
      pngData,
    );
  }
}

// Write save data to disk.
// const saveData = core.downloadSavedata();
// await Deno.writeFile("./save.dat", saveData);
