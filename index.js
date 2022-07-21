const express= require("express")
// const { MongoClient } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config();
const cors = require("cors");
const app=express();
const port = process.env.PORT || 5000;
app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors());
// app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.438fy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('education');
        const userCollection = database.collection('users');
        const manyquestionCollection = database.collection('manyQuextion');




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
        });


        app.post('/postQuestion', async(req,res) =>{
            const user=req.body;
            console.log(user)
            const result=await manyquestionCollection.insertOne(user);
            res.json(result)
        });

        

        app.get("/allQuestions", async (req, res) => {
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = req.query;
            delete query.page
            delete query.size
            Object.keys(query).forEach(key => {
                if (!query[key])
                    delete query[key]
            });

            if (Object.keys(query).length) {
                const cursor = manyquestionCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                // console.log(allQuestions)
                res.json({
                    allQuestions, count
                });
               
            } else {
                const cursor = manyquestionCollection.find({
                    
                });
                // console.log(cursor)
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
                // console.log(allQuestions)
                res.json({
                    allQuestions, count
                });
            }

        });


        

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