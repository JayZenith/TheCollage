import express from "express";

import db from "../db/connection.js";

//conver thte id from string to ObjectId for _id
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

//routes requests will start with path /record
const router = express.Router();

router.get("/", async(req, res) => {
    let collection = await db.collection("theImages");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
})


router.get("/:id", async(req, res) => {
    let collection = await db.collection('theImages');
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if(!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/", async (req, res) => {
    try{
        console.log("test",req.body)
        let newDocument = {
            src: req.body.body.url,
            theId: req.body.body.theId,
        };
        let collection = await db.collection("theImages");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    } catch (err){
        console.error(err);
        res.status(500).send("Error adding record");
    }
});

router.delete("/:id([0-9a-fA-F]{24})", async(req,res) => {
    try{
        //const query = { _id: new ObjectId(req.params.id) };
        const query = { theId: req.params.id };
        const collection = db.collection("theImages");
        let result = await collection.deleteOne(query);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
})

export default router;