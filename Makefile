commitHash := $(shell git rev-parse --short HEAD)
branchName := $(shell git rev-parse --abbrev-ref HEAD)
tagName := $(shell git describe --tags)

cleanbuild: build clean

build: $(wildcard backend/**) backend/static
	docker build . -t kruemmelspalter/betterschuman:$(commitHash)

backend/static: $(wildcard frontend/**)
	mkdir -pv backend/static
	cd frontend && yarn build
	cp -rv frontend/dist/* backend/static

push: build
	docker push kruemmelspalter/betterschuman:$(commitHash)
	docker tag kruemmelspalter/betterschuman:$(commitHash) kruemmelspalter/betterschuman:$(branchName)
	docker push kruemmelspalter/betterschuman:$(branchName)
ifeq "$(branchName)" "main"
	docker tag kruemmelspalter/betterschuman:$(commitHash) kruemmelspalter/betterschuman:latest
	docker push kruemmelspalter/betterschuman:latest
endif
ifneq "$(tagName)" ""
	docker tag kruemmelspalter/betterschuman:$(commitHash) kruemmelspalter/betterschuman:$(tagName)
	docker push kruemmelspalter/betterschuman:$(tagName)
	docker tag kruemmelspalter/betterschuman:$(commitHash) kruemmelspalter/betterschuman:stable
	docker push kruemmelspalter/betterschuman:stable
endif

clean: backend/static
	rm -rv backend/static frontend/dist

cleanpush: push clean

deploy: build
	docker-compose up -d

cleandeploy: deploy clean
