# Train Tracker API

## Introduction

A restful API to provide information about UK train services.

## How to run

You can easily run the service using the pre-build docker container:

```bash
docker run -p 80:3000 -e DARWIN_TOKEN=REPLACE -detach jamesgawn/train-tracker-api
```

You will need to provide a darwin token via the environment variable DARWIN_TOKEN for the service to access the national rail APIs. You can find out how to obtain one on the [national rail website](https://www.nationalrail.co.uk/100296.aspx)

## Available Endpoints

The following endpoints are available:

|Endpoint | Description |
|:---|:---|
| /health/ping | Returns ok if service is up |
| /station/_crsCode_ | Returns the station details |
| /departureBoard/_crsCode_ _or_ /departureBoard/_stationName_  | Returns the services departing from the station |
| /departureBoard/_crsCode_/_destinationCrsCode | Returns the services departing from the station to the specified destination |
| /departureBoardWithDetails/_crsCode_ | Returns the services departing from the station with detailed info |
| /departureBoardWithDetails/_crsCode_/_destinationCrsCode | Returns the services departing from the station to the specified destination with detailed info |

You can get a list of station crs codes from the [national website](https://www.nationalrail.co.uk/100298.aspx), or you can use the station endpoint to look them up.