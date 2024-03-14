import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'
import { randomUUID } from 'crypto'

interface Upload {
  filename: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ filename }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      filename,
      url,
    })

    return { url }
  }
}
