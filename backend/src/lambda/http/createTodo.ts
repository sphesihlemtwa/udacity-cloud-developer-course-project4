import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda'
import 'source-map-support/register'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createToDo } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Implement creating a new TODO item
  console.log("Processing an event  ", event);
  const authorizationHeader = event.headers.Authorization;
  const splitAuthHeader = authorizationHeader.split(' ');
  const jwtToken = splitAuthHeader[1];

  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const todoItem = await createToDo(newTodo, jwtToken);

  return {
      statusCode: 201,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "item": todoItem
      }),
  }
};
