import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { updateDiary } from "../../Logic/diary";
import { parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateDiaryRequest } from '../../requests/UpdateDiaryRequest'

const logger = createLogger('updateDiary');


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const diaryId = event.pathParameters.diaryId
  const updatedDiary: UpdateDiaryRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedDiary" object
  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];
  const userId = parseUserId(jwtToken);
  logger.info(`User ${userId} update diary ${diaryId} with values ${updatedDiary}`)
  await updateDiary(diaryId, userId, updatedDiary);
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