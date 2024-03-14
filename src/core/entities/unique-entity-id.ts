import { randomUUID } from 'crypto'

export class UniqueEntityID {
  private value: string

  toString(): string {
    return this.value
  }

  toValue(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? randomUUID()
  }

  equals(id: UniqueEntityID): boolean {
    return id.toValue() === this.value
  }
}
