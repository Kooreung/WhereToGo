# react project build
cd ../../teamProject501/frontend
npm run build

# index.html, main.js 복사(이동) : dist -> static
cd ../../teamProject501/backend
rm -rf src/main/resources/static
mv ../../teamProject501/frontend/dist src/main/resources/static
mkdir src/main/resources/static/src
mkdir src/main/resources/static/src/assets
cp -r ../frontend/src/assets/* src/main/resources/static/src/assets/

# spring project build
./gradlew bootJar

# build image
docker build -t kooreung/wheretogo .

# push image
docker push kooreung/wheretogo

# remote 에서

# 컨테이너 멈추고
ssh -i src/main/resources/secret/keykooreung.pem ubuntu@43.201.95.101 'docker stop wheretogo'
# 컨테이너 삭제
ssh -i src/main/resources/secret/keykooreung.pem ubuntu@43.201.95.101 'docker rm wheretogo'
# pull image
ssh -i src/main/resources/secret/keykooreung.pem ubuntu@43.201.95.101 'docker pull kooreung/wheretogo'
# 컨테이너 실행
ssh -i src/main/resources/secret/keykooreung.pem ubuntu@43.201.95.101 'docker run -d -p 8080:8080 --restart always --name wheretogo kooreung/wheretogo'
# 불필요한 이미지 삭제
ssh -i src/main/resources/secret/keykooreung.pem ubuntu@43.201.95.101 'docker image prune -f'