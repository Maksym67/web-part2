const { Router } = require('express');
const { Sales } = require('../models/sales');

const router = Router();

router.get("/sales", async (req, res) => {
    const { storeLocation, customer_age, customer_emailDomain, items_tags, couponUsed } = req.query;

    const dbQuery = {};
   
    if (storeLocation) {
        if (storeLocation.includes('*')) {
            dbQuery.storeLocation = {$regex: new RegExp(`^${storeLocation.replace(/\*/g, '.*')}$`)};
        } else {
            dbQuery.storeLocation = storeLocation;
        }
       }

    if (customer_age) {
        const { gt, lt } = JSON.parse(customer_age);
        if (lt && gt && lt < gt) {
            return res.status(400).send('lt less then gt');
        } else {
            dbQuery["customer.age"] = {$gte: gt, $lte: lt};
        }
        if (gt && !lt) {
            dbQuery["customer.age"] = {$gte: gt};
        }
        if (lt && !gt) {
            dbQuery["customer.age"] = {$lte: lt};
        }
       }

    if (customer_emailDomain) {
        dbQuery["customer.email"] = {$regex: new RegExp(`@${customer_emailDomain}`)};
       }

    if (items_tags) {
        dbQuery["items.tags"] = {$in: items_tags.split(",")};
       }

    if (couponUsed) {
        dbQuery.couponUsed = couponUsed;
       }

    const docs = await Sales.find(dbQuery);
    return res.status(200).send(docs);
});

module.exports = { router };