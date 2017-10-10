const fs = require('fs');
const assert = require('assert');
const xmlEncoding = require('../').xmlEncoding;
const testEncoding = require('./encoding_testsuite');

function readXml(usecase) {
  return fs.readFileSync(`./test/xml/${usecase}.xml`);
}

describe('XML Encoding', function(){

  var encoding;

  describe('xml declaration is found', function(){

    describe('for UTF-8 (single quotes)', function () {

      before(() => encoding = xmlEncoding(readXml('with_prolog_single_quotes')));

      it('should return the encoding "utf8"', function () {
        assert.equal(encoding, 'utf8');
      });
    });

    describe('xml declaration is malformed, wrong multiline split', function () {

      before(() => encoding = xmlEncoding(readXml('multiline_xmldecl_malformed')));

      it('should return undefined', function () {
        assert.equal(encoding, undefined); // Possible error thrown
      });

    });

    describe('xml declaration is malformed, without closing chars', function () {

      before(() => encoding = xmlEncoding(readXml('with_xmldecl_without_closing_chars')));

      it('should return the encoding detected searching for xml declaration', function () {
        assert.equal(encoding, 'utf8');
      });

    });

    describe('xml declaration is multiline with different whitespaces', function () {

      // #x20  | #x9 | #xD             | #xA
      // Space | tab | carriage return | new line

      before(() => encoding = xmlEncoding(readXml('multiline_xmldecl_whitespaces')));


      it('should return the encoding', function () {
        assert.equal(encoding, 'utf8');
      });

    });

  });

  testEncoding({
    encoding: 'utf8',
    removeBOM: (buffer) => buffer.slice(3)
  });

  testEncoding({
    encoding: 'utf16le',
    removeBOM: (buffer) => buffer.slice(2)
  });

  testEncoding({
    encoding: 'utf16be',
    removeBOM: (buffer) => buffer.slice(2)
  });

  testEncoding({
    encoding: 'ISO-8859-1',
    fallbackEncoding: 'utf8' // When no encoding in xml declaration is found
  });
});