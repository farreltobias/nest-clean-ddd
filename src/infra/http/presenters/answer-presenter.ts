import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class AnswerPresenter {
  static toHTTP(answer: Answer) {
    return {
      id: answer.id.toString(),
      content: answer.content,
      created_at: answer.createdAt,
      updated_at: answer.updatedAt,
    }
  }
}
