'use strict';

const Api = require('./api');
const _ = require('lodash');
const helpers = require('./helpers');

class ParticleBaseNode {
	constructor({ self, node, RED, properties, functionName, functionArguments, mandatoryArguments, onAPIResponse, onAPIError, inputProperties, runOnLoad, success, error, info }) {
		this.self = self;
		this.node = node;
		this.RED = RED;
		this.message = null;
		this.variables = {};
		this.functionName = functionName;
		this.functionArguments = functionArguments;
		this.mandatoryArguments = mandatoryArguments;
		this.inputProperties = inputProperties;
		this.onAPIResponse = onAPIResponse;
		this.onAPIError = onAPIError;
		this.runOnLoad = runOnLoad || node.runOnLoad;
		this.success = success || node.success;
		this.error = error;
		this.info = info || {};

		properties.forEach(field => {
			this.variables[field] = node[field];
		});

		this.auth = this.RED.nodes.getNode(node.auth);

		if (this.auth) {
			this.api = new Api(this.auth);
		} else if (node.testAuth) {
			this.api = new Api(node.testAuth);
		}

		this.run();
	}

	hasMandatoryArguments(args = [], params = {}) {
		let ok = true;

		args.forEach(arg => {
			if (!params[arg]) {
				ok = false;

				this.self.error(`Missing the ${arg} parameter`);
			}
		});

		return ok;
	}

	parametersFromVariables(variables, functionArguments) {
		let params = {};
		let ok = true;

		functionArguments.forEach(argument => {
			let value = null;

			if (argument.defaultValue) {
				value = argument.defaultValue;
			}

			if (argument.value && variables[argument.value]) {
				value = variables[argument.value];
			}

			if (argument.customValue) {
				value = argument.customValue(variables);
			}

			if (argument.format === 'object' && typeof value !== 'object') {
				try {
					value = JSON.parse(value);

					if (typeof value !== 'object') {
						throw 'Argument not a valid JSON object';
					}
				} catch (e) {
					if (this.error.onConfig) {
						this.self.error(this.error.onConfig);
					}

					ok = false;
				}
			}

			if (argument.prefix && value) {
				value = `${argument.prefix}${value}`;
			}

			params[argument.key] = value;
		});

		return ok ? params : null;
	}

	successStatus(message = 'OK') {
		return helpers.onSuccess({ status: this.self.status.bind(this.self), message });
	}

	errorStatus(message = 'NOT OK') {
		return helpers.onError({ status: this.self.status.bind(this.self), message });
	}

	infoStatus(message = 'processing') {
		return helpers.onInfo({ status: this.self.status.bind(this.self), message });
	}

	hideStatus() {
		return helpers.resetStatus({ status: this.self.status.bind(this.self), timeout: 0 });
	}

	makeAPIRequest() {
		const parameters = this.parametersFromVariables(this.variables, this.functionArguments);

		if (!parameters) {
			return null;
		}

		const hasMandatoryArguments = this.hasMandatoryArguments(this.mandatoryArguments, parameters);

		if (!hasMandatoryArguments) {
			return null;
		}

		this.infoStatus(this.info.status);

		this.api[this.functionName](parameters)
			.then(result => {
				this.hideStatus();

				if (this.success && this.success.status) {
					this.successStatus(this.success.status);
				}

				if (this.onAPIResponse) {
					return this.onAPIResponse(this.variables, this.message, result);
				} else if (this.success && this.success.fields) {
					const fields = this.success.fields;
					let message = this.message || {};

					fields.forEach(field => {
						if (field.path) {
							message[field.key] = _.get(result, field.path);
						} else if (field.value) {
							message[field.key] = this.variables[field.value];
						} else if (field.key === 'payload') {
							message.payload = result;
						}
					});

					return this.self.send(message);
				} else {
					return true;
				}
			}, (error) => {
				this.hideStatus();

				if (this.error && this.error.status) {
					this.errorStatus(this.error.status);
				}

				if (this.onAPIError) {
					return this.onAPIError(error);
				}

				if (this.error && this.error.onRuntime) {
					this.self.error(`${this.error.onRuntime} (${error})`, this.message || {});
				}

				return false;
			});
	}

	onClose() {
		this.api.cleanup();
	}

	mergePropertiesFromMsg(variables, inputProperties, msg) {
		let _var = Object.assign({}, variables);
		const data = msg;

		if (data) {
			inputProperties.forEach(field => {
				if (data[field] /* && !_var[field] */) {
					_var[field] = data[field];
				}
			});
		}

		return _var;
	}

	onInput(msg) {
		if (msg) {
			this.message = msg;
		}

		this.variables = this.mergePropertiesFromMsg(this.variables, this.inputProperties, msg);

		this.makeAPIRequest();
	}

	run() {
		if (!this.api) {
			return null;
		}

		this.api.login()
			.then(() => {
				this.self.on('input', this.onInput.bind(this));
				this.self.on('close', this.onClose.bind(this));

				if (this.runOnLoad) {
					this.makeAPIRequest();
				}
			});
	}
}

module.exports = ParticleBaseNode;
