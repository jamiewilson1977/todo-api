const uuid = require("uuid-random");
const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: "wilserve"});
AWS.config.credentials = credentials;
AWS.config.update({region: "us-east-1"});

let dynamo = new AWS.DynamoDB();

const toDoTableParams = {
    TableName: "todo",
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

const usersTableParams = {
    TableName: "users",
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S"
        }
    ],
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH"
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

let validateTable = (tableName, params) => {
    console.log("validating table: ", tableName);
// Check if the table exists. If not, create it.
    dynamo.describeTable({TableName: tableName}, (error, tableData) => {
        if (error && error.code === "ResourceNotFoundException") {
            console.log("Resource not found, create table");
            dynamo.createTable(params, (error, tableOut) => {
                if (error) {
                    console.log(`Error creating \"${tableName}\" table: `, error);
                }
            });
            return;
        }

        if (error) {
            console.log("Error encounted while getting table", error);
            return;
        }

        console.log(JSON.stringify(tableData, null, 2));
    });
};

let validateTablePromise = (tableName, params) => {
    let prom = dynamo.describeTable({TableName: tableName}).promise();
    prom.then((tableData) => {
        console.log("Table Data: ", tableData);
    }, (error) => {
        if (error && error.code === "ResourceNotFoundException") {
            console.log(`Table ${tableName} does not exist, creating ....`);
            return dynamo.createTable(params).promise();
        }
        throw error;
    })
        .then((tableCreateOut) => {
            console.log(`Table ${tableName} created.`);
        })
        .catch((error) => {
            console.log("Error describing table:", error);
        });
};

validateTable("todo", toDoTableParams);
validateTablePromise("users", usersTableParams);

let itemId = uuid();
console.log("Item Id: ", itemId);

let item = {
    Item: {
        id: {
            S: itemId
        },
        text: {
            S: "Some things to do"
        },
        complete: {
            BOOL: false
        }
    },
    TableName: "todo"
};

// dynamo.putItem(item, (error, result) => {
//     if(error){
//         console.error(`Error writing new item:`, error);
//         return;
//     }
//     console.log("successfully inserted new item", result);
//
// });