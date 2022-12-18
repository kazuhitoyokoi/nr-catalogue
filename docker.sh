echo FROM nodered/node-red > Dockerfile
echo RUN npm install $1 >> Dockerfile
docker build -t tmp .
if [ $? -eq 0 ]; then
    echo $1 | sed -r "s/@[^@]+$//" | xargs -I{} jq '.modules|.[]|select(.id=="{}")' catalogue.json > $1.tmp
fi
docker rmi tmp
