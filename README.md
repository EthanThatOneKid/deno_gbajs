# deno_gbajs

Game Boy Advance in Deno.

This project aims to provide a TypeScript-friendly version of gba.js.

## gba.js

[gba.js](https://github.com/endrift/gbajs) is a read-only, archived project. Due
to the nature of emulators (no DLC, no updates, etc.), it is unlikely that this
project requires further development. gba.js is an untyped JavaScript project,
and as such, it is difficult to use in TypeScript projects.

As for the core runtime, this project uses the original gba.js code imported
from NPM package [`gbajs`](https://www.npmjs.com/package/gbajs). The only
changes are the addition of TypeScript type definitions, utility functions, and
constants. The original gba.js license is linked below.

## License

[Original license](https://github.com/endrift/gbajs/blob/master/COPYING).

---

Developed with 🦕 by [**@EthanThatOneKid**](https://etok.codes/)
