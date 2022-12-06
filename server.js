const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));


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
  const newMessage = {
    id: newMessageId,
    from: request.body.from,
    text: request.body.text
  }
  messages.push(newMessage);
  response.status(201).json(messages);
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
