import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type PlaceDocument = Place & Document;

@Schema()
export class Place {
    @ApiProperty({ description: "The name of the location" })
    @Prop()
    name: string;

    @Prop()
    @ApiProperty({ description: "A description of the location" })
    description: string;

    @Prop()
    @ApiProperty({ description: "The place type (e.g. hotel, restaurant, residential, etc.)"})
    type: string;

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
        description: "GPS Coordinates.",
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
    position: Record<string, any>;

    @Prop(raw({
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postalCode: { type: String },
        country: { type: String }
    }))
    @ApiProperty({
        description: "Address details",
        type: "object",
        properties: {
            street: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            postalCode: {type: "string" },
            country: { type: "string" }
        }
    })
    address: Record<string, any>;

    @Prop(raw({
        createdBy: { type: String },
        createdOn: { type: Date },
        modifiedBy: { type: String },
        modifiedOn: { type: Date },
        owner: { type: String }
    }))
    @ApiProperty({
        description: "Auditing Details",
        type: "object",
        properties: {
            createdBy: { type: "string" },
            createdOn: { type: "string" },
            modifiedBy: { type: "string" },
            modifiedOn: { type: "string" },
            owner: { type: "string" }
        }
    })
    auditing: Record<string, any>;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);