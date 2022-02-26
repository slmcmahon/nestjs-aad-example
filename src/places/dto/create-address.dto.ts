import { ApiProperty } from "@nestjs/swagger";

export class createAddressDto {
    @ApiProperty()
    city: string;
    
    @ApiProperty()
    state: string;

    @ApiProperty()
    country: string;

    @ApiProperty()
    region: string;

    @ApiProperty()
    zoneType: string;

    @ApiProperty()
    zoneCode: string;
}