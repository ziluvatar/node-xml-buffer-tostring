const iconv = require('iconv-lite');

const XMLDeclBeginnings = [
  {
    encoding: 'utf8', // This is common for more encodings, all of them can be used to read the declaration
    buffer: Buffer.from([0x3C, 0x3F, 0x78, 0x6D])
  },
  {
    encoding: 'utf16le',
    buffer: Buffer.from([0x3C, 0x00, 0x3F, 0x00])
  },
  {
    encoding: 'utf16be',
    buffer: Buffer.from([0x00, 0x3C, 0x00, 0x3F])
  }
];

const BOMs = [
  {
    encoding: 'utf8',
    buffer: Buffer.from([0xEF, 0xBB, 0xBF])
  },
  {
    encoding: 'utf16le',
    buffer: Buffer.from([0xFF, 0xFE])
  },
  {
    encoding: 'utf16be',
    buffer: Buffer.from([0xFE, 0xFF])
  }
];

// XML => nodejs
const ENCODING_MAP = {
  'UTF-8': 'utf8',
  'UTF-16': ['utf16le','utf16be']
};

function normalizeEncoding(xmlEncoding, detectedEncoding) {
  const encoding = ENCODING_MAP[xmlEncoding];
  if (!encoding) { return xmlEncoding; }
  if (Array.isArray(encoding)) {
    return encoding.find(e => e === detectedEncoding);
  } else {
    return encoding;
  }
}

function bufferStartsWith(buffer, beginning) {
  return buffer.slice(0, beginning.length).equals(beginning);
}

function getXMLDeclTagEncoding(xmlBuffer) {
  const found = XMLDeclBeginnings.find(beginning => bufferStartsWith(xmlBuffer, beginning.buffer));
  return found ? found.encoding : null;
}

function getXMLDeclaration(xmlBuffer, encoding) {
  const closeTag = iconv.encode('?>', encoding);
  const xmlDeclEnd = xmlBuffer.indexOf(closeTag);
  if (xmlDeclEnd === -1) { return null; } // no ?> found

  return iconv.decode(xmlBuffer.slice(0, xmlDeclEnd), encoding); // End index not included
}

function getEncodingAttr(xmlDecl) {
  const result = /encoding=['"]([A-Za-z]([A-Za-z0-9._]|-)*)['"]/.exec(xmlDecl);
  return result ? result[1] : null;
}

function getBOM(textBuffer) {
  return BOMs.find(bom => bufferStartsWith(textBuffer, bom.buffer));
}

function xmlEncoding(xmlBuffer) {
  var detectedEncoding;
  var xmlDeclFound;
  var xmlDeclEncoding

  const bom = getBOM(xmlBuffer);
  if (bom) {
    xmlBuffer = xmlBuffer.slice(bom.buffer.length);
    detectedEncoding = bom.encoding;
  } else {
    detectedEncoding = getXMLDeclTagEncoding(xmlBuffer);
    xmlDeclFound = !!detectedEncoding;
  }

  if (!detectedEncoding) {
    return null;
  }

  if (xmlDeclFound) {
    xmlDeclEncoding = normalizeEncoding(getEncodingAttr(getXMLDeclaration(xmlBuffer, detectedEncoding)), detectedEncoding);
  }

  // We should check if xmlDeclEncoding and detectedEncoding match, for now we
  // give precedence to the encoding in the xml declaration if it exists

  return xmlDeclEncoding ? xmlDeclEncoding : detectedEncoding;
}

function bufferToString(xmlBuffer, options) {
  if (!Buffer.isBuffer(xmlBuffer)) {
    throw new Error('buffer expected, found: ' + typeof xmlBuffer);
  }

  options = options || {};

  const encoding = xmlEncoding(xmlBuffer);
  const defaultEncoding = iconv.encodingExists(options.defaultEncoding) ? options.defaultEncoding : 'utf8';

  return iconv.decode(xmlBuffer, iconv.encodingExists(encoding) ? encoding : defaultEncoding);
}

module.exports = bufferToString;
module.exports.xmlEncoding = xmlEncoding;