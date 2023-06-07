#
set -a
source .env
set +a

docker exec -it atoma-compound-db mongosh --username $MONGO_USERNAME --password=$MONGO_PASSWORD