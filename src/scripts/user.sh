#!/usr/bin/env bash

HOST="http://localhost:8080"

# step 1: register supervisor
#curl -X POST "$HOST/api/supervisor/register" -H "Content-Type: application/json" \
# -d '{ "username": "admin", "password": "password123abc" }'

## ste 2: add learners (NOTE: need cookie for authenticated session)
#curl -X POST "$HOST/api/user" -H "Content-Type: application/json" \
##-H 'Cookie: JSESSIONID=5AD0EC09D326F81F39C89E546F19A3EE' \
# -d '{ "username": "amelia", "name" : "嘟嘟 Amelia" }'
#
#curl -X POST "$HOST/api/user" -H "Content-Type: application/json" \
##-H 'Cookie: JSESSIONID=5AD0EC09D326F81F39C89E546F19A3EE' \
# -d '{ "username": "jayden", "name" : "皮皮 Jayden" }'
