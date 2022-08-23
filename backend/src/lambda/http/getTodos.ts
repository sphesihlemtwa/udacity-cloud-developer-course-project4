import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler} from 'aws-lambda';
import {getAllToDo} from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log("Processing an event ", event);
  const authorizationHeader = event.headers.Authorization;
  const splitAuthHeader = authorizationHeader.split(' ');
  const jwtToken = splitAuthHeader[1];

  const toDos = await getAllToDo(jwtToken);

  return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "items": toDos,
      }),
  }
};
