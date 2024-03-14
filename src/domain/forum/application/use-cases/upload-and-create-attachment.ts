import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentRequestUseCase {
  filename: string
  filetype: string
  body: Buffer
}

type UploadAndCreateAttachmentResponseUseCase = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    filename,
    filetype,
    body,
  }: UploadAndCreateAttachmentRequestUseCase): Promise<UploadAndCreateAttachmentResponseUseCase> {
    if (!/^(image\/(jpg|jpeg|png))$|^application\/pdf/.test(filetype)) {
      return left(new InvalidAttachmentTypeError(filetype))
    }

    const { url } = await this.uploader.upload({
      filename,
      filetype,
      body,
    })

    const attachment = Attachment.create({
      title: filename,
      url,
    })

    await this.attachmentsRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
