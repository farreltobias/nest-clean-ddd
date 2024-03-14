import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'
import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Subscriber registered (listening to CustomAggregateCreated events)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // Aggregate created without any event dispatched
    const aggregate = CustomAggregate.create()

    // No event dispatched yet (no callback should have been called)
    expect(callbackSpy).not.toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(1)

    // Aggregate marked for dispatch
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // Event dispatched and callback called
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
