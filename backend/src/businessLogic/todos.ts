import { TodosAccess } from '../dataLayer/todosAcess'
import {parseUserId} from "../auth/utils";
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import {TodoUpdate} from "../models/TodoUpdate";
/*import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'*/

// TODO: Implement businessLogic
const uuidv4 = require('uuid/v4');
const toDoAccess = new TodosAccess();

export async function getAllToDo(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const toDoId =  uuidv4();
    const userId = parseUserId(jwtToken);
    
    
    return toDoAccess.createToDo({
        userId: userId,
        todoId: toDoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${toDoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteToDo(todoId, userId);
}

export function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    return toDoAccess.createAttachmentPresignedUrl(todoId);
}