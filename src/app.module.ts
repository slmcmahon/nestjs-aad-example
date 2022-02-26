import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlacesModule } from './places/places.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AzureADStrategy } from './auth/azure-ad.guard';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    PlacesModule,
    PassportModule
  ],
  controllers: [],
  providers: [AzureADStrategy],
})
export class AppModule {}
