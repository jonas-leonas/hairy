const express = require('express');
const mongoose = require('mongoose');

const Customer = require('./models/customer');

const dotenv = require("dotenv");

const app = express();
mongoose.set('strictQuery', false);

app.use(express.json());
app.use(express.urlencoded( { extended: true}));

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION =  process.env.CONNECTION;


//local data
const customers = [
    {
        "name": "Caleb",
        "industry": "music"
    },
    {
        "name": "John",
        "industry": "networking"
    },
    {
        "name": "Sal",
        "industry": "sports medicine"
    }
]

const customer = new Customer({
    name: 'John',
    industry: 'finance'
});

//customer.save();

app.get('/', (req, res) => {
    res.send("welcome message");
});
app.get('/api/customers',  async (req, res) => {
    console.log(await mongoose.connection.db.listCollections().toArray());
    try{
        const result = await Customer.find();
        res.json({"customers": result});
    } catch(e){
        res.status(500).json({error: e.message});
    }

});

//accepting passed parameter like f.x id
app.get('/api/customers/:id/:test', async(req,res) => {
    res.json({
        requestParams: req.params,
        requestQuery: req.query})
});

//add data to database
app.post('/api/customers', async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{ 
        await customer.save();
        res.status(201).json({customer});

    } catch(e) {
        res.status(400).json({error: e.message});
    }


    });

    //  req.body)
    //     customer.save();
    //     res.status(201).json({customer})


app.post('/', (req, res) => {
    res.send('This is a post request!');
});

const start = async() => {
    try{
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port: ' + PORT);

        });
    } catch(e){
        console.log(e.message)
    }
};






start();