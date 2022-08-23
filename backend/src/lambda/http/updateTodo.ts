import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'

import { updateToDo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  console.log("Processing an event ", event);
  const authorizationHeader = event.headers.Authorization;
  const splitAuthHeader = authorizationHeader.split(' ');
  const jwtToken = splitAuthHeader[1];

  const id = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  const toDoItem = await updateToDo(updatedTodo, id, jwtToken);

  return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "item": toDoItem
      }),
  }
};
