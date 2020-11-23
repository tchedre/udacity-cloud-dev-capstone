import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createDiary } from "../../Logic/diary";
import { parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { CreateDiaryRequest } from '../../requests/CreateDiaryRequest'

const logger = createLogger('createDiary');

export const handler= middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newDiary: CreateDiaryRequest = JSON.parse(event.body)
  
  // TODO: Implement creating a new TODO item
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  const newItem = await createDiary(newDiary, userId);
  logger.info(`create Diary for user ${userId} with data ${newDiary}`);
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item :{
        ...newItem,
      }
    }),
};
})

handler.use(
  cors({
    credentials: true
  })
)