const uuid = require("uuid-random");
const dynamo = require("dynamoose");
const TodoSchema = require("../schemas/schema_todo");
const UserSchema = require("../schemas/schema_user");

const credentials = new dynamo.AWS.SharedIniFileCredentials({profile: "wilserve"});
dynamo.AWS.config.credentials = credentials;
dynamo.AWS.config.update({region: "us-east-1"});

let Todo = dynamo.model("Todo", TodoSchema.todoSchema);
let User = dynamo.model("user", UserSchema.userSchema);

// let newTodo = new Todo({
//     id: uuid(),
//     text: "Something else",
//     completed: false,
//     completedAt: 0
// });

// newTodo.save().then((doc) => {
//     console.log("Saved todo: ", doc);
// }, (error) => {
//     console.log("Unable to save todo: ", error.message);
// });

// var user = new User({
//     email: "test@test.com"
// });
//
// user.save().then((doc) => {
//     console.log("Saved user: ", doc);
// }, (error) => {
//     console.log("Unable to save user: ", error.message);
// });

let postNewTodo = (text) => {
    let todo = new Todo({
        id: uuid(),
        text: text
    });

    return new Promise((resolve, reject) => {
        todo.save().then((doc) => {
            resolve(doc);
        }, (error) => {
            reject({
                message: "Error writing to dynamoDB",
                error: error,
                params: todo
            });
        });
    });
};

let getAllTodos = () => {
    return new Promise((resolve, reject) => {
        Todo.scan({}, (e, items) => {
            if (e) {
                reject(e);
                return;
            }
            resolve(items);
        });
    });
};

// let getNewTodo = (text) => {
//
//     return new Promise( (resolve, reject) => {
//         todo.save().then((doc) => {
//             resolve(doc);
//         }, (error) => {
//             reject({
//                 message: "Error writing to dynamoDB",
//                 error: error,
//                 params: todo
//             });
//         });
//     });
// };

module.exports = {
    postNewTodo,
    getAllTodos
};
