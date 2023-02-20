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



const uri = "mongodb+srv://educationHelpline:UqCdI7MoGGv7GdvT@cluster0.438fy.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });








async function run() {

    try{
        await client.connect();
        console.log("connected to database");
        const database = client.db('education');
        const userCollection = database.collection('users');
        const manyquestionCollection = database.collection('manyQuextion');
        const manyBookCollection = database.collection('manyBook');
        const manySyllbusCollection = database.collection('manySyllbus');
        const userReviewCollection = database.collection('review');




        // add database user collection 
        app.post('/users', async(req,res)=>{
            const user=req.body;
            // console.log(user)
            const result=await userCollection.insertOne(user);
            // console.log(body)
            res.json(result);
           
        })

        

        app.put('/users', async(req,res) =>{
            const user=req.body;
            const filter= {email:user.email}
            const option = {upsert:true}
            const updateDoc= {$set : user}
            const result= await userCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        });


        // user profile email 
        app.get('/users/:email', async(req,res)=>{
            const email=req.params.email;
            const query={email:email};
            const result=await userCollection.findOne(query)
            res.json(result)
        });


        // update user 
        app.put('/updateUser',async(req,res)=>{
            const user=req.body;
            console.log(user)
            const query={email:user.email}
            const updateDoc={
                $set:{
                    department:user.department,
                    batch:user.batch
                }
            }
            const result=await userCollection.updateOne(query,updateDoc);
            // console.log(result)
            res.json(result)
        })


        app.post('/postQuestion', async(req,res) =>{
            const user=req.body;
            // console.log(user)
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
                res.json({
                    allQuestions, count
                });
            } else {
                const cursor = manyquestionCollection.find({
                    // status: "approved"
                });
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).toArray()
        
                res.json({
                  allQuestions, count
                });
            }
        
        });


        // myquestion email check 
        app.get('/myQuestions/:email', async (req, res) => {
            const result = await manyquestionCollection.find({ email: req.params.email }).toArray()
            // console.log(result)
            res.send(result)
        });


        // question status update 
        app.put("/QuestionStatusUpdate/:id", async (req, res) => {
            // console.log(req.body)

            const filter = { _id: ObjectId(req.params.id) };
            
            const result = await manyquestionCollection.updateOne(filter, {
                $set: {
                    status: req.body.statu,
                },
                
            });
            // console.log(result)
            res.send(result);
        });


        // delete question 
        app.delete('/deleteQuestion/:id', async(req,res)=>{
            const result=await manyquestionCollection.deleteOne({_id:ObjectId(req.params.id)});
            // res.json(result)
        });


        // post book database 
        app.post('/postBook',async(req,res)=>{
            const book=req.body;
            console.log(book)
            const result=await manyBookCollection.insertOne(book);
            // console.log(result)
            res.json(result)
        })
     
        //  get the book show unique email

        app.get('/postBook/:email',async(req,res)=>{
            const cursor= manyBookCollection.find({email: req.params.email})
            const result= await cursor.toArray();
            res.json(result)
        })


        // get the book 
        // app.get('/postBook',async(req,res)=>{
        //     const cursor=manyBookCollection.find({})
        //     const result=await cursor.toArray()
        //     res.json(result)
        // })


        app.get("/postBook", async (req, res) => {
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
                const cursor = manyBookCollection.find(query, status = "approved");
                const count = await cursor.count()
                const allQuestions = await cursor.skip(page * size).limit(size).find ({}).toArray()
                // console.log(allQuestions)
                res.json({
                    allQuestions, count
                });
               
            } else {
                const cursor = manyBookCollection.find({
                    // status: "approved"
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



        // delete book 
        app.delete('/deleteBook/:id',async(req,res)=>{
            const result= await manyBookCollection.deleteOne({_id:ObjectId(req.params.id)});
            res.json(result)
        })

        // book status update 
        app.put('/updateBook/:id',async(req,res)=>{
            const filter={_id:ObjectId(req.params.id)}
            const result=await manyBookCollection.updateOne(filter,{
                $set:{
                    status:req.body.statu
                }
            });
            res.json(result)
        });



        // post syllbus 
        app.post('/postSyllbus',async(req,res)=>{
            const body=req.body;
            const result=await manySyllbusCollection.insertOne(body);
            console.log(result)
            res.json(result)
        })

        // unique mail data get 
        app.get('/postSyllbus/:email', async(req,res)=>{
            const result=await manySyllbusCollection.find({email:req.params.email}).toArray()
            res.json(result)
        });

        // get syllbus 
        app.get('/postSyllbus', async(req,res)=>{
            const result=await manySyllbusCollection.find({}).toArray()
            res.json(result)
        })

        // delete syllbus 
        app.delete('/deleteSyllbus/:id', async(req,res)=>{
            const result=await manySyllbusCollection.deleteOne({_id:ObjectId(req.params.id)})
            res.json(result)

    })


    // update syllbus 

    app.put('/updateSyllbus/:id', async(req,res)=>{
        const body=(req.body);
        console.log(body)
        const filter= {_id:ObjectId(req.params.id)}
        const result= await manySyllbusCollection.updateOne(filter, {
            $set: {
                status: req.body.statu
            }
        })
        
        res.json(result)
    });


    // post review the database 
    app.post("/review", async (req, res) => {
        const review = req.body;
        const result = await userReviewCollection.insertOne(review);
        res.json(result);
    });

    // get resview 
    app.get('/review', async(req,res)=>{
        const result=await userReviewCollection.find({}).toArray()
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