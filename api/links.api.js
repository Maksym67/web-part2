const { Router } = require('express');
const { Links } = require('../models/links');
const { User } = require('../models/users');

const router = Router();

router.use("/links", async (req, res, next) => {
 const { authorization } = req.headers;

   if (!authorization) {
    return res.status(401).send({ message: `ApiKey is required` });
   }
  
   const user = await User.findOne({ apiKey: authorization });
   if (!user) {
    return res.status(401).send({ message: `401, User is not authorized` });
   }
  
   return next();
});

function generateRandomLink(length) { 
  const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
  }
  return result; 
}

router.post("/links", async (req, res) => {
 const { original } = req.body;
 const { authorization } = req.headers;

 async function linksChecker() {
  const randomLink = generateRandomLink(5);
  let cutlink = await Links.findOne({ 'link.cut': randomLink });
  if (cutlink) {
    return linksChecker();
  } else {
    return randomLink;
  }
}

 try {
    if (!original) {
        return res.status(400).send({ message: '400, Original link is required' });
    }

  const randomLink = await linksChecker();

  const expires = new Date(new Date().getTime() + (5 * 24 * 60 * 60 * 1000));

  const newLink = new Links({ link: { original, cut: randomLink }, expiredAt: expires, userId: authorization });
  const doc = await newLink.save();

  return res.status(200).send({ link: doc.link.cut, expiredAt: doc.expiredAt });
 } catch (err) {
  console.error(err);
  res.status(400).send({ message: err.toString() });
 }
});

router.get("/links", async (req, res) => {
  const { expiredAt } = req.query;
  const { authorization } = req.headers;

  const queryDb = {};

  if (authorization) {
   queryDb.userId = authorization;
  }

  if (expiredAt) {
    const { gt, lt } = JSON.parse(expiredAt);
    queryDb.expiredAt = { $gt: gt, $lt: lt };
  }

  const doc = await Links.find(queryDb);

  return res.status(200).send(doc);
});

module.exports = { router };