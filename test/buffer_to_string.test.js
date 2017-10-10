const fs = require('fs');
const assert = require('assert');
const decodeBuffer = require('../');

describe('XML buffer to string', function() {

  describe('argument is not a buffer', function() {

    it('should throws an error', function(){
      assert.throws(() => decodeBuffer('a string'), /buffer expected, found: string/);
    });
  });

  describe('encoding is found', function(){

    describe('and encoding is valid', function(){

      it('should return the xml string', function(){
        const xmlBuffer = Buffer.from('<?xml version="1.0" encoding="UTF-8" ?><one>á</one>');
        const xmlString = decodeBuffer(xmlBuffer);
        assert.equal(xmlString, '<?xml version="1.0" encoding="UTF-8" ?><one>á</one>');
      });
    });

    describe('and encoding is not valid', function(){

      describe('default encoding was passed', function () {

        describe('valid', function () {
          it('should return the xml string using the passed default encoding', function () {
            const xmlBuffer = Buffer.from('<?xml version="1.0" encoding="WHAT" ?><one>á</one>', 'binary');
            const xmlString = decodeBuffer(xmlBuffer, { defaultEncoding: 'ISO-8859-1' });
            assert.equal(xmlString, '<?xml version="1.0" encoding="WHAT" ?><one>á</one>');
          });
        });

        describe('invalid', function () {

          it('should return the xml string (utf8)', function () {
            const xmlBuffer = Buffer.from('<?xml version="1.0" encoding="WHAT" ?><one>á</one>');
            const xmlString = decodeBuffer(xmlBuffer, { defaultEncoding: 'ANOTHER_WHAT' });
            assert.equal(xmlString, '<?xml version="1.0" encoding="WHAT" ?><one>á</one>');
          });
        });
      });

      describe('default encoding was not passed', function(){

        it('should return the xml string (utf8)', function () {
          const xmlBuffer = Buffer.from('<?xml version="1.0" encoding="WHAT" ?><one>á</one>');
          const xmlString = decodeBuffer(xmlBuffer);
          assert.equal(xmlString, '<?xml version="1.0" encoding="WHAT" ?><one>á</one>');
        });
      });
    });
  });

  describe('encoding is not found', function(){

    describe('default encoding was passed', function(){

      describe('and encoding is valid', function () {

        it('should return the xml string using the passed default encoding', function () {
          const xmlBuffer = Buffer.from('<one>á</one>','binary');
          const xmlString = decodeBuffer(xmlBuffer, { defaultEncoding: 'ISO-8859-1' });
          assert.equal(xmlString, '<one>á</one>');
        });
      });

      describe('and encoding is not valid', function () {
        it('should return the xml string (utf8)', function () {
          const xmlBuffer = Buffer.from('<one>á</one>');
          const xmlString = decodeBuffer(xmlBuffer, { defaultEncoding: 'WHAT' });
          assert.equal(xmlString, '<one>á</one>');
        });
      });
    });
  });

});
