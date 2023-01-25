const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
var cors = require('cors');
app.use(cors());
app.use(express.static('public/build'));


app.use(express.json());// ye json ko js object me convert krta he, isse use krna padta he put aur post req (f/d se server pr data aa rha he)ko chalane ke liye
app.use(cookieParser());

const userRouter = require('./Routers/userRouter');
const planRouter = require('./Routers/planRouter');
const reviewRouter = require('./Routers/reviewRouter');
const bookingRouter = require('./Routers/bookingRouter');

app.use('/plan',planRouter);
app.use('/review',reviewRouter);
app.use('/booking',bookingRouter);
app.use('/user',userRouter);//no need to add localhost i.e. base url



const port = process.env.PORT || 5000;
app.listen(port);


