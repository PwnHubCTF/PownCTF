# Pwnme CTF Framework

## Setup

### With docker (prod)

- Create a .env file, from .env.example
- Start the project with `docker-compose up -d` /!\ TODO /!\ 

### From source (dev)

- Create a .env file, from .env.example
- Create a local database (based on .env file)
- Start the frontend `cd front; npm i; npm run dev`
- Start API `cd api; npm i; npm run start:dev`