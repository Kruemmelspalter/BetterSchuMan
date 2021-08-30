
cleanbuild: build clean

build: $(wildcard backend/**) backend/static
	docker build . -t kruemmelspalter/betterschuman:latest

backend/static: $(wildcard frontend/**)
	mkdir -pv backend/static
	cd frontend && yarn build
	cp -rv frontend/dist/* backend/static

push: build
	docker push kruemmelspalter/betterschuman:latest

clean: backend/static
	rm -rv backend/static frontend/dist

cleanpush: push clean

deploy: build
	docker-compose up -d

cleandeploy: deploy clean
