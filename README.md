# Achieva SWMS Middleware

## Description

This is a template for a Express.js server. It runs on Node.js with [ECMAScript modules](https://nodejs.org/api/esm.html).

It contains the following main features:

1. Debugging and notification of errors/events - `@sentry/node`
1. Logging unique IDs per request - `express-http-context` and `nanoid`
1. Minor improvements to security - `helmet`
1. Rate limiting - `rate-limiter-flexible` and `ioredis`
1. Serve static files (e.g. images or API documentation) - `serve-static`
1. Logging of request body/response - `morgan-body`
1. Log file management - `winston` and `winston-daily-rotate-file`
1. Request validation - `express-validator`
1. API documentation - [`apidoc`](https://apidocjs.com/)
1. ESLint for checking any issues with the code - `npm run lint`

Feel free to remove any unnecessary libraries if not required.

## Installation

1. Install [Node.js](https://nodejs.org/en/download/)
1. Install node packages in `src` directory `npm install`
1. Install [Redis](https://redis.io/docs/getting-started/). You can use [WSL](https://docs.microsoft.com/en-us/windows/wsl/install) to run it on Windows 10+.

## Preparing .env

A `.env` file should be prepared and placed in the `/src/` directory of the project. Below is a sample `.env` file that you can use.

```
# Application
NODE_ENV=development
PORT=2022

# Docker
CONTAINER_IMAGE=express-server-template
API_DOMAIN=example.domain
```

## Running the service

1. Run local redis instance `redis-server`
1. Run the service `npm run start`

## Updating API documentation

1. Install [`apidoc`](https://github.com/apidoc/apidoc#installation)
1. Run script `npm run doc`
