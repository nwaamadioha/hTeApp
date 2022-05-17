import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to mongoDB");
    } catch (error) {
        throw error;
    }
};

const cardSchema = new mongoose.Schema({
    cardNumber: Number,
    expDate: String,
    cvv: Number,
    amount: Number
})
const Card = mongoose.model("Card", cardSchema)



app.get("/", function(req, res){
    res.send("Hello world")
});

app.get("/api", function(req, res){
    res.send("just an API")
});

app.post("/api", async function(req, res){
    const card = new Card(req.body);
    await card.save().then(() => { 
        Card.findOne({ cardNumber: req.body.cardNumber}, function(err, card){
            if(err){
                console.log(err)
            }else{
                const RequestId = (card._id).toString()
                res.json({RequestId: RequestId, Amount: card.amount})
            }
        })
    }).catch( err=> {
        res.status(400).json("Error: " + err);
    }); 
})



app.listen(process.env.PORT || 3000, function() {
    connect()
    console.log("Server started on port 3000");
  });