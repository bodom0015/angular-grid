#!/bin/sh

docker build -t ng-grid .

docker run --name=ng-grid -it -d -v `pwd`/demo.html:/usr/share/nginx/html/demo.html -v `pwd`/angular-grid.js:/usr/share/nginx/html/angular-grid.js -p 8080:80 ng-grid

if [[ "$1" == "-d" ]]; then
	docker run --name=cloud9-nodejs -it -d -v `pwd`:/workspace -w /workspace -p 8089:80 ndslabs/cloud9-nodejs
fi
