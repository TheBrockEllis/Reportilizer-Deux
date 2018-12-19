## docker-compose
Note that all `docker-compose` commands rely on the `docker-compose.yml` file and can only be run from the root directory of this repository.

### stop/start
Stopped containers maintain their state. This is equivalent to using CTRL+C to exit `docker-compose up`.
```
docker-compose stop
```

Restart stopped containers:
```
docker-compose start
```

### exec
Connect to the web container with bash.
```
docker-compose exec web bash
```

### logs
View logs for all containers (helpful if running in detached mode).
```
docker-compose logs -f
```

### down
Completely remove the containers.
```
docker-compose down
```

### up
Launch as a background process by using the `-d` flag for "detached" mode.
```
docker-compose up -d
```

Force rebuilding of images from Dockerfiles.
```
docker-compose up --build
```
