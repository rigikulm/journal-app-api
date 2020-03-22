// create.js - Creates new journal entries
//
import uuid from "uuid";
import * as dynamoDbLib from "./lib/dynamodb-lib";
import {success, failure} from "./lib/response-lib";
//import AWS from "aws-sdk";

export async function main(event, context, callback) {
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

    try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
    } catch (e) {
        return failure({status: false});
    }
}