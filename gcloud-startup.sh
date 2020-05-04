#!/bin/bash

#echo "Project ID: ${PROJECTID} Bucket: ${BUCKET}"

# Get the files we need
gsutil cp gs://pahuang-coldline-bucket/chinese-backend-0.0.1-SNAPSHOT.jar .

# Install dependencies
sudo apt-get update
sudo apt-get -y --force-yes install openjdk-8-jdk

# Make Java 8 default
sudo update-alternatives --set java /usr/lib/jvm/java-8-openjdk-amd64/jre/bin/java

# Forward port 80 to 8080
# https://stackoverflow.com/a/33704078
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

