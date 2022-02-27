import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { pipeline } from 'stream';

export type PlaceDocument = Place & Document;

@Schema()
export class Place {
    @ApiProperty({ description: "The name of the location" })
    @Prop()
    name: string

    @Prop()
    @ApiProperty({ description: "A description of the location" })
    description: string

    /*
       In order to run queries on this value, you will need to create a 2dsphere index in MongoDB.
       To do that, find the places collection and run this:
       db.places.createIndex({"position":"2dsphere"})
    */
    @Prop(raw({
        type: { type: String },
        coordinates: { type: [Number] }
    }))
    @ApiProperty({
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Point or Polygon"
            },
            coordinates: {
                type: "array",
                items: {
                    type: "number",
                    description: "An array of coordinates"
                }
            }
        }
    })
    position: Record<string, any>

    @Prop()
    @ApiProperty()
    boundsType: string

    @Prop(raw({
        city: { type: String },
        state: { type: String },
        country: { type: String },
        region: { type: String },
        zoneType: { type: String },
        zoneCode: { type: String }
    }))
    @ApiProperty({
        type: "object",
        properties: {
            city: { type: "string" },
            state: { type: "string" },
            country: { type: "string" },
            region: { type: "string" },
            zoneType: { type: "string" },
            zoneCode: { type: "string" }
        }
    })
    address: Record<string, any>

    @Prop(raw({
        createdBy: { type: String },
        createdOn: { type: Date },
        modifiedBy: { type: String },
        modifiedOn: { type: Date },
        owner: { type: String }
    }))
    @ApiProperty({
        type: "object",
        properties: {
            createdBy: { type: "string" },
            createdOn: { type: "string" },
            modifiedBy: { type: "string" },
            modifiedOn: { type: "string" },
            owner: { type: "string" }
        }
    })
    auditing: Record<string, any>
}

export const PlaceSchema = SchemaFactory.createForClass(Place);