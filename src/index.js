const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT;

// app.use((req, res, next)=>{
//     res.status(503).send({Message:'Site is under Maintenance, Please visit after some time!'});
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

// set port here
app.listen(port, ()=>{
    console.log('Listening on http://localhost:'+port);
});


