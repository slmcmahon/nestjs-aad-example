import { ApiProperty } from "@nestjs/swagger";

export class createAddressDto {
    @ApiProperty()
    street: string;

    @ApiProperty()
    city: string;
    
    @ApiProperty()
    state: string;

    @ApiProperty()
    postalCode: string;

    @ApiProperty()
    country: string;
}