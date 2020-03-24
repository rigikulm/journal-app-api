import AWS from "aws-sdk";

export function call(action, params) {
  AWS.config.logger = console.logger;
  const dynamoDB = new AWS.DynamoDB.DocumentClient();

  return dynamoDB[action](params).promise();
}