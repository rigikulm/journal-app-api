// create.js - Creates new journal entries
//
import uuid from "uuid";
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);
    const date = new Date();

    const params = {
        TableName: process.env.tableName,
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'entryId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            entryId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: date.toISOString()
        }
    };

    dynamoDb.put(params, (error, data) => {
        // Set response headers to enable CORS
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        };

        // Return status code 500 on error
        if (error) {
            const response = {
                statusCode: 500,
                headers: headers,
                body: JSON.stringify({ status: false })
            };
            callback(null, response);
            return;
        }

        const response = {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    });

}