commitHash := $(shell git rev-parse --short HEAD)
branchName := $(shell git rev-parse --abbrev-ref HEAD)
tagName := $(shell git describe --tags)


default: cleanbuild


backend/static: $(wildcard frontend/**)
	mkdir -pv backend/static
	cd frontend && yarn build
	cp -rv frontend/dist/* backend/static

build: $(wildcard backend/**) backend/static
	docker build . -t kruemmelspalter/betterschuman:$(commitHash)

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
	docker-compose up -d

tests: $(wildcard backend/test/**) $(wildcard backend/**)
	cd backend && npm run test


clean: backend/static
	rm -rv backend/static frontend/dist


cleanbuild: build clean

cleanpush: push clean

cleandeploy: deploy clean
