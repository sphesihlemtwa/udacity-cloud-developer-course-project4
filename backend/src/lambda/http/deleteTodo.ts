import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
//import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteToDo } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Remove a TODO item by id
  console.log("Processing an event ", event);
  const authorizationHeader = event.headers.Authorization;
  const splitAuthHeader = authorizationHeader.split(' ');
  const jwtToken = splitAuthHeader[1];

  const todoId = event.pathParameters.todoId;

  const deleteData = await deleteToDo(todoId, jwtToken);

  return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: deleteData,
  }
};
