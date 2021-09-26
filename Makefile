commitHash := $(shell git rev-parse --short HEAD)
branchName := $(shell git rev-parse --abbrev-ref HEAD)
tagName := $(shell git describe --tags)


default: cleanbuild


frontend/dist: $(wildcard frontend/src/**)
	cd frontend && yarn build

backend/dist: $(wildcard backend/src/**)
	cd backend && yarn build


push: backend/dist
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

clean: frontend/dist backend/dist
	rm -rv backend/dist frontend/dist

build: backend/dist frontend/dist
	docker build . -t kruemmelspalter/betterschuman:$(commitHash)

cleanbuild: build clean

cleanpush: push clean

cleandeploy: deploy clean
