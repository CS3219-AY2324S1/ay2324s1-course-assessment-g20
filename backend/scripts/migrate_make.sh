#!/bin/bash

# Command line arguments to be provided are the names of the microservices
# for which to run knex commands in.
if [ -z $1 ]
then
    echo Please specify a microservice name to make a migration file for!
    exit
fi

microservice=$1
shift

yarn knex $microservice migrate:make -x ts "$@"
