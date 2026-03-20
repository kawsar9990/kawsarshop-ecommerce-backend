const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
app.use(cors());

const mongoURI = process.env.MONGODB_URL;

mongoose.connect(mongoURI)

app.use(express.json());

app.get('/', (req,res) => {
    res.send("KawsarShop API is Ready")
});


app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running at: (http://localhost:5000)`)
})