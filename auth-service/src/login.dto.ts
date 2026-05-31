import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty ({example: 'john.doe@example.com', description: 'user email'})
    email : string

    @ApiProperty ({example: 'Pass1234', description: 'user password'})
    password : string
}