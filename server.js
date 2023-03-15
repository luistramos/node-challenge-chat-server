const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", function (request, response) {
  response.status(200).json(messages);
});

app.post("/messages", function (request, response) {
  const newMessageId = messages.length > 0 ? messages[messages.length-1].id+1:0;
  if(request.body.from.length ==0){
    return response.status(400).json("From is not valid")
  }
  if(request.body.text.length ==0){
    return response.status(400).json("Text is not valid")
  }

  const newMessage = {
    id: newMessageId,
    from: request.body.from,
    text: request.body.text
  }
  messages.push(newMessage);
  response.status(201).json(messages);
});

app.get("/messages/search", function (request, response) {
  let searchQuery = request.query.search;
  console.log("3")
  console.log(searchQuery);
  let result = [];
  for (const obj of messages) {
    if(obj.text.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())) {
      result.push(obj);
    }} 
  response.send(result);
});

app.get("/messages/latest", function (request, response) {
  let searchLast = messages.slice(-2);
  response.send(searchLast);
});


app.get("/messages/:message_id", function (request, response) {
  const messageId = request.params.message_id;
  const result = messages.find(q => q.id == messageId);
  if (result) {
    response.status(200).json(result);
  } else {
    response.status(404).send("Not Found");
  }
});


app.delete("/messages/:message_id", function (request, response) {
  const messageId = request.params.message_id;
  const messageIdx = messages.findIndex(q => q.id == messageId);
  if (messageIdx>-1) {
    messages.splice(messageIdx,1)
    response.status(200).json(messages);
  } else {
    response.status(404).send("Not Found");
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000")
});
