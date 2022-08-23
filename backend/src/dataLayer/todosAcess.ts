import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Types } from 'aws-sdk/clients/s3';
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly documentClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly s3BucketName = process.env.S3_BUCKET_NAME) {
    }

    async getAllToDo(userId: string): Promise<TodoItem[]> {
        console.log("Getting all todos");

        const params = {
            TableName: this.todoTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const output = await this.documentClient.query(params).promise();
        console.log(output);
        const items = output.Items;

        return items as TodoItem[];
    }

    async createToDo(todoItem: TodoItem): Promise<TodoItem> {
        console.log("Creating todo");

        const params = {
            TableName: this.todoTable,
            Item: todoItem,
        };

        const output = await this.documentClient.put(params).promise();
        console.log(output);

        return todoItem as TodoItem;
    }

    async updateToDo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
        console.log("Updating todo");

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
            ExpressionAttributeNames: {
                "#name": "name",
                "#dueDate": "dueDate",
                "#done": "done"
            },
            ExpressionAttributeValues: {
                ":name": todoUpdate['name'],
                ":dueDate": todoUpdate['dueDate'],
                ":done": todoUpdate['done']
            },
            ReturnValues: "ALL_NEW"
        };

        const output = await this.documentClient.update(params).promise();
        console.log(output);
        const attributes = output.Attributes;

        return attributes as TodoUpdate;
    }

    async deleteToDo(todoId: string, userId: string): Promise<string> {
        console.log("Deleting todo");

        const params = {
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        };

        const output = await this.documentClient.delete(params).promise();
        console.log(output);

        return "" as string;
    }

    async createAttachmentPresignedUrl(todoId: string): Promise<string> {
        console.log("Generating SignedURL");

        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.s3BucketName,
            Key: todoId,
            Expires: 1000,
        });
        console.log(url);

        return url as string;
    }
}

