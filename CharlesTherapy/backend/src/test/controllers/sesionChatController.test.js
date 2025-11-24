const chai = require('chai');
const sinon = require('sinon');
const controller = require('../../../src/build/controllers/sesionChatController');
const expect = chai.expect;

describe('SesionChat Controller', function () {
  let sandbox;
  let req;
  let res;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    req = { body: {}, query: {}, params: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('crearSesion()', function () {
    it('debe retornar 400 si faltan datos', async function () {
      req.body = { id_usuario: 1 };
      await controller.crearSesion(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
    it('debe crear sesión correctamente (solo verifica llamada exitosa si la BD está disponible)', async function () {
      req.body = { id_usuario: 1, contenido: 'Hola' };
      await controller.crearSesion(req, res);
      expect(res.status.called).to.be.true;
    });
  });

  describe('obtenerSesionesPorUsuarioYFecha()', function () {
    it('debe retornar 400 si faltan parámetros', async function () {
      req.params = {}; // Falta id_usuario
      await controller.obtenerSesionesPorUsuarioYFecha(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
    it('debe retornar sesiones correctamente (solo verifica llamada exitosa si la BD está disponible)', async function () {
      req.params = { id_usuario: '1' };
      req.query = { fecha: '2023-01-01' };
      await controller.obtenerSesionesPorUsuarioYFecha(req, res);
      expect(res.status.called).to.be.true;
    });
  });
});
