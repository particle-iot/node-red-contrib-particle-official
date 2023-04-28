'use strict';

const Particle = require('particle-api-js');

module.exports = class Api {
	/**
	 * API wrapper constructor
	 *
	 * @param {ParticleConfigNode} auth
	 * @param {Console} logger
	 */
	constructor(auth, logger=console) {
		this._auth = auth;
		this._logger = logger;
		this._defaultExpiresIn = 2147483647;
		this._init();
	}

	/**
	 * Login using the client credentials, store the access token
	 * and set up token refresh before it expires
	 *
	 * @returns {Promise} Login promise
	 */
	login() {
		return this._particle.loginAsClientOwner({}).then((res) => {
			this._logger.log('Authenticated with Particle');
			this._accessToken = res.body.access_token;
			// Reauthenticate before the token expires
			// There is res.body.expires_in property but
			// as setTimeout is using 32 bit int the maximum
			// we can set is 2147483647 (~24 days)
			const expiresIn = Math.min(this._defaultExpiresIn, res.body.expires_in);
			this._expirationTimer = setTimeout(
				this._reauthenticate.bind(this),
				expiresIn
			);

			return this._accessToken;
		});
	}

	/**
	 * Get the EventStream and subscribe to the 'event' event
	 * with onEvent callback
	 *
	 * @param {Function} onEvent
	 * @param {String} options.deviceId
	 * @param {String} options.name
	 * @param {String} options.product
	 * @returns {Promise} Resolves when adding listener succeeded
	 */
	listenToEventStream({ onEvent, deviceId, name, product }) {
		this._lastListenArguments = arguments;
		return this._particle.getEventStream({
			deviceId, name, product, auth: this._accessToken
		}).then((stream) => {
			this._stream = stream;
			this._stream.on('event', onEvent);
			this._stream.on('error', this._reauthenticate.bind(this));
			this._stream.on('end', this._reauthenticate.bind(this));
		});
	}

	/**
	 * Publish a Particle event
	 *
	 * @param {Object} params Event params
	 * @param {String} params.name Event name
	 * @param {String} params.data Event data
	 * @param {String} params.product Event for this product ID or slug
	 * @param {Boolean} params.isPrivate Should the event be publicly available?
	 * @returns {Promise} Resolves when event has been published
	 */
	publishEvent(params) {
		return this._particle.publishEvent(Object.assign({
			auth: this._accessToken
		}, params));
	}

	/**
	 * Get the value of a device variable
	 * @param  {Object} params Options for this API call
	 * @param  {String} params.deviceId Device ID or Name
	 * @param  {String} params.name     Variable name
	 * @param  {String} [params.product] Device in this product ID or slug
	 * @param  {String} params.auth     Access Token
	 * @return {Promise} Resolves when the variable was fetched
	 */
	getVariable(params) {
		return this._particle.getVariable(Object.assign({
			auth: this._accessToken
		}, params))
			.then(response => {
				return response.body.result;
			}, (error) => {
				throw error;
			});
	}

	/**
	 * Call a device function
	 * @param  {Object} options Options for this API call
	 * @param  {String} options.deviceId Device ID or Name
	 * @param  {String} options.name     Function name
	 * @param  {String} options.argument Function argument
	 * @param  {String} [options.product] Device in this product ID or slug
	 * @param  {String} options.auth     Access Token
	 * @return {Promise} Resolves when the function was called
	 */
	callFunction(options) {
		return this._particle.callFunction(Object.assign({
			auth: this._accessToken
		}, options))
			.then(response => {
				return response.body.return_value;
			}, (error) => {
				throw error;
			});
	}

	request(params) {
		return this._particle.request(Object.assign({
			auth: this._accessToken
		}, params));
	}

	/**
	 * Close the stream, remove all timers, listeners etc.
	 */
	cleanup() {
		clearTimeout(this._expirationTimer);

		if (this._stream) {
			this._stream.abort();
		}

		this._particle.deleteCurrentAccessToken({
			auth: this._accessToken
		});
	}

	/**
	 * Instantiate Particle and set the config
	 *
	 * @private
	 */
	_init() {
		this._particle = new Particle({
			clientId: this._auth.clientId,
			clientSecret: this._auth.clientSecret
		});
		this._particle.setContext('tool', {
			name: 'node-red-contrib-particle'
		});
	}

	/**
	 * Callback that fetches a new token and recreates all
	 * event callbacks to prevent data loss.
	 *
	 * @private
	 */
	_reauthenticate() {
		this._logger.log('Reauthenticating...');
		this.cleanup();

		this.login().catch(() => {
			const retryIn = 5;
			this._logger.error(`Failed to reauthenticate. Trying again in ${retryIn} seconds`);
			setTimeout(this._reauthenticate.bind(this), retryIn * 1000);
		});
	}
};
