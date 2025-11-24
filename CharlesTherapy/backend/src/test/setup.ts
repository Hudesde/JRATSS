import { expect } from 'chai';
import sinon from 'sinon';
import { afterEach, beforeEach, describe, it } from 'mocha';

// ✅ Extiende las propiedades de globalThis
// (NO uses export {} ni sintaxis ES Module aquí)
declare global {
  interface GlobalThis {
    expect: typeof expect;
    sinon: typeof sinon;
    describe: typeof describe;
    it: typeof it;
    beforeEach: typeof beforeEach;
    afterEach: typeof afterEach;
  }
}

// ✅ Asignación (con as any para evitar error TS7017)
(globalThis as any).expect = expect;
(globalThis as any).sinon = sinon;
(globalThis as any).describe = describe;
(globalThis as any).it = it;
(globalThis as any).beforeEach = beforeEach;
(globalThis as any).afterEach = afterEach;
// No pongas export {} aquí, ni ningún otro export

// Archivo renombrado a setup.cjs para evitar conflictos de módulos en Mocha/ts-node.
// Elimina este archivo si ya no es necesario.
