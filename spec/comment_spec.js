/* global describe, expect, it, beforeEach, afterEach */

'use strict';

var pg = require('../'),
	nock = require('nock');

describe( 'comment', function() {

	var repo, sha, token, scope;
	var defaultUrl = '/repos/defSlug/commits/defSha/comments';

	beforeEach( function() {

		repo = process.env.TRAVIS_REPO_SLUG;
		sha = process.env.COMMIT_SHA;
		token = process.env.GITHUB_TOKEN;
		process.env.TRAVIS_REPO_SLUG = 'defSlug';
		process.env.COMMIT_SHA = 'defSha';
		process.env.GITHUB_TOKEN = 'defToken';

		scope = nock( 'https://api.github.com', { allowUnmocked: false } );

	} );

	afterEach( function() {

		process.env.TRAVIS_REPO_SLUG = repo;
		process.env.COMMIT_SHA = sha;
		process.env.GITHUB_TOKEN = token;

	} );

	it( 'should use environment variables as defaults', function( done ) {

		scope
			.matchHeader( 'Authorization', 'token defToken' )
			.post( defaultUrl )
			.reply( 201, 'ok1' );

		pg.comment( '', undefined, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok1');
				done();
			} );

	} );

	it( 'should use "peanut-gallery" as default user agent', function( done ) {

		scope
			.matchHeader( 'User-Agent', 'peanut-gallery' )
			.post( defaultUrl )
			.reply( 201, 'ok2' );

		pg.comment( '', undefined, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok2');
				done();
			} );

	} );

	it( 'should override environment vars with options', function( done ) {

		var options = {
				repo_slug: 'mySlug',
				commit_sha: 'mySha',
				token: 'myToken'
			};

		scope
			.matchHeader( 'Authorization', 'token ' + options.token )
			.post( '/repos/' + options.repo_slug + '/commits/' + options.commit_sha + '/comments' )
			.reply( 201, 'ok3' );

		pg.comment( '', options, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok3');
				done();
			} );

	} );

	it( 'should use options user-agent if specified', function( done ) {

		var options = {
				user_agent: 'myUserAgent'
			};

		scope
			.matchHeader( 'User-Agent', 'myUserAgent' )
			.post( defaultUrl )
			.reply( 201, 'ok4' );

		pg.comment( '', options, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok4');
				done();
			} );

	} );

	it( 'should populate error callback if an error occurs', function( done ) {

		pg.comment( '', undefined, function( err, val ) {
				expect( err ).not.toBeNull();
				expect( val ).not.toBeDefined();
				done();
			} );

	} );

	it( 'should fail if a non-201 response is received', function( done ) {

		scope
			.post( defaultUrl )
			.reply( 200, 'oh no' );

		pg.comment( '', undefined, function( err, val ) {
				expect( err ).toEqual( { statusCode: 200, body: 'oh no' } );
				expect( val ).not.toBeDefined();
				done();
			} );

	} );

	it( 'should send commit message as body', function( done ) {

		scope
			.post( defaultUrl, { body: 'my message' } )
			.reply( 201 );

		pg.comment( 'my message', undefined, function( err, val ) {
				expect( err ).toBeNull();
				done();
			} );

	} );

	it( 'should pass body along upon success', function( done ) {

		scope
			.post( defaultUrl )
			.reply( 201, { foo: 'bar', this: 2 } );

		pg.comment( '', undefined, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toEqual( { foo: 'bar', this: 2 } );
				done();
			} );

	} );

} );
