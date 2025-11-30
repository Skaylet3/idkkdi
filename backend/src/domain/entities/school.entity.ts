export interface SchoolProps {
  id: string;
  name: string;
  address?: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class School {
  private constructor(private props: SchoolProps) {}

  static create(
    props: Omit<SchoolProps, 'id' | 'createdAt' | 'updatedAt'>,
  ): School {
    return new School({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: SchoolProps): School {
    return new School(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get adminId(): string {
    return this.props.adminId;
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

  updateAddress(address: string | undefined): void {
    this.props.address = address;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
