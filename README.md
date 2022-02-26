# NestJS API Example with Azure AD Authorization

I've created this project to learn how to apply Azure AD Authorization to a NestJS web API.  Some things covered here are:

* @nestjs/swagger
* Mongoose for MongoDB
* Azure AD Authorization
* Guards
* Custom decorators

I have deployed this application as a containerized Azure App Service that uses MongoDB Atlas for peristence.  However, it is very easy to run locally by running MongoDB either locally installed or by using Docker.  I've included a docker-compose.yml file to make this easier.

## Using this example

For my testing purposes, I created an Azure AD Directory and added two app registrations:

1. Places API 
2. Places Client

In 'Places API', I added a typical redirect URI (which we won't use, but must exist) and enabled access tokens and id tokens.  Then, I exposed an API with the following scopes:

* Places.Read
* Places.ReadWrite
* Places.ReadWrite.All

These scopes must exist for this application to work.  

Next, for "Places Client", I selected "API permissions", then click "+ Add a permission" and chose "My APIs", then selected "Places API".  From there, you can see all of the scopes.  You'll at least need to select "Places.Read" and "Places.ReadWrite" or you will not be able POST to create a new place.

Next, add a .env file in the root of the application with the following variables defined.  I've left the local container url for MongoDB, however you can point this wherever you like.

```
MONGO_URL=mongodb://root:pwd@127.0.0.1:27017
AZ_AD_CLIENT_ID=<Places API client id>
AZ_AD_TENANT_ID=<Places API tenant id>
AZ_AD_LOG_LEVEL=<your log level eg. debug, warn, error, etc.>
```

1. run ```docker-compose up -d``` to launch your database.
2. run ```npm install```
3. run ```npm run start:dev```

To test this, you'll need to first acquire an access token for your "Places Client" Azure AD App and send it in the header as:

```
Authorization: Bearer <your-token>
```