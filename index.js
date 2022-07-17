const express= require("express")
// const { MongoClient } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");
const app=express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.438fy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('education');
        const userCollection = database.collection('users');
        




        // add database user collection 
        app.post('/users', async(req,res)=>{
            const user=req.body;
            console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        })

        

        app.put('/users', async(req,res) =>{
            const user=req.body;
            const filter= {email:user.email}
            const option = {upsert:true}
            const updateDoc= {$set : user}
            const result= userCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        })

        

    }

    finally{
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req,res)=>{
    res.send("all question service provide");
   });
  
  app.listen(port, ()=>{
    console.log("runnning online on port", port);
  }); 