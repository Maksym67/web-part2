const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const UserController = require('./api/users.api');
const LinksController = require('./api/links.api');
const { Links } = require('./models/links');

console.log(`MONGO_DB_URI:${process.env.MONGO_DB_URI}`);

const Mongo = require('./setup/mongoose');

const app = express();
app.use(bodyParser.json());

const setup = async () => {
 await Mongo.setupDb(process.env.MONGO_DB_URI);

 app.use(UserController.router);
 app.use(LinksController.router);

 app.get("/shortLink/:cut", async (req, res) => {
    const cut = req.params.cut;
  
    const dbQuery = {};
  
    if (cut) {
      dbQuery["link.cut"] = cut;
    }
  
    try {
      const doc = await Links.findOne(dbQuery);
  
      if (!doc) {
        return res.status(400).send({ message: '400, Short link was not found' });
      }
  
      if (doc.expiredAt && doc.expiredAt < Date.now()) {
        return res.status(400).send({ message: "400, Link was expired" });
      }
  
      return res.redirect(doc.link.original);
    } catch (err) {
      console.error(err);
      return res.status(400).send({ message: err.toString() });
    }
  });

 app.listen(process.env.PORT, () => {
  console.log(`Server was started on port ${process.env.PORT}!\nLab 2 by Maksym`);
 });
};

setup();