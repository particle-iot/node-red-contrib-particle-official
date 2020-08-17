'use strict';
/* eslint-disable indent */
const apiEditTemplate = {
	name: 'particle-api',
	fields: [
		{ name: 'name', icon: 'icon-tag', title: 'Name', placeholder: 'Name', type: 'text' },
		{ name: 'auth', icon: 'fa fa-user', title: 'Auth', placeholder: 'Auth', type: 'text' },
		{ name: 'method', icon: 'fa fa-tasks', title: 'Method', type: 'select',
				values: [
					{ title: 'GET', value: 'get' },
					{ title: 'HEAD', value: 'head' },
					{ title: 'POST', value: 'post' },
					{ title: 'PUT', value: 'put' },
					{ title: 'DELETE', value: 'DELETE' }
				],
				defaultValue: 'get'
		},
		{ name: 'url', icon: 'fa fa-globe', title: 'URL', placeholder: 'https://api.particle.io/[url]', type: 'text' }
	]
};
/* eslint-enable indent */
const apiDocumentation = {
	name: 'particle-api',
	title: 'Sends HTTP requests to the Particle API and returns the response.',
	inputs: [
		{ name: 'url', type: 'string', description: 'If not configured in node properties, this optional property sets the part of the URL <b>after the Particle API base path</b> <code>https://api.particle.io/</code> for the request', optional: true },
		{ name: 'method', type: 'string', description: 'If not configured in node properties, this optional property sets the HTTP method of the request. Must be one of <code>GET</code>, <code>HEAD</code>, <code>POST</code>, <code>PUT</code>, or <code>DELETE</code>', optional: true },
		{ name: 'payload', type: 'object', description: 'The JSON payload that will be sent as the body of the request', optional: true }
	],
	outputs: [
		{ name: 'payload', type: 'string', description: 'The JSON body returned from the Particle API' },
		{ name: 'statusCode', type: 'string', description: 'The HTTP status code returned from the Particle API' }
	],
	details: `
		<p>The Particle API allows you to interact remotely with the Device Cloud via a RESTful interface.</p>
		<p>This node is intended to be placed in the middle of a flow to make an HTTP request to the Particle API.</p>
		<p>You may set the URL and HTTP method of the request either as part of node properties, or by passing <code>msg.url</code> or <code>msg.method</code> as an input to this node, respectively.</p>
		<p>Note that <code>url</code> will be automatically prefixed with the Particle API base path, <code>https://api.particle.io</code>. Your url should begin with the API version (<code>v1/</code>) and continue based on the endpoint you are targeting.</p>
		<p>If you would like to send a JSON payload as the body of the request, pass <code>msg.payload</code> as an input to this node.</p>
	`,
	resources: [
		{ name: 'API reference docs', link: 'https://docs.particle.io/reference/api/', description: 'Learn more about the available REST endpoints of the Particle API' }
	]
};

const apiClient = {
	defaults: {
		name: { value: '' },
		auth: { type: 'particle-config', required: true },
		method: { value: 'get' },
		url: {},
		payload: {}
	},
	inputs: 1,
	outputs: 1,
	icon: 'particle.png',
	align: 'left',
	paletteLabel: function() {
		return 'particle api';
	},
	label: function label() {
		if (this.name) {
			return this.name;
		}

		if (this.method && this.url) {
			return `${this.method.toUpperCase()} ${this.url}`;
		} else if (this.url) {
			return `api ${this.url}`;
		}

		return apiClient.paletteLabel();
	}
};

/*global window*/
window.APINodeDefinition = {
	editTemplate:apiEditTemplate,
	documentation:apiDocumentation,
	client:apiClient
};
