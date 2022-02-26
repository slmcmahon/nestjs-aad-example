import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { createAddressDto } from "./create-address.dto";

export class CreatePlaceDto {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    boundsType: string;

    @ApiProperty()
    address: createAddressDto;
}
