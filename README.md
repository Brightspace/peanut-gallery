# Peanut Gallery
[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]

Peanut Gallery exposes a simple API which allows you to add comments on a commit in a Github repo.

## Install

```shell
npm install peanut-gallery
```

## Usage

```javascript
var pg = require('peanut-gallery');

pg.comment( 'my comment', options, function( err, response ) {
  console.log( response.url );
} );
```

Options:
- repo_slug: owner/repo, defaults to environment variable `TRAVIS_REPO_SLUG`
- commit_sha: SHA of the commit to comment on, defaults to environment variable `COMMIT_SHA`
- token: [Github personal access token](https://github.com/blog/1509-personal-api-tokens), defaults to environment variable `GITHUB_TOKEN`
- user_agent: used for [Github API calls](https://developer.github.com/v3/#user-agent-required), defaults to "travis-ci"

The `response` parameter passed to your callback will contain the JSON
response from Github's ["create a commit comment"](https://developer.github.com/v3/repos/comments/#create-a-commit-comment)
API.

## Contributing

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[npm-url]: https://npmjs.org/package/peanut-gallery
[npm-image]: https://badge.fury.io/js/peanut-gallery.png
[ci-image]: https://travis-ci.org/Desire2Learn-Valence/peanut-gallery.svg?branch=master
[ci-url]: https://travis-ci.org/Desire2Learn-Valence/peanut-gallery
[coverage-image]: https://coveralls.io/repos/Desire2Learn-Valence/peanut-gallery/badge.png?branch=master
[coverage-url]: https://coveralls.io/r/Desire2Learn-Valence/peanut-gallery?branch=master
