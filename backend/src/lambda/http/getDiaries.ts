import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllDiaries } from "../../Logic/diary";
import { parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const logger = createLogger('getDiary');


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  console.log('Processing event: ', event)
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
console.log("userid : ",userId,"jwtToken : ",jwtToken);
  const diaries = await getAllDiaries(userId);
  logger.info(`get all diaries for user ${userId}`);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: diaries
    })
};
})

handler.use(
  cors({
    credentials: true
  })
)