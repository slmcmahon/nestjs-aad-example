import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Place } from './schemas/place.schema';
import { AzureADGuard } from '../auth/azure-ad.guard';
import { RequireScope } from 'src/auth/auth.decorator';
import { getDistanceDto } from './dto/get-distance.dto';

@ApiTags("Places")
@Controller('places')
@UseGuards(AzureADGuard)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @ApiOkResponse({ type: Place })
  @ApiUnauthorizedResponse()
  @Post()
  create(@RequireScope([
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Body() createPlaceDto: CreatePlaceDto) {
    let owner = auth.authorize([]);
    return this.placesService.create(createPlaceDto, owner);
  }

  @ApiOkResponse({ type: Place, isArray: true })
  @ApiNotFoundResponse()
  @ApiQuery({ name: 'name', required: false })
  @Get()
  findAll(@RequireScope([
    "Places.Read",
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Query("name") name?: string) {
    let owner = auth.authorize();
    console.log(owner);
    return this.placesService.findAll(name, owner);
  }

  @ApiOkResponse({ type: Place })
  @ApiNotFoundResponse()
  @Get(':id')
  findOne(@RequireScope([
    "Places.Read",
  ]) auth: any, @Param('id') id: string) {
    let owner = auth.authorize();
    console.log(owner);
    return this.placesService.findOne(id, owner);
  }

  @ApiOkResponse({ type: getDistanceDto })
  @Get(':fromId/distanceto/:toId')
  getDistance(@RequireScope(["Places.Read"]) auth: any, @Param('fromId') fromId: string, @Param('toId') toId: string) {
    auth.authorize();
    return this.placesService.calcDistance(fromId, toId);
  }

  @ApiOkResponse({ type: Place })
  @ApiNotFoundResponse()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceDto: UpdatePlaceDto) {
    return this.placesService.update(id, updatePlaceDto);
  }

  @ApiOkResponse({ type: Place })
  @ApiNotFoundResponse()
  @Delete(':id')
  remove(@RequireScope([
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Param('id') id: string) {
    let owner = auth.authorize(["Places.ReadWrite.All"])
    return this.placesService.remove(id, owner);
  }
}
