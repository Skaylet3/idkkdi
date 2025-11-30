export interface EventProps {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Event {
  private constructor(private props: EventProps) {}

  static create(
    props: Omit<EventProps, 'id' | 'createdAt' | 'updatedAt'> & {
      isActive?: boolean;
    },
  ): Event {
    return new Event({
      ...props,
      id: crypto.randomUUID(),
      isActive: props.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: EventProps): Event {
    return new Event(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string | undefined): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  toggleActive(): void {
    this.props.isActive = !this.props.isActive;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
