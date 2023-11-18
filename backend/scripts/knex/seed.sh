#!/bin/bash

# Command line arguments to be provided are the names of the microservices
# for which to run knex commands in.
if [ -z $1 ]
then
    echo Please specify at least one microservice name to run the seeds for!
    exit
fi

for microservice in "$@"
do
    yarn knex $microservice seed:run
done