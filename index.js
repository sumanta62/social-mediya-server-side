const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();

require('dotenv').config();
const port = process.env.PORT || 5000;
// ////////
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster2.cv4uqat.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    const socialMediaPost = client.db("socialMedia").collection("inputFildData");
    const abouteUser = client.db("socialMedia").collection("abouteUser");

    try {
        app.post('/inputFild', async(req, res) =>{
            const users = req.body;
            const result = await socialMediaPost.insertOne(users);
            res.send(result);
        })

        app.get('/inputFild', async(req, res) =>{
            const query = {}
            const result = await socialMediaPost.find(query).sort({like: -1}).toArray();
            res.send(result);
        })
        app.get('/aboute', async(req, res) =>{
            const query = {}
            const result = await abouteUser.find(query).toArray();
            res.send(result);
        })

        app.get('/mediaDetails/:id', async(req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id)}
            const booking = await socialMediaPost.findOne(query);
            res.send(booking);
        })

        app.patch('/aboute',  async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const query = { _id: ObjectId(id) }
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: user.name,
                    email: user.email,
                    university: user.university,
                    address: user.address,
                }
            }
            const result = await abouteUser.updateOne(query, updateDoc, option);
            res.send(result);

        })

    }
    finally {

    }

}
run().catch(error => console.log(error));


app.get('/', (req, res) => {
    res.send('social media server side is runing');
})

app.listen(port, () => {
    console.log(`social media server side is runing ${port}`);
})