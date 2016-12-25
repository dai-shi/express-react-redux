# express-react-redux

[![Build Status](https://travis-ci.org/dai-shi/express-react-redux.svg?branch=master)](https://travis-ci.org/dai-shi/express-react-redux)

Express middleware for React/Redux applications

## What this is

This is simple express middleware that provides a default webpack config.
It provides some functionalities by default:

- babel (es2015+stage3)
- hot module replacement
- server side rendering  

## How to use

create an app folder:

```
mkdir sample-app
cd sample-app
```

install packages:

```
npm install express react react-dom express-react-redux --save
```

import a template app:

```
$(npm bin)/express-react-redux create tiny-todos
```

## Similar Projects

- https://github.com/insin/nwb
- https://github.com/petehunt/rwb
- https://github.com/facebookincubator/create-react-app                             
