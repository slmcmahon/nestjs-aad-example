import { ApiProperty } from "@nestjs/swagger";

export class getDistanceDto {
    @ApiProperty()
    from: string;

    @ApiProperty()
    to: string 

    @ApiProperty()
    distance: number;
}
