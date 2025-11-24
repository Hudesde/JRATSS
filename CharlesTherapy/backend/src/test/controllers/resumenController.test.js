const chai = require('chai');
const sinon = require('sinon');
const controller = require('../../../src/build/controllers/resumenController');
const resumenModel = require('../../../src/build/model/resumenModel');
const pool = require('../mocks/dataBaseMock.js');
const expect = chai.expect;

describe('Resumen Controller', function () {
  let sandbox;
  let req;
  let res;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    req = { body: {}, query: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('crearResumen()', function () {
    it('debe retornar 400 si faltan datos', async function () {
      req.body = { id_usuario: 1, fecha: '2023-01-01' };
      await controller.crearResumen(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        message: 'Faltan datos requeridos'
      })).to.be.true;
    });

    it('debe crear resumen correctamente', async function () {
      const stub = sandbox.stub(resumenModel, 'crearResumen').resolves({ id_resumen: 1 });
      req.body = {
        id_usuario: 1,
        fecha: '2023-01-01',
        contenido: 'Contenido largo...',
        resumen: 'Resumen corto'
      };

      await controller.crearResumen(req, res);
      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ id_resumen: 1 })).to.be.true;
    });
  });

  describe('obtenerResumenPorFecha()', function () {
    it('debe retornar 400 si faltan parámetros', async function () {
      req.query = { id_usuario: '1' };
      await controller.obtenerResumenPorFecha(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({
        message: 'Faltan parámetros requeridos'
      })).to.be.true;
    });

    it('debe retornar resumen correctamente', async function () {
      const fakeResumen = { id: 1, resumen: 'Texto resumen' };
      sandbox.stub(resumenModel, 'obtenerResumenPorFecha').resolves(fakeResumen);
      req.query = { id_usuario: '1', fecha: '2023-01-01' };

      await controller.obtenerResumenPorFecha(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(fakeResumen)).to.be.true;
    });
  });
});
