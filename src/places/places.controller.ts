import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Place } from './schemas/place.schema';
import { AzureADGuard } from '../auth/azure-ad.guard';
import { ValidScopes } from '../auth/valid-scopes.decorator';
import { getDistanceDto } from './dto/get-distance.dto';

@ApiTags("Places")
@Controller('places')
@ApiBearerAuth()
@UseGuards(AzureADGuard)
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @ApiOkResponse({ type: Place })
  @ApiUnauthorizedResponse()
  @Post()
  create(@ValidScopes([
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Body() createPlaceDto: CreatePlaceDto) {
    auth.authorize([]);
    // since we always want the oid here, we only authorize and 
    // get the oid of the user if authorized.
    return this.placesService.create(createPlaceDto, auth.user.oid);
  }

  @ApiOkResponse({ type: Place, isArray: true })
  @ApiNotFoundResponse()
  @ApiQuery({ name: 'name', required: false })
  @Get()
  findAll(@ValidScopes([
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
  findOne(@ValidScopes([
    "Places.Read",
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Param('id') id: string) {
    let owner = auth.authorize();
    console.log(owner);
    return this.placesService.findOne(id, owner);
  }

  @ApiOkResponse({ type: getDistanceDto })
  @Get(':fromId/distanceto/:toId')
  getDistance(@ValidScopes([
    "Places.Read",
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Param('fromId') fromId: string, @Param('toId') toId: string) {
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
  remove(@ValidScopes([
    "Places.ReadWrite",
    "Places.ReadWrite.All"
  ]) auth: any, @Param('id') id: string) {
    let owner = auth.authorize(["Places.ReadWrite.All"])
    return this.placesService.remove(id, owner);
  }
}
