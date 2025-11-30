export interface AnswerProps {
  id: string;
  userId: string;
  questionId: string;
  eventId: string;
  answerText?: string;
  selectedOption?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Answer {
  private constructor(private props: AnswerProps) {}

  static create(
    props: Omit<AnswerProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): Answer {
    return new Answer({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: AnswerProps): Answer {
    return new Answer(props);
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  get eventId(): string {
    return this.props.eventId;
  }

  get answerText(): string | undefined {
    return this.props.answerText;
  }

  get selectedOption(): string | undefined {
    return this.props.selectedOption;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON() {
    return { ...this.props };
  }
}
