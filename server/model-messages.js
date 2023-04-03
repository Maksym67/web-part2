const { Schema, model } = require('mongoose');

const schema = new Schema({
 userName: { type: String, required: true },
 text: { type: String, required: true },
 date: { type: Date, required: true }
});

const Messages = new model('messages', schema, 'messages');

module.exports = { Messages };