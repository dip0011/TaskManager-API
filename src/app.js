const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('../Swagger/swagger.json');
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app

