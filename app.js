const crypto = require('crypto');

const SECRET = crypto.randomBytes(32).toString('hex');

console.log(SECRET);