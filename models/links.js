const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
 link: {
  original: { type: String, required: true },
  cut: { type: String, required: true, unique: true }
 },
 userId: { type: String, required: true },
 expiredAt: { type: Date }
});

const Links = new model('links', schema, 'links');

module.exports = { Links };