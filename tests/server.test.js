const expect = require("expect");
const request = require("supertest");
const sinon = require("sinon");
const assert = require("assert");

const {app} = require("../server/server");
const dynamodb = require("../server/dynamodb");

describe("POST todos", () => {
    it("should create a new todo", (done) => { // Have to use "done" because it's asynchronous
        let text = "test todo text";

        sinon.stub(dynamodb, "postNewTodo").callsFake( (text) => {
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

        sinon.stub(dynamodb, "postNewTodo").callsFake( (text) => {
            return new Promise( (resolve, reject) =>{
                return reject({
                    message: "Error writing to dynamoDB",
                    // error: new Error("Some error"),
                    params: {text}
                });
            });
        });

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

describe("GET todos", () => {

    it("Should get all items", (done) => {
        let results = [
            {
                "id": "1668797b-01e0-4a64-bace-6d67c55d32e1",
                "completed": false,
                "text": "Test from postman"
            },
            {
                "id": "18e56a2e-51f6-438d-bb3b-1771b74cc154",
                "completed": false
            },
            {
                "id": "5af49a6a-ab18-467f-9ce6-5600a37b0efc",
                "completed": false
            }
        ];

        sinon.stub(dynamodb, "getAllTodos").callsFake( () => {
            return new Promise( (resolve, reject) =>{
                return resolve(results);
            });
        });

        request(app)
            .get("/todos")
            .expect(200)
            .expect( (response) => {
                expect(response.body.length).toBe(3);
            })
            .end(done);
    });

}); // describe GET