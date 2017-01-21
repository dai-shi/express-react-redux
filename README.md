# express-react-redux

[![Build Status](https://travis-ci.org/dai-shi/express-react-redux.svg?branch=master)](https://travis-ci.org/dai-shi/express-react-redux)
[![npm](https://img.shields.io/npm/v/express-react-redux.svg)](https://www.npmjs.com/package/express-react-redux)

Express middleware for React/Redux applications

## Motivation

For beginners, building a development environment for a React/Redux app
is a time-consuming task, while they want to start to coding an app.
To this end, there are various packages that support building React/Redux apps.
However, I wasn't able to find one that fulfills my requirements:

- It's provided as a library not as a tool nor a boilerplate.
- It can be used not only for learning but for production.
- It's not a blackbox, but can be used for learning how it works.
- It should be customizable if you learn enough.

Hence, I decided to create yet another pakcage for the same purpose.
This package is express middleware with the assumption that server
logic is implemented in express and express provides APIs to the client app.
Let's call it an Express/React/Redux app.

## What is this

This is simple express middleware that comes with
a default opinionated webpack config.
It provides some functionalities by default:

- babel transformation (es2015+es2016+es2017+stage3)
- TODO: hot module replacement
- TODO: server side rendering 

## How to use

create an app folder:

```
mkdir sample-app
cd sample-app
npm init
```

install packages:

```
npm install express express-react-redux --save
```

import a template app:

```
$(npm bin)/express-react-redux import tiny-todos
```

run a dev server:

```
PORT=3000 npm start
```

build and run a production server:

```
npm run build
PORT=3000 NODE_ENV=production npm start
```

## Similar Projects

- https://github.com/insin/nwb
- https://github.com/petehunt/rwb
- https://github.com/facebookincubator/create-react-app                             
