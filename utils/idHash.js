const Hashids = require("hashids/cjs");
const hashids = new Hashids("wedding-secret-salt", 10);

const encodeID = (id) => hashids.encode(id);
const decodeID = (hash) => hashids.decode(hash)[0];

module.exports = { encodeID, decodeID };
