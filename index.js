const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middlewars
app.use(express.json());
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://students-management-system-client.vercel.app"
        ],
        credentials: true,
    })
);


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.7cprr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const studentManagement = client.db("studentManagement");
        const studentCollection = studentManagement.collection("students");

        // APIs
        app.get("/students", async (req, res) => {
            const cursor = await studentCollection.find().toArray();
            res.send(cursor);
        })
        app.post("/students", async (req, res) => {
            const student = req.body;
            const cursor = await studentCollection.insertOne(student);
            res.send(cursor);
        })
        app.patch("/students", async (req, res) => {
            const id = req.query.id;
            const body = req.body;
            const query = { _id: new ObjectId(id) };
            const cursor = await studentCollection.updateOne(query, body);
            res.send(cursor);
        })
        app.delete("/students", async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const cursor = await studentCollection.deleteOne(query);
            res.send(cursor);
        })
        app.get("/student", async (req, res) => {
            const id = req.query.id;
            const query = { _id: new ObjectId(id) };
            const cursor = await studentCollection.findOne(query);
            res.send(cursor);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Student Management is Running")
})
app.listen(port, () => {
    console.log(`Student Management is running at: http://localhost:${port}`)
})