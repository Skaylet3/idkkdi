import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ParticipatedEventDto {
  @ApiProperty({
    description: 'Event UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    type: String,
  })
  eventId: string;

  @ApiProperty({
    description: 'Event name',
    example: 'Q1 2025 School Assessment',
    type: String,
  })
  eventName: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'First quarter assessment for all teachers',
    type: String,
  })
  eventDescription?: string;

  @ApiProperty({
    description: 'Whether the event is currently active',
    example: true,
    type: Boolean,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Number of questions answered by the teacher',
    example: 15,
    type: Number,
  })
  answeredQuestionsCount: number;

  @ApiProperty({
    description: 'Total number of questions in the event',
    example: 15,
    type: Number,
  })
  totalQuestionsCount: number;

  @ApiProperty({
    description: 'Timestamp when teacher first participated in this event',
    example: '2025-12-03T10:30:00.000Z',
    type: Date,
  })
  participatedAt: Date;
}
