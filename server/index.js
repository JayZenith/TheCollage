import express from "express";
//import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import theImages from "./routes/theRoutes.js";


dotenv.config()

const PORT = process.env.PORT || 5174;

//const multer = require("multer");
import multer from 'multer';
//const path = require("path");
import path from 'path';

const app = express();

app.use(cors());
app.use(express.json()); //parse json bodies in request object
app.use(express.static('public'));
app.use("/images", theImages);

app.listen(PORT || 5174, ()=>{
  console.log( `Server listening on port ${PORT}`);
})


/*
const PORT = process.env.PORT || 5174;
async function connect(){
  try{
   
    mongoose.set("strictQuery", false)
    await mongoose.connect(uri)
    .then(()=>{
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`listening server.js on PORT ${PORT}`);
      });
    })
    
  } catch (error) {
    console.error(error);
  }
}
connect();

*/
/*

app.post('/imageToMongoDB', async (req,res) => {
  try{
    console.log("here",req.body);
    //const imagetomongodb = await imageToMongoDB.create(req.body)
    const iamgetomongodb = req.body;
    const imageval = await imageValues.create(imagetomongodb);
    
    return res.status(201).send(imageval);
  } catch(err){
    console.log(err.message);
    res.status(500).json({message: err.message})
  }
})
  
*/

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
      cb(null, 'public/images')
    },
    filename: (req,file,cb)=>{
      cb(null, file.fieldname+"_"+Date.now()+path.extname(file.originalname));
    }
})
  
const upload = multer({
    storage: storage
})

//const fs=require('fs')
import fs from 'fs';

app.post("/upload", upload.single('image'), (req,res)=>{
    const image = req.file.filename;
    console.log(image)
    res.send({imageName: image})
    /*
    if(result[0].ImageData != "avatar.jpg"){
        fs.unlink(`./public/images/${result[0].ImageData}`,(err)=>{
          if(err){
            console.error(`Error removing file: ${err}`);
            return;
          }
          //console.log(`File ${result[0].ImageData} has been successfully removed.`);
        })
    }
    */
  });

