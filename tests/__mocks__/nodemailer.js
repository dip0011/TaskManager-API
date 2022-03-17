class CreateTransportClass {
    sendMail(){
      //console.log("mocked mailer");
    }
}
const createTransport = ()=>{
    return new CreateTransportClass()
}
  
  
module.exports = {
    createTransport
}