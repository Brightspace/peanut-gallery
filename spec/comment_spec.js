/* global describe, expect, it, beforeEach, afterEach */

'use strict';

var pg = require('../'),
	nock = require('nock'),
	request = require('request'),
	sinon = require('sinon');

describe( 'comment', function() {

	var repo, hash, token, scope, pull_request, branch;
	var defaultUrl = '/repos/defSlug/commits/defHash/comments';

	beforeEach( function() {

		repo = process.env.TRAVIS_REPO_SLUG;
		hash = process.env.TRAVIS_COMMIT;
		token = process.env.GITHUB_TOKEN;
		pull_request = process.env.TRAVIS_PULL_REQUEST;
		branch = process.env.TRAVIS_BRANCH;

		process.env.TRAVIS_REPO_SLUG = 'defSlug';
		process.env.TRAVIS_COMMIT = 'defHash';
		process.env.GITHUB_TOKEN = 'defToken';
		process.env.TRAVIS_PULL_REQUEST = 'false';
		process.env.TRAVIS_BRANCH = 'master';

		scope = nock( 'https://api.github.com', { allowUnmocked: false } );

	} );

	afterEach( function() {

		process.env.TRAVIS_REPO_SLUG = repo;
		process.env.TRAVIS_COMMIT = hash;
		process.env.GITHUB_TOKEN = token;
		process.env.TRAVIS_PULL_REQUEST = pull_request;
		process.env.TRAVIS_BRANCH = branch;

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
				commit_hash: 'myHash',
				token: 'myToken'
			};

		scope
			.matchHeader( 'Authorization', 'token ' + options.token )
			.post( '/repos/' + options.repo_slug + '/commits/' + options.commit_hash + '/comments' )
			.reply( 201, 'ok5' );

		pg.comment( '', options, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok5');
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
			.reply( 201, 'ok6' );

		pg.comment( '', options, function( err, val ) {
				expect( err ).toBeNull();
				expect( val ).toBe('ok6');
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

	it( 'should not be posted on a pull request when specified not to comment on pull requests', function() {

		process.env.TRAVIS_PULL_REQUEST = '7';

		var options = {
			pull_request: false
		};

		var requestSpy = sinon.spy(request, 'post');

		pg.comment( '', options, function() { } );

		sinon.assert.notCalled( requestSpy );
		requestSpy.restore();

	} );

	it( 'should not be posted on a pull request when branch is not on master', function() {

		process.env.TRAVIS_BRANCH = 'notMaster';

		var options = {
			pull_request: false
		};

		var requestSpy = sinon.spy(request, 'post');

		pg.comment( '', options, function() { } );

		sinon.assert.notCalled( requestSpy );
		requestSpy.restore();

	} );

	it( 'should be posted on a pull request when specified to comment on pull requests', function( done ) {

		process.env.TRAVIS_PULL_REQUEST = '8';

		var options = {
			pull_request: true
		};

		var requestSpy = sinon.spy(request, 'post');

		pg.comment( '', options, function( ) {
			done();
		} );

		sinon.assert.calledOnce( requestSpy );
		requestSpy.restore();

	} );

	it( 'should be posted on master branch by default', function( done ) {

		process.env.TRAVIS_BRANCH = 'testAlternateMaster';

		var requestSpy = sinon.spy(request, 'post');

		var options = {
			master_branch: 'testAlternateMaster'
		};

		pg.comment( '', options, function( ) {
			done();
		} );

		sinon.assert.calledOnce( requestSpy );
		requestSpy.restore();

	} );

	it( 'should be posted on a master by even if it should not on a pull request', function( done ) {
		var requestSpy = sinon.spy(request, 'post');

		var options = {
			pull_request: false
		};

		pg.comment( '', options, function( ) {
			done();
		} );

		sinon.assert.calledOnce( requestSpy );
		requestSpy.restore();

	} );
} );
