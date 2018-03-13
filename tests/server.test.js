const expect = require("expect");
const request = require("supertest");
const sinon = require("sinon");
const assert = require("assert");

const {app} = require("../server/server");
const dynamodb = require("../server/dynamodb");

describe("POST todos", () => {
    it("should create a new todo", (done) => { // Have to use "done" because it's asynchronous
        let text = "test todo text";

        let postNewTodoStub = sinon.stub(dynamodb, "postNewTodo").callsFake( (text) => {
            return new Promise( (resolve, reject) =>{
                return resolve({text});
            });
        });

        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                dynamodb.postNewTodo.restore();
                //assert(postNewTodoStub.called);
                if(error){
                    return done(error);
                }
                done();
            });
    });

    it("should fail validation", (done) => { // Have to use "done" because it's asynchronous
        let text = "";

        // let stub = sinon.stub(dynamodb, "postNewTodo").callsFake( (text) => {
        //     return new Promise( (resolve, reject) =>{
        //         return reject({
        //             message: "Error writing to dynamoDB",
        //             // error: new Error("Some error"),
        //             params: {text}
        //         });
        //     });
        // });

        request(app)
            .post("/todos")
            .send({text})
            .expect(400)
            .end((error, res) => {
                // assert(stub.called);
                if(error){
                    return done(error);
                }

                done();
            });
    });
}); // describe