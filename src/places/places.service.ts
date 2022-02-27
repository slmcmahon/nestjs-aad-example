import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { formatWithOptions } from 'util';
import { CreatePlaceDto } from './dto/create-place.dto';
import { getDistanceDto } from './dto/get-distance.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceDocument, Place } from './schemas/place.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<PlaceDocument>) { }

  async create(createPlaceDto: CreatePlaceDto, owner: string): Promise<Place> {
    let model = this.mapDtoToModel(createPlaceDto, owner);
    const createdPlace = new this.placeModel(model);
    return createdPlace.save();
  }

  async findAll(name?: string, owner?: string): Promise<Place[]> {
    let filter = {};
    if (name) {
      filter["name"] = new RegExp(name, "i")
    }
    if (owner) {
      filter["owner"] = owner;
    }
    return this.placeModel.find(filter).exec();
  }

  async findOne(id: string, owner?: string): Promise<Place> {
    let filter = { _id: id };
    if (owner) {
      filter["owner"] = owner;
    }
    return this.placeModel.findOne(filter);
  }

  // calculates the distance between two given object ids.
  async calcDistance(fromId: string, toId: string): Promise<getDistanceDto> {
    // First we need to get the actual places that we want to measure between
    let fromPlace: Place = await this.placeModel.findOne({ _id: fromId });
    let toPlace: Place = await this.placeModel.findOne({ _id: toId });

    // We need the coordinates of the 'from' point
    let coords = fromPlace.position.coordinates;

    let result = await this.placeModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [coords[0], coords[1]]
          },
          spherical: true,
          // I cannot figure out how to format the id for this query, so this
          // is the only reason why I have to lookup the 'to' item.  If I can 
          // figure this out, then I can remove that extra call.
          query: { _id: toPlace["_id"] },
          distanceMultiplier: 1 / 1609.34,
          distanceField: "distance"
        }
      },
      {
        // we only care about the distance, so we ask for that and that only
        $project: {
          "distance":1, _id: 0
        }
      }
    ]);
    // the result should look like [{ distance:1234 }]
    return {
      from: fromPlace.name,
      to: toPlace.name,
      distance: result[0].distance
    }
  }

  async update(id: string, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
    throw new NotImplementedException();
  }

  async remove(id: string, owner?: string): Promise<Place> {
    let filter = { _id: id };
    if (owner) {
      filter["owner"] = owner;
    }
    const deletedPlace = await this.placeModel.findOneAndRemove(filter).exec();
    return deletedPlace
  }

  private mapDtoToModel(dto: CreatePlaceDto, owner: string): Place {
    return {
      name: dto.name,
      description: dto.description,
      type: dto.type,
      address: {
        street: dto.address.street,
        city: dto.address.city,
        state: dto.address.state,
        postalCode: dto.address.postalCode,
        country: dto.address.country
      },
      position: {
        type: "Point",
        coordinates: [dto.longitude, dto.latitude]
      },
      auditing: {
        createdBy: owner,
        createdOn: Date.now(),
        modifiedBy: owner,
        modifiedOn: Date.now(),
        owner
      }
    }
  }
} 
