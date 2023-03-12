const { Schema, model } = require('mongoose');

const schema = new Schema({
 email: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 apiKey: { type: String, unique: true, required: true }
});

const User = new model('users', schema, 'users');

module.exports = { User };