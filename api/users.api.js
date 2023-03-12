const { Router } = require('express');
const { User } = require('../models/users');
const { v4: uuidv4 } = require('uuid');

const router = Router();

router.post("/users", async (req, res) => {
 const { email, password } = req.body;

 try {
    if (!email) {
        return res.status(400).send({
        message: '400, This field email is required'
        });
    }
    if (!password) {
        return res.status(400).send({
        message: '400, This field password is required'
        });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(409).send({ message: '400, This email is already in use' });
    }

  const apiKey = uuidv4();
  const user = new User({ email, password, apiKey: apiKey });
  const doc = await user.save();

  return res.status(200).send(doc);
 } catch (err) {
  console.error(err);
  res.status(400).send({ message: err.toString() });
 }
});

router.post("/users/login", async (req, res) => {
 const { email, password } = req.body;

 try {
    if (!email) {
        return res.status(400).send({
        message: '400, This field email is required'
        });
    }
    if (!password) {
        return res.status(400).send({
        message: '400, This field password is required'
        });
    }
    const existingUser = await User.findOne({ email: email, password: password });
    if (existingUser) {
        return res.status(200).send(existingUser);
    } else {
        return res.status(400).send({ message: `400, User with such credentials was not found` });
    }

 } catch (err) {
  console.error(err);
  res.status(400).send({ message: err.toString() });
 }
});

module.exports = { router };