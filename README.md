# Pwnme CTF Framework

## Setup

### With docker (prod)

- Create a .env file, from .env.example
- Start the project with `docker-compose up -d` /!\ WIP /!\ 

### From source (dev)

- Create a .env file, from .env.example `cp .env.example .env`
- Create a local database (based on .env file) => with docker compose, you can use `docker compose up -f docker-compose-db.yml -d`
- Start the frontend `cd front; npm i; npm run dev`
- Start API `cd api; npm i; npm run start:dev`