const app = require('./app');
const port = process.env.PORT;

// set port here
app.listen(port, ()=>{
    console.log('Listening on http://localhost:'+port);
});


