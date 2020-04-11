# eik-search
Playground for developing search for https://eik.dev/ using Elasticsearch

## Purpose

Have a simple way to spin up a dev environment for developing search for eik.dev

The larger goal is to then develop search for eik.dev

Work in progress...

Current status: Ability to spin up Elasticsearch and Kibana quickly


## Pre-Requisites

1. Install [docker](https://docs.docker.com/install/)
2. Install [docker-compose](https://docs.docker.com/compose/install/)
3. Clone this repo

## Steps to take

1. Install the repo locally
2. Run docker-compose to quickly spin up Elasticsearch and Kibana
3. Verify Elasticsearch and Kibana are running locally
4. TODO: Optional: Become familiar with useful Docker commands
5. TODO: Create node.js app with search


### Install the repo locally

```npm install```

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

