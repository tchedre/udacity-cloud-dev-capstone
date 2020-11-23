import * as AWS from 'aws-sdk';
//import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DiaryItem } from "../models/DiaryItem";
import { UpdateDiaryRequest } from '../requests/UpdateDiaryRequest'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class DiaryAccess {
  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly diaryTable = process.env.DIARY_TABLE,
      private readonly indexName = process.env.INDEX_NAME
  ) {}

  async createDiary(diaryItem: DiaryItem): Promise<DiaryItem> {
      await this.docClient.put({
          TableName: this.diaryTable,
          Item: diaryItem
      }).promise();
      return diaryItem;
  }

  async getAllDiaries(userId: string): Promise<DiaryItem[]> {
      const result = await this.docClient.query({
          TableName: this.diaryTable,
          IndexName: this.indexName,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }
      }).promise();

      return result.Items as DiaryItem[];
  }

  async getDiary(id: string): Promise<DiaryItem>{
    const result = await this.docClient.query({
        TableName: this.diaryTable,
        KeyConditionExpression: 'diaryId = :diaryId',
        ExpressionAttributeValues:{
            ':diaryId': id
        }
    }).promise()

    const item = result.Items[0];
    return item as DiaryItem;
}

async deleteDiary(diaryId: string, userId: string): Promise<void> {
    this.docClient
        .delete({
            TableName: this.diaryTable,
            Key: {
                diaryId,
                userId
            },
        })
        .promise();
}

async updateDiary(diaryId:string, userId: string, updatedDiary:UpdateDiaryRequest){
    await this.docClient.update({
        TableName: this.diaryTable,
        Key:{
            'diaryId':diaryId,
            'userId':userId
        },
        UpdateExpression: 'set #namefield = :n, dueDate = :d',
        ExpressionAttributeValues: {
            ':n' : updatedDiary.name,
            ':d' : updatedDiary.dueDate
        },
        ExpressionAttributeNames:{
            "#namefield": "name"
          }
      }).promise()
}

public async setAttachmentUrl(
    diaryId: string,
    userId: string,
    attachmentUrl: string,
): Promise<void> {
    this.docClient
        .update({
            TableName: this.diaryTable,
            Key: {
                diaryId: diaryId,
                userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl,
            },
            ReturnValues: 'UPDATED_NEW',
        })
        .promise();
}

}