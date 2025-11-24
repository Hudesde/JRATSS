const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai').default;

// Extiende las propiedades de globalThis
// (NO uses export {} ni sintaxis ES Module aquí)
global.expect = chai.expect;
global.sinon = sinon;
chai.use(sinonChai);
// No asignes describe, it, beforeEach, afterEach, etc. Mocha ya los expone globalmente.
// No pongas export {} aquí, ni ningún otro export
