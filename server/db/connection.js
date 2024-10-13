import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv"

dotenv.config()

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict:true,
        deprecationErrors: true,
    },
});

try{
    await client.connect();

    await client.db("admin").command({ ping:1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB");
} catch(err){
    console.log(err);
}

let db = client.db("theImages");

export default db;