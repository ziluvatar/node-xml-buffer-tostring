XML Buffer To String
--------------------
[![Build Status](https://circleci.com/gh/ziluvatar/node-xml-buffer-tostring/tree/master.svg?style=shield)](https://circleci.com/gh/ziluvatar/node-xml-buffer-tostring/tree/master.svg?style=shield)
[![codecov](https://codecov.io/gh/ziluvatar/node-xml-buffer-tostring/branch/master/graph/badge.svg)](https://codecov.io/gh/ziluvatar/node-xml-buffer-tostring)

This library will convert a XML from a buffer to a string, dealing with the different encodings that can be used when serializing a XML.

Currently it fully supports UTF-8, UTF-16 and the ISO-8859 family.

# Installation

`npm i xml-buffer-tostring`

# Usage

The library exports a function that can be used for the conversion:

```
const xmlBufferToString = require('xml-buffer-tostring');
const xmlString = xmlBufferToString(buffer);
```

### Default encoding

When it is not possible to extract the encoding then the default encoding is used.

You can pass a default encoding using the options parameter. Since this library uses `iconv-lite` internally you can choose one from [their supported encodings](https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings). When no default encoding is passed `utf8` is used.

```
const xmlBufferToString = require('xml-buffer-tostring');
const xmlString = xmlBufferToString(buffer, { defaultEncoding: 'ISO-8859-1' });
```

# Encoding detection details

Although the library uses encoding detection with and without BOM following the indications of the [specification](https://www.w3.org/TR/xml/#sec-guessing), it is not strict with the failures, instead it uses precedence.

If an encoding attribute is found on the xml declaration it will use that as encoding, otherwise the detected encoding (from BOM or `<?` chars) would be used.


# License

The MIT License. See [LICENSE](LICENSE) file.
