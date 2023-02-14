const bodyParser = require('body-parser');
const { application } = require('express');
const express = require('express')
const dbConnect = require('./config/dbConnect')
const notFound = require('./middleware/errorHandler')
const app = express();
const dotenv = require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const productRoutes = require('./routes/productRoutes')
const morgan = require('morgan')


const PORT = process.env.PORT
dbConnect()

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());

app.use('/api/user', authRoutes)
app.use('/api/product', productRoutes)

//app.use(notFound.notFound);
app.use(notFound.ErrorHandler);



app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`)
});