[![build and deploy](https://github.com/Erelas-Organization/Bot207/actions/workflows/deploy.yml/badge.svg)](https://github.com/Erelas-Organization/Bot207/actions/workflows/deploy.yml)

## Requirements
- Node v16+
- Typescript 4+

## Setup
- Clone the project: `git clone git@github.com:Erelas-Organization/Bot207.git`
- Create an .env file:
```
TOKEN=YOURBOTTOKEN
CLIENT_ID=YOURCLIENTID
PREFIX=!
MONGO_URI=YOUR MONGO CONNECTION STRING
MONGO_DATABASE_NAME=YOUR DATABASE NAME
GENIUS_API_KEY=GENIUS API KEY, FOR LYRCIS FETCHING
```
- Open a terminal and install dependencies: `npm install`
- Run the bot using: `npm run dev`
- Invite your bot normally

## Deployment
- Pushes and merges into the main branch will be auto deployed using actions

## Notes
- Husky hooks are setup to enforce commit rules. Commits have to start with `add, remove, cut, fix, bump, make, start, stop, refactor, reformat, optimise, document, merge`
