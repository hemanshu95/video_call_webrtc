const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000
const jsonParser = bodyParser.json()

//app.use(express.bodyParser());

// app.configure(function(){
//   app.use(express.bodyParser());
//   app.use(app.router);
// });
var toSend = {};
var groups = {};

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/group/:groupId', (req, res) => {
  res.sendFile(path.join(__dirname+'/groupcall.html'));
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname+'/test.html'));
})


app.post('/group/:groupId/register', jsonParser ,(req, res) => {
  var groupId = req.params.groupId;
  var userName = req.body.userName;
  var userId = Date.now() + userName;
  if(groups[groupId]){
      for(index in groups[groupId]){
          addToSend(groups[groupId][index], userId, userId, "new_caller");
      }
      groups[groupId].push(userId);
  }
  else
      groups[groupId] = [userId];   
  res.send({"userId":userId});
})
function addToSend(receiver, sender, msg, type){
    var payload = {'sender' : sender, 'msg' : msg, 'type' : type };
    if(toSend[receiver])
      toSend[receiver].push(payload);
    else
      toSend[receiver] = [payload];
}

app.post('/sendMsg', jsonParser,(req, res) =>{

	console.log('Got body:', req.body);
    var sender = req.body.sender;
    var receiver = req.body.receiver;
    var msg = req.body.msg;
    var type = req.body.type;
    addToSend(receiver, sender, msg, type);
   	console.log(toSend); 
    res.sendStatus(200);

})

app.post('/getMsg', jsonParser,(req, res) =>{

	console.log('Got body:', req.body);
  console.log('groups', groups);
    var sender = req.body.sender;
    res.send(toSend[sender]);
    delete toSend[sender];
    console.log(toSend);

})


app.listen(PORT, () => {
  console.log(`Example app listening at port ${PORT}`)
})