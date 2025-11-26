const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()



// middleware
app.use(cors())
app.use(express.json())



// mongodb connection

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwtwuxq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const careerDatabaseCollection = client.db("careerDB").collection("jobs");
    const applicationDatabaseCollection = client.db("applicationDB").collection("applications")




    // job related api's
    app.get('/jobs',async (req,res)=>{
      const cursor = careerDatabaseCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    
    
    app.get('/jobs/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await careerDatabaseCollection.findOne(query)
      res.send(result)
    })

    app.post('/jobs',async(req,res)=>{
      const data = req.body
      const result = await careerDatabaseCollection.insertOne(data)
      res.send(result)
    })






    // job application related api's
    app.post('/applications',async(req,res)=>{
       const data = req.body;
       const result = await applicationDatabaseCollection.insertOne(data)
       res.send(result)
    })



    // http://localhost:5000/applications?applicant=jahan@gmail.com
    app.get('/applications',async(req,res)=>{
      const email = req.query.email
      const query = {
        applicant : email
      }

      const result = await applicationDatabaseCollection.find(query).toArray()

      // not the best way to aggregate data
      for(const application of result){
        const jobId = application.jobId;
        const jobQuery = {_id : new ObjectId(jobId)}
        const job = await careerDatabaseCollection.findOne(jobQuery)
        application.company = job.company
        application.title = job.title
        application.company_logo = job.company_logo
      }

      res.send(result)
    })




    // http://localhost:5000/applications
    // app.get('/applications',async(req,res)=>{
    //    const cursor = applicationDatabaseCollection.find()
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
  res.send('Career Code is Cooking');
})
app.listen(port,()=>{
  console.log(`career code is cooking on port ${port}`)
})









































































































// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const app = express();
// const Port = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());







// // uri = Uniform Resource Identifier
// // কেন আমরা এটাকে const uri নামে রাখি?
// // কারণ:

// // ✔️ MongoClient() বানাতে এটা লাগে
// // ✔️ এটা একটা fixed constant connection string
// // ✔️ পুরো কোডে এটাকে বারবার লেখার দরকার নেই
// // ✔️ clean & reusable
// // ✔️ env variable দিয়ে নিরাপদ করা যায়

// const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.bwtwuxq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;  
// // console.log(uri)  
// // const uri হল database এর address + username + password একসাথে রাখা একটা string, যেটা দিয়ে Node.js MongoDB server এর সাথে কানেক্ট করে।









// // Create a MongoClient with a MongoClient object to set the *****Stable API****** version
// const client = new MongoClient(uri, {
// // 🧠 serverApi কী?
// // MongoDB এখন Stable API ব্যবহার করে, যেন future version এ তোমার কোড break না হয়।
// // এটা basically backwards compatibility ensure করে।
//   serverApi: {
//     version: ServerApiVersion.v1, //version: ServerApiVersion.v1-->মানে → আমরা MongoDB এর stable API version 1 use করবো।->Benefit → MongoDB আপডেট হলেও কোড হঠাৎ করে ভাঙবে না।
    
//     strict: true,//মানে → তুমি যদি এমন কোনো feature ইউজ করো যেটা official API এর বাইরে বা deprecated বা পুরোনো feature detect → MongoDB তোমাকে warning দিবে / error দিবে।

//     deprecationErrors: true,//মানে → যদি deprecated (বা পুরোনো feature detect) কিছু ব্যবহার করো → error throw করবে (শুধু warning না, proper error)->future-proofing
//   },
// });









// async function run() {
//     // run() এর ভেতর collection গুলো তৈরি করা হয়েছে — এগুলোই ব্যবহার করে CRUD করা হবে।
//   try {



//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     // 🧠 MongoDB আগের ভার্সনে যেভাবে কাজ করতো :
//     //    await client.connect();
    
//     // must ছিল কারণ:
    
//     // connect না করলে
//     // query send করা যেতো না
//     // client ready ছিল না
//     // ➡️ তাই আগে একদম শুরুতেই connect করতে হতো।



//     // v4.7+ এর behavior (নতুন সিস্টেম) :
//     //    MongoDB driver lazy connection introduce করেছে।
//     // যখন find(), insertOne(), updateOne() ইত্যাদি কল করবে,সেই মুহূর্তেই connection automatically establish হবে

//     // but rakha good practice






    


//     const coffeeDatabaseCollection = client
//       .db("coffeeDB")
//       .collection("coffees");
    
    
//     const userDatabaseCollection = client.db("userDb").collection("users");

// // 1️⃣ client.db("coffeeDB")

// // এটা বোঝাচ্ছে – MongoDB এর মধ্যে coffeeDB নামে একটি database সিলেক্ট করা হয়েছে।

// // 2️⃣ .collection("coffees")

// // coffeeDB ডাটাবেজের ভিতরে coffees নামে একটি collection সিলেক্ট করা হয়েছে।

// // 📌 অর্থ:

// // coffeeDB ডাটাবেজের coffees নামে কালেকশনটির একটি reference/handle বানানো হলো — যেটা আমরা insert/find/update/delete এর জন্য ব্যবহার করতে পারব।






//     // coffee database api

//     // client data get/collection form browser
//     app.post("/coffees", async (req, res) => {
//       const newCoffee = req.body;
//       console.log(newCoffee);

//       const result = await coffeeDatabaseCollection.insertOne(newCoffee);

//       res.send(result);
//     });




//     app.get("/coffees", async (req, res) => {
//       const cursor = coffeeDatabaseCollection.find();

//       const data = await cursor.toArray();
//       res.send(data);
//     });




//     app.get("/coffees/:id", async (req, res) => {
//       const Id = req.params.id;

//       const query = { _id: new ObjectId(Id) };

//       const result = await coffeeDatabaseCollection.findOne(query);

//       res.send(result);
//     });






//     app.put("/coffees/:id", async (req, res) => {

//       const Id = req.params.id;

//       const query = { _id: new ObjectId(Id) };

//       const options = { upsert: true };

//       const updatedCoffee = req.body;
      
//       const coffee = {
//         $set : {
//             name : updatedCoffee.name, 
//             chef : updatedCoffee.chef, 
//             supplier : updatedCoffee.supplier, 
//             detail : updatedCoffee.detail, 
//             url : updatedCoffee.url, 
//             taste : updatedCoffee.taste, 
//             category : updatedCoffee.category
//         }
//       }


//       const result = await coffeeDatabaseCollection.updateOne(query,coffee,options)

//       res.send(result)
//     });


    
//     app.delete("/coffees/:id", async (req, res) => {
//       const Id = req.params.id;

//       const query = { _id: new ObjectId(Id) };

//       const result = await coffeeDatabaseCollection.deleteOne(query);

//       res.send(result);
//     });









//     // user database api

//     app.post('/users', async(req,res)=>{

//        const newUser = req.body;

//        const result = await userDatabaseCollection.insertOne(newUser)
//        res.send(result)
//     })



//     app.get('/users', async(req,res)=>{
       
//       const cursor = userDatabaseCollection.find()

//       const result = await cursor.toArray()
//       res.send(result)
//     })



//     app.get("/users/:id", async (req, res) => {
//       const Id = req.params.id;

//       const query = { _id: new ObjectId(Id) };

//       const result = await userDatabaseCollection.findOne(query);
//       res.send(result);
//     });



//     app.delete("/users/:id", async (req, res) => {
//       const Id = req.params.id;

//       const query = { _id: new ObjectId(Id) };

//       const result = await userDatabaseCollection.deleteOne(query);

//       res.send(result);
//     });






//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });
//     // console.log(
//     //   "Pinged your deployment. You successfully connected to MongoDB!"
//     // );
//   } 
//   finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }

// run()
// .catch(console.dir);

// // run().catch(console.dir); এই লাইনটা সাধারণত Node.js বা আধুনিক JavaScript কোডে দেখা যায়—বিশেষ করে async function ব্যবহার করলে।

// // এটা কী করে? সহজ ভাষায়:

// // run()

// // run নামের একটা async ফাংশন কল করা হচ্ছে।

// // এই ফাংশন যেহেতু async, তাই এটা Promise রিটার্ন করে।

// // .catch(console.dir)

// // যদি run() এর ভেতরে কোনো error (exception) ঘটে,

// // তাহলে .catch() সেই error ধরে ফেলে।

// // তারপর console.dir দিয়ে error টা সুন্দরভাবে console-এ দেখায় (object আকারে স্ট্রাকচার করে প্রিন্ট করে)।







// // server side
// app.get("/", async (req, res) => {
//   res.send("I'm working!!");
// });

// app.listen(Port, () => {
//   console.log(`server is running on port : ${Port}`);
// });