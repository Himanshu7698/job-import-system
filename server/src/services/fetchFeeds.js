const axios = require('axios');
const { parseXml } = require('./xmlToJson');

async function fetchFeed(url) {
    const res = await axios.get(url, { timeout: 15000, responseType: 'text' });
    const xml = res.data;
    const json = await parseXml(xml);
    return json;
}

/**
* Normalize feed JSON to an array of items. Implementation may vary by feed structure.
*/
function extractItemsFromFeed(json) {
    // RSS typical structure: rss.channel.item
    if (json.rss && json.rss.channel) {
        const items = json.rss.channel.item;
        if (!items) return [];
        return Array.isArray(items) ? items : [items];
    }
    // Atom or other structures: try feed.entry
    if (json.feed && json.feed.entry) {
        const items = json.feed.entry;
        return Array.isArray(items) ? items : [items];
    }
    return [];
}


module.exports = { fetchFeed, extractItemsFromFeed };