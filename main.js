const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = 3000
const jsonParser = bodyParser.json()
const host = "0.0.0.0"

//app.use(express.bodyParser());

// app.configure(function(){
//   app.use(express.bodyParser());
//   app.use(app.router);
// });
var toSend = {};

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname+'/test.html'));
})

app.post('/sendMsg', jsonParser,(req, res) =>{

	console.log('Got body:', req.body);
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var msg = req.body.msg;
    var type = req.body.type;
    var payload = {'sender' : sender, 'msg' : msg, 'type' : type };
    if(toSend[receiver])
    	toSend[receiver].push(payload);
    else
    	toSend[receiver] = [payload];
   	console.log(toSend); 
    res.sendStatus(200);

})

app.post('/getMsg', jsonParser,(req, res) =>{

	console.log('Got body:', req.body);
    var sender = req.body.sender;
    res.send(toSend[sender]);
    delete toSend[sender];
    console.log(toSend);
 	//res.send(req.json());

})


app.listen(port, () => {
  console.log(`Example app listening at http://${host}:${port}`)
})