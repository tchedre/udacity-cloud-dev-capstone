import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteDiary } from "../../Logic/diary";
import { parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const logger = createLogger('deleteDiary');

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const diaryId = event.pathParameters.diaryId

  // TODO: Remove a TODO item by id
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  logger.info(`User ${userId} deleting diary ${diaryId}`)
  await deleteDiary(diaryId, userId);
  
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