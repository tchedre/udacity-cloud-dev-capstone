import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteTodo } from "../../Logic/todos";
import { parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const logger = createLogger('deleteTodo');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  logger.info(`User ${userId} deleting todo ${todoId}`)
  await deleteTodo(todoId, userId);
  
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: '',
};
})

handler.use(
    cors({
      credentials: true
    })
  )