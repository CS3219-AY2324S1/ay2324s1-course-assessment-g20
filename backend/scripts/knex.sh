#!/bin/bash

# Command line arguments to be provided are the names of the microservices
# for which to run knex commands in.
if [ -z $1 ]
then
    echo Please specify a microservice name to run knex commands in!
    exit
fi

microservice=$1
shift # Remove first command line argument (which specifies the microservice)

yarn knex-script ./apps/$microservice/knexfile.ts "$@"
