export type QuestionType = 'FREE_TEXT' | 'MULTIPLE_CHOICE';

export interface QuestionProps {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Question {
  private constructor(private props: QuestionProps) {}

  static create(
    props: Omit<QuestionProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Question {
    return new Question({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: QuestionProps): Question {
    return new Question(props);
  }

  get id(): string {
    return this.props.id;
  }

  get text(): string {
    return this.props.text;
  }

  get type(): QuestionType {
    return this.props.type;
  }

  get order(): number {
    return this.props.order;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateText(text: string): void {
    this.props.text = text;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
