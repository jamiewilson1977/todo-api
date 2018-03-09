const expect = require("expect");
const request = require("supertest");
const mockito = require("ts-mockito");

const {app} = require("../server/server");
const server = require("../server/server");
let spyDynamodb = mockito.spy(server.dynamodb);
let mockedDynamo:mockDynamo = mockito.mock(server.dynamodb);

describe("POST todos", () => {
    it("should create a new todo", (done) => { // Have to use "done" because it's asynchronous
        let text = "test todo text";

        mockito.when(spyDynamodb.postNewTodo(mockito.anything)).thenResolve({
            id: "id info",
            text: text
        });

        request(app)
            .post("/todos")
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((error, res) => {
                if(error){
                    return done(error);
                }

                done();
            });
    });
}); // describe