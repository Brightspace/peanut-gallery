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

### CLI

```bash
$ peanut-gallery --help
Usage: bin/peanut-gallery [options] <message>

Options:
  -r, --repo         Specify the repository slug
  -c, --commit       Specify the commit to comment on
  -t, --token        Specify a GitHub authorization token
  -p, --pullrequest  Comment on the pull request instead of the commit
  -h, --help         Show help                                         [boolean]
```

Peanut Gallery can be run directly from a script/terminal. It will follow the
same defaults as the API described below. If `message` is provided, it will be
used as the message body - otherwise a message will be read from stdin.

#### Example

`peanut-gallery -r Brightspace/peanut-gallery -c db0f0ad2ad40165086539365b68533bbca455616 -t "${GH_TOKEN}" "Looks Great!"`

### API

```javascript
var pg = require('peanut-gallery');

pg.comment( 'my comment', options, function( err, response ) {
  console.log( response.url );
} );
```

Options:
- repo_slug: owner/repo, defaults to environment variable `TRAVIS_REPO_SLUG`
- commit_hash: hash of the commit to comment on, defaults to environment variable `TRAVIS_COMMIT`
- token: [Github personal access token](https://github.com/blog/1509-personal-api-tokens), defaults to environment variable `GITHUB_TOKEN`
- user_agent: used for [Github API calls](https://developer.github.com/v3/#user-agent-required), defaults to "travis-ci"
- comment_on_pull_request: comment on pull request instead of commit, defaults to `false`

The `response` parameter passed to your callback will contain the JSON
response from Github's ["create a commit comment"](https://developer.github.com/v3/repos/comments/#create-a-commit-comment)
API.

## Contributing

### Code Style

This repository is configured with [EditorConfig](http://editorconfig.org) rules and
contributions should make use of them.

[npm-url]: https://npmjs.org/package/peanut-gallery
[npm-image]: https://badge.fury.io/js/peanut-gallery.png
[ci-image]: https://travis-ci.org/Brightspace/peanut-gallery.svg?branch=master
[ci-url]: https://travis-ci.org/Brightspace/peanut-gallery
[coverage-image]: https://coveralls.io/repos/Brightspace/peanut-gallery/badge.png?branch=master
[coverage-url]: https://coveralls.io/r/Brightspace/peanut-gallery?branch=master
