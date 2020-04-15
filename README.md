# eik-search
Playground for developing search for https://eik.dev/ using Elasticsearch

## Purpose

Have a simple way to spin up a dev environment for developing search for eik.dev

The larger goal is to then develop search for eik.dev

Work in progress...

Current status: Ability to spin up Elasticsearch and Kibana quickly, add an index containing hardcoded data for use while developing search, run search queries, run node.js app that currently does nothing much


## Pre-Requisites

1. Install [docker](https://docs.docker.com/install/)
2. Install [docker-compose](https://docs.docker.com/compose/install/)
3. Clone this repo
4. Install [node.js](https://nodejs.org/)


## Steps to take

1. Run docker-compose to quickly spin up Elasticsearch and Kibana
2. Verify Elasticsearch and Kibana are running locally
3. TODO: Optional: Become familiar with useful Docker commands
4. Index precondition: Add an ingest pipeline to the index that creates a scope field based on name
5. Index creation: Add an index of hardcoded data into Elasticsearch for use while developing search
6. Try out search queries in Kibana Dev Tools while developing search
7. Search app precondition: Install and run node.js app
8. TODO: Create node.js app with search


### Run docker-compose to quickly spin up Elasticsearch and Kibana

Spin up a containerised instance of Elasticsearch and Kibana

```
docker-compose up
```

### Verify Elasticsearch and Kibana are running locally

Navigate to http://localhost:9200/

You might need to wait around 20 seconds for Elasticsearch and Kibana to be up and running.

The response should show a response from Elasticsearch indicating it is up and running.

Example response at the time of writing:

```
{
  "name" : "eik-elasticsearch",
  "cluster_name" : "es-docker-cluster",
  "cluster_uuid" : "IvWJmJu2SdybDbmRHpgAlA",
  "version" : {
    "number" : "7.5.0",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "e9ccaed468e2fac2275a3761849cbee64b39519f",
    "build_date" : "2019-11-26T01:06:52.518245Z",
    "build_snapshot" : false,
    "lucene_version" : "8.3.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

Navigate to http://localhost:5601/

The web browser should show the home page of Kibana, the UI used for developing and running Elasticsearch queries that will be used in the https://eik.dev/ application for search.

### Index precondition: Add an ingest pipeline to the index that creates a scope field based on name

Create the ingest pipeline

```
# Create a "scope" field containing the value of "name" between @ and / otherwise leave blank
# Example, if "name" : "@jane/foo.js" then "scope" : "jane"

PUT _ingest/pipeline/create_scope_field
{
  "processors": [
    {
      "gsub": {
        "field": "name",
        "pattern": "^@(.*)/(.*)",
        "replacement": "$1",
        "target_field": "scope"
      }
    },
    {
      "set": {
        "if": "ctx.name == ctx.scope",
        "field": "scope",
        "value": ""
      }
    }
  ]
}
```

Add this ingest pipeline to the index

```
# Always apply this pipeline to the index

PUT anita3
{
  "settings": {
    "default_pipeline": "create_scope_field"
  }
}
```

### Index creation: Add an index of hardcoded data into Elasticsearch for use while developing search

In Kibana, open the Dev Tools console in the left hand panel

Copy and paste this command into Dev Tools and run the command

```
# Add an index of hardcoded data for use while developing search

POST _bulk
{"index": {"_index": "anita3", "_id" : "1"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "8.5.3", "author" : { "name" : "Second User", "user" : "second_user" }, "name" : "some-package", "type" : "package", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 19208 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 881205 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 96583 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 9182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 687 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "2"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "8.6.3", "author" : { "name" : "Second User", "user" : "second_user" }, "name" : "some-package", "type" : "package", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 29208 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 9981205 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 96583 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 9182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 687 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "3"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "8.4.1", "author" : { "name" : "Some User", "user" : "some_user" }, "name" : "example.com", "type" : "package", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 75208 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 771205 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 75483 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 769182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 68 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "4"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "8.5.2", "author" : { "name" : "Third User", "user" : "number_three" }, "name" : "under_score", "type" : "map", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 99208 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 8781205 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 965483 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 779182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 68 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "5"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "8.7.3", "author" : { "name" : "Anita is Cool", "user" : "anitaIsCool" }, "name" : "under_score", "type" : "map", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 329208 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 89815 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 76583 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 10182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 687 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "6"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "9.0.0", "author" : { "name" : "Anita is Cool", "user" : "anitaIsCool" }, "name" : "123numeric", "type" : "package", "org" : "biz", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 329300 }, { "integrity" : "sha512-0K6U6pmI04xIBGE+KgfSRNMY0gBmKAwjWzZ+DM/tkicZSG+Uz5erTFw1Zru/0wXUPs256glMX24n0f1Q4z62tw==", "pathname" : "/main/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 89825 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 7583 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 10182 }, { "integrity" : "sha512-WmTcH9Z9W0/dppj6eypuw7an0wW06GBS9PxNqQ4/I/oJs7OiuIulbE2+q5eHPgvqaSPKs49R4wT9ftX2GxU/Sw==", "pathname" : "/main/index.css", "mimeType" : "text/css", "type" : "file", "size" : 687 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 165 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 194 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "7"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "1.1.0", "author" : { "name" : "Rose is awesome", "user" : "awesome_Rose" }, "name" : "@npm/thingy", "type" : "package", "org" : "biz two", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 412000 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 2388989 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 165788 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 234 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 340 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "8"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "1.1.0", "author" : { "name" : "Rose is awesome", "user" : "awesome_Rose" }, "name" : "@jane/foo.js", "type" : "map", "org" : "biz two", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 512000 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 3388989 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 165799 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 234 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 340 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "9"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "1.1.2", "author" : { "name" : "Rose is awesome", "user" : "awesome_Rose" }, "name" : "@jane/foo.js", "type" : "map", "org" : "biz two", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 512000 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 3388989 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 165799 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 234 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 340 } ], "meta" : [ ] }
{"index": {"_index": "anita3", "_id" : "10"}}
{"integrity" : "sha512-nOnJP41e2MTxtqvsZW7ueINwP+GIVTgN5l+Y1KA9QcMH6SSaweFqBmxglGj3/07MQSOru7DBZk/IWAOmle5urg==", "timestamp" : "23423534534", "version" : "2.0.0", "author" : { "name" : "Rose is awesome", "user" : "awesome_Rose" }, "name" : "@npm/thingy", "type" : "package", "org" : "biz two", "files" : [ { "integrity" : "sha512-T2qS6EBvOIu10bhUas3FhD39KkwIiXxplJ13q2EdXcA7nlYljlLKaymKhqz49f7qrEKhdISc4q5N+bk0Y1Y/NA==", "pathname" : "/main/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 412000 }, { "integrity" : "sha512-rQhStjrIsElTJci6ZXYSCxGrnJk2Q+11UAi9idgtvehAyqT1LssOiDVCEbJMp4a6bQJB6fLb2QRiHUl+pEDEVQ==", "pathname" : "/ie11/index.js", "mimeType" : "application/javascript", "type" : "file", "size" : 2388989 }, { "integrity" : "sha512-GEu0TFPbh7uuNuDE2pUjzOigwyQu1use25xzIsU2qKRO2jcxWzA4PLmwiNyp2dCWzuddtPVhKRfKJ7LW9Rmrng==", "pathname" : "/ie11/index.js.map", "mimeType" : "application/json", "type" : "file", "size" : 165788 }, { "integrity" : "sha512-HpKd+6/eBPNpxQa1/Z24P6gJ1pNgYJTbiBlCtagUAUK9b6nEjYZzMP9LmDCPOz09AOGB68/eHOSXELNaWEQDSQ==", "pathname" : "/main/index.css.map", "mimeType" : "application/json", "type" : "file", "size" : 234 }, { "integrity" : "sha512-bbvrcbo0thGy8aKJHdvatKDQOi8r2qUflS4DI5VuYlU6H4PSDz1xQprcpxPTX9NSs8pnskYrklqgnDe1GjMn8w==", "pathname" : "/assets.json", "mimeType" : "application/json", "type" : "file", "size" : 340 } ], "meta" : [ ] }
```

There should be no errors in the response.
An index of hardcoded data for use while developing search should have been added.

Verify the index by running this command in Dev Tools:

```
GET anita3/_search
```

There should be some "hits" in the response.


### Try out search queries in Kibana Dev Tools while developing search

In Kibana, open the Dev Tools console in the left hand panel

Copy and paste these commands into Dev Tools, run the commands, and look at the results

```
# Search for all documents in the index

GET anita3/_search
```

```
# Search for documents containing any terms in "name", case insensitive, show only fields listed in _source
# "name" field will always comply with https://github.com/npm/validate-npm-package-name#naming-rules

GET anita3/_search
{
  "_source": ["author.name", "author.user", "name", "org", "scope"],
  "query": {
    "match": {
      "name": "some-package example.com under_score 123numeric @npm/thingy @jane/foo.js"
    }
  }
}
```

```
# Return largest file size

GET anita3/_search
{ "size": 0, 
  "aggs": {
    "largest_file_size": {
      "max": {
        "field": "files.size"
      }
    }
  }
}
```

```
# Get statistics on file sizes

GET anita3/_search
{ "size": 0, 
  "aggs": {
    "file_size_statistics": {
      "stats": {
        "field": "files.size"
      }
    }
  }
}
```

```
# How many versions of each file name exists, for top 10 files?

GET anita3/_search
{
  "size": 0,
  "aggs": {
    "number_of_versions_of_each_file": {
      "terms": {
        "field": "name.keyword",
        "size": 10
      }
    }
  }
}
```

```
# Get top 10 file types and how many of each

GET anita3/_search
{
  "size": 0,
  "aggs": {
    "number_of_file_types": {
      "terms": {
        "field": "type.keyword",
        "size": 10
      }
    }
  }
}
```

### Search app precondition: Install and run node.js app

Install the repo locally

```
npm install
```

Run the app

```
npm start
```

Check the app is working by verifying some text output is displayed when navigating to

```
http://localhost:3000/
```