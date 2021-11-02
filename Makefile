commitHash := $(shell git rev-parse --short HEAD)
branchName := $(shell git rev-parse --abbrev-ref HEAD)
tagName := $(shell git describe --tags)


default: build

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

deploy: build
	docker tag kruemmelspalter/betterschuman:$(commitHash) kruemmelspalter/betterschuman:latest
	docker-compose up -d

tests: $(wildcard backend/test/**) $(wildcard backend/**)
	cd backend && npm run test && npm run test:cov

build:
	docker build . -t kruemmelspalter/betterschuman:$(commitHash)
