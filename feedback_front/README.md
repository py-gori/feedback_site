docker image build -t feedback_front .

docker-compose build
docker-compose up -d
docker exec -it feedback_demo sh

$ npm start
