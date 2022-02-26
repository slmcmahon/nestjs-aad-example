import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceDocument, Place } from './schemas/place.schema';

@Injectable()
export class PlacesService {
  constructor(@InjectModel(Place.name) private placeModel: Model<PlaceDocument>) { }

  async create(createPlaceDto: CreatePlaceDto, owner:string): Promise<Place> {
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
      boundsType: dto.boundsType,
      address: {
        city: dto.address.city,
        state: dto.address.state,
        country: dto.address.country,
        region: dto.address.region,
        zoneType: dto.address.zoneType,
        zoneCode: dto.address.zoneCode
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
