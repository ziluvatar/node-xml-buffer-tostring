const fs = require('fs');
const assert = require('assert');
const xmlEncoding = require('../').xmlEncoding;

module.exports = function test(settings) {
  const testEncoding = settings.encoding;

  // Sometimes the detected encoding is returned when
  // there is no encoding attribute that defines the xml encoding
  const fallbackEncoding = settings.fallbackEncoding;

  // For the cases where the encoding can contain BOM the test
  // suite expects the use cases files to always have it. Using
  // this function it can remove it if needed.
  const removeBOM = settings.removeBOM || (b => b);
  const encodingUsesBOM = !!settings.removeBOM;

  function readXml(usecase) {
    return fs.readFileSync(`./test/xml/${testEncoding}/${usecase}.xml`);
  }

  describe(`XML Encoding for ${testEncoding} buffer`, function () {
    if (encodingUsesBOM) {
      describe('no BOM is found', function () { noBOMFoundTests(); });

      describe('BOM is found', function () { BOMFoundTests(); });
    } else {
      noBOMFoundTests();
    }
  });

  function noBOMFoundTests() {

    var encoding;

    describe('no XML declaration found', function () {
      before(() => encoding = xmlEncoding(removeBOM(readXml('no_xmldecl'))));

      it('should return undefined', function () {
        assert.equal(encoding, undefined);
      });
    });

    describe('XML declaration is found', function () {

      describe('but none encoding attribute exists', function () {
        before(() => encoding = xmlEncoding(removeBOM(readXml('with_xmldecl_no_encoding'))));

        it('should return the encoding detected searching for xml declaration', function () {
          assert.equal(encoding, fallbackEncoding || testEncoding);
        });
      });

      describe('and encoding attribute exists', function () {
        before(() => encoding = xmlEncoding(removeBOM(readXml('with_xmldecl'))));

        it('should return the encoding mapped encoding from the attribute value', function () {
          assert.equal(encoding, testEncoding);
        });
      });
    });
  }

  function BOMFoundTests() {

    var encoding;

    describe('no XML declaration found', function () {
      before(() => encoding = xmlEncoding(readXml('no_xmldecl')));

      it('should return encoding from BOM', function () {
        assert.equal(encoding, testEncoding);
      });
    });

    describe('XML declaration is found', function () {

      describe('but none encoding attribute exists', function () {
        before(() => encoding = xmlEncoding(readXml('with_xmldecl_no_encoding')));

        it('should return the encoding from BOM', function () {
          assert.equal(encoding, fallbackEncoding || testEncoding);
        });
      });

      describe('and encoding attribute exists', function () {
        before(() => encoding = xmlEncoding(readXml('with_xmldecl')));

        it('should return the encoding mapped encoding from the attribute value', function () {
          assert.equal(encoding, testEncoding);
        });
      });
    });
  }
}