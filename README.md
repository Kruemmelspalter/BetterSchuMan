# BetterSchuMan
An alternative (and hopefully better) interface for the German school website Schulmanager Online (https://schulmanager-online.de).
It provides a simplified API at `/api` and a Web User Interface at `/`.

## Installation
### Docker 
#### Docker Compose

```yml
version: '3'

services:
  betterschuman:
    image: kruemmelspalter/betterschuman:release
    ports:
      - "8080:80"
    # Only uncomment for an always running server
    # restart: unless-stopped
```
This makes the web UI accessible at `http://localhost:8080`
#### Docker CLI
```sh
docker run -p 8080:80 -d kruemmelspalter/betterschuman
```
### Building from source
```sh
make cleanbuild
```
this makes a docker image available as `kruemmelspalter/betterschuman`.
