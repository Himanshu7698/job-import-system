const xml2js = require('xml2js');

const parseXml = async (xml) => {
const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
return parser.parseStringPromise(xml);
};

module.exports = { parseXml };