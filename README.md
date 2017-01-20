# express-react-redux

[![Build Status](https://travis-ci.org/dai-shi/express-react-redux.svg?branch=master)](https://travis-ci.org/dai-shi/express-react-redux)

Express middleware for React/Redux applications

## Motivation

TO BE WRITTEN

## What is this

This is simple express middleware that provides a default webpack config.
It provides some functionalities by default:

- babel (es2015+es2016+es2017+stage3)
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
