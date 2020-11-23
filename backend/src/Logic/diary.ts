import * as uuid from 'uuid'

import { DiaryItem } from '../models/DiaryItem'
import { DiaryAccess } from '../dataLayer/diaryAccess'
import { CreateDiaryRequest } from '../requests/CreateDiaryRequest'
import { UpdateDiaryRequest } from '../requests/UpdateDiaryRequest'
// import { parseUserId } from '../auth/utils'

const diaryAccess = new DiaryAccess()

export async function getAllDiaries(userId: string): Promise<DiaryItem[]> {
  return diaryAccess.getAllDiaries(userId)
}

export async function createDiary(
    createDiaryRequest: CreateDiaryRequest,
    userId: string
): Promise<DiaryItem> {

  const itemId = uuid.v4()

  return await diaryAccess.createDiary({
        diaryId: itemId,
        userId: userId,
        name: createDiaryRequest.name,
        dueDate: createDiaryRequest.dueDate,
        createdAt: new Date().toISOString()
  })
}

export async function deleteDiary(
  diaryId: string,
  userId: string
): Promise<void> {
  const diary = await diaryAccess.getDiary(diaryId);

  diaryAccess.deleteDiary(diary.diaryId, userId);
}

export async function updateDiary(
  diaryId: string,
  userId: string,
  updateDiaryRequest: UpdateDiaryRequest
): Promise<void> {
  const diary = await diaryAccess.getDiary(diaryId);

  diaryAccess.updateDiary(diary.diaryId, userId, updateDiaryRequest);
}

export async function setAttachmentUrl(
  diaryId: string,
  userId: string,
  attachmentUrl: string,
): Promise<void> {
  const diary = await diaryAccess.getDiary(diaryId);

  diaryAccess.setAttachmentUrl(diary.diaryId, userId, attachmentUrl);
}