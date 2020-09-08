var express = require('express');
var cors = require('cors')
var PORT = process.env.PORT || 3000;
var app = express();
app.use(cors())

if (process.env.NODE_ENV === 'production') {
  // Express serve up index.html file if it doesn't recognize route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('index.html'));
  });
}

var bodyParser = require('body-parser');
const { options } = require('superagent');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: 'XWJUEBIPNP4JWK6FD2R5TY25AJPVWJTY',
  logger: new log.Logger(log.DEBUG) // optional
});

var makeList = (item) => {
  let  listArray = [];
  listArray.append(item);
  
  return listArray;
}

function listTostring(list){
  var i = 0;
  var str = "";
  for(i in list) {
    str += str + list[i] + " ";
    i += 1;
  }
  return str
}

app.post('/', function(req, res){
    var message = req.body.msg;
    const responses = {
      greeting: ["Hey, how's it going?"],

      list: ["list"],
    };

    let entityBool = (data) => {
      let val = data && data['intents']
        && Array.isArray(data['intents'])
        && data['intents'].length > 0
        &&  data['intents'][0]['name'];
      // console.log(val);
      if(!val){
        return false;
      }

      return val;
    }
    
    let getResponse = (data) => {
      // console.log(entityBool(data));
      if(entityBool(data)){
        if(data['intents'][0]['name'] === 'greeting' && data['intents'][0]['confidence'] > 0.8 ){
          return responses.greeting[
            Math.floor(Math.random() * responses.greeting.length)
          ];
        } 
        if(data['intents'][0]['name'] === 'makeList' && data['intents'][0]['confidence'] > 0.8){
          return responses.list[0];
        }
      } 
      else{
        const errorReply = "Sorry! I did not get you";
        return errorReply;
      }
    }

    client.message(message)
      .then(data => {
        console.log(data);
        // console.log(getResponse(data));
        return getResponse(data);
      })
      .then(data => {
        // var user = { msg: data };
        // console.log(user);
        res.send(data);
        res.end();
        return "msg sent";
      })
      .catch(error => console.log(error));
});

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});

// Consolas, 'Courier New', monospace