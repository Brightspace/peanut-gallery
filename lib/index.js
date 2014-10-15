'use strict';

var request = require('request');

module.exports = { comment: comment };

function opt( options, name, defaultValue ) {
	return options && options[name] !== undefined ?
		options[name] : defaultValue;
}

function comment( value, options, cb ) {

	var repo_slug = opt( options, 'repo_slug', process.env.TRAVIS_REPO_SLUG );
	var commit_sha = opt( options, 'commit_sha', process.env.COMMIT_SHA );
	var token = opt( options, 'token', process.env.GITHUB_TOKEN );
	var userAgent = opt( options, 'user_agent', 'travis-ci' );

	var githubUrl = 'https://api.github.com/repos/' + repo_slug + '/commits/' +
		commit_sha + '/comments';

	var requestOptions = {
			url: githubUrl,
			headers: {
				'Authorization': 'token ' + token,
				'User-Agent': userAgent
			},
			json: { 'body': value }
		};

	function handleResponse( error, response, body ) {

		if( error ) {
			return cb( error );
		}

		if( response.statusCode !== 201 ) {
			return cb( {
					statusCode: response.statusCode,
					body: body
				} );
		}

		cb( null, body );

	}

	request.post( requestOptions, handleResponse );

}
