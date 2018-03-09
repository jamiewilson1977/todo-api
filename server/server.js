const express = require("express");
const bodyParser = require("body-parser");

let dynamodb = require("./dynamodb");

let app = express();

app.use(bodyParser.json()); // Send JSON to express application

app.post("/todos", (req, res) => {
    dynamodb.postNewTodo(req.body.text).then((doc) => {
        res.send(doc);
    }, (error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

app.get("/todos", (req, res) => {
    dynamodb.postNewTodo(req.body.text).then((doc) => {
        res.send(doc);
    }, (error) => {
        console.log(error);
        res.status(400).send(error);
    });
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

module.exports = {app, dynamodb};