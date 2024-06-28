const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const PORT = process.env.PORT;
const URI = process.env.DATABASE;
const app = express();
const router = require('./router/userRouter');

app.use(express.json());

app.use('/api/v1/user', router);


app.use('/', (req, res) => {
    res.status(200).send('Welcome to our user validation Homepage')
})

mongoose.connect(URI)
.then(() => {
    console.log('Connection to Database is successful');
})
.catch((e) => {
    console.log('Error connecting to databse ', e.message);
})

app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`);
})