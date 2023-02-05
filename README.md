# Pwnme CTF Framework

## Setup

### With docker (prod)

- Create a .env file, from .env.example
- Start the project with `docker-compose up -d`

### From source (dev)

- Create a .env file, from .env.example `cp .env.example .env`
- Create a local database (based on .env file) => with docker compose, you can use `docker compose -f docker-compose-db.yml up -d`
- Start the frontend `cd front; npm i; npm run dev`
- Start API `cd api; npm i; npm run dev`

# Repository github

## Link the github repository

Go to `Admin => Config`, in `Github` part

You need to specify a `repo_url`, like `github.com/user/ctf_v3`
If the repo is private, you need a token, linked to your github account in order to fetch the repo

Generate a token:
- go to `https://github.com/settings/tokens`
- Generate new token (classic)
- Check `repo` permission
- Generate token

Populate `access_token` with this token

# Challenge configuration

- Add a file `config.yaml` at the root of the challenge

Configuration example

```yml
id: id-of-challenge # Not required, but usefull for challenge dependencies
name: Xored # Display name
category: crypto # Choice in web | crypto | pwn | reverse | forensic | osint | stegano | misc | prog. If you set a random value, like 'my custom category', it will juste display it on front end without a category icon
flag: PWNME{je-suis-un-flag} # The flag to validate the challenge
sign_flag: false # If this variable is set to true, the flag will be signed for each user. Your challenge must use an env var named "FLAG" to set the challenge flag
author: eteck # Author of the challenge. Not required
instance: false # Choice in false | single | multiple.
difficulty: 1 # Choice in 0 | 1 | 2 | 3 | 4
files: # The files accessible to the players. Not required
  - flag-encrypted.txt
  - encrypt.py
```

- Add a file `description.md` with the description of the challenge

## Signed flag

To use this feature, your challenge need to:
- Be a `multiple` instance
- Use an env var `FLAG` to set the challenge flag

## Instances

A challenge can use the `instance` feature if it need to be deployed.
Instances challenges need to have a working docker-compose.yml

### Single instance

A single instance can be deployed by the administrator, and will be used by all the players

### Multiple instance

Multiple instances are deployed by the player, when he need it.

## Exemple of a complex configuration

In this exemple, we're going to setup a multiple instance challenge, with signed flag

`config.yaml`

```yaml
id: multiple_and_signed
name: Example
category: crypto
flag: PWNME{futur_signed_flag}
sign_flag: true
author: eteck
instance: multiple
difficulty: 4  
files:
  - hint.txt
```

`docker-compose.yml`

```yml
version: "3.3"
services:
  guid:
    restart: always
    ports:
      - 4000
    environment:
      - FLAG=${FLAG}
```

- There is only one port binded
- The flag is set to `${FLAG}`. This env var will be populate for each users