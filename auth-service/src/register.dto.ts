import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'John', description: 'User first name (alphabetic only)' })
    first_name: string;

    @ApiProperty({ example: 'Doe', description: 'User last name (alphabetic only)' })
    last_name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email (must end in .com, .net, .org, or .id)' })
    email: string;

    @ApiProperty({ example: 'Pass1234', description: 'Password (min 8 chars, no spaces, min 2 digits)' })
    password: string;

    @ApiProperty({ example: 'Customer', description: 'User role (e.g., Admin, Customer, Guest)' })
    role: string;
}
