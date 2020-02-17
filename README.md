# JoseZambudioBernabeu.com

Personal website.


## Development

- Build:
```
docker-compose up -d --force-recreate --build
```

- Install dependency:
```
docker-compose run --rm josezambudiobernabeu yarn add {PACKAGE}
```

- ReactJS:
```
docker-compose exec josezambudiobernabeu yarn start
docker-compose exec josezambudiobernabeu yarn build
docker-compose exec josezambudiobernabeu yarn test
docker-compose exec josezambudiobernabeu yarn eject
```

## Production

Build && Deploy it's done with github actions + firebase hosting.