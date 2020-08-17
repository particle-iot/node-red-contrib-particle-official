'use strict';

const ParticleBaseNode = require('../../src/particle-base-node');

module.exports = (RED) => {
	function ParticleAPINode(node) {
		RED.nodes.createNode(this, node);

		new ParticleBaseNode({
			self: this,
			node: node,
			RED: RED,
			properties: ['name', 'method', 'url', 'payload'],
			inputProperties: ['method', 'url', 'payload'],
			functionName: 'request',
			functionArguments: [
				{ key: 'uri', value: 'url', prefix: 'https://api.particle.io/', customValue: ({ url }) => {
					if (url[0] === '/') {
						url = url.substring(1);
					}

					return url;
				} },
				{ key: 'method', value: 'method' },
				{ key: 'data', value: 'payload', format: 'object' }
			],
			mandatoryArguments: ['uri', 'method'],
			success: {
				fields: [
					{ key: 'payload', path: 'body' },
					{ key: 'statusCode', path: 'statusCode' }
				],
				status: 'got response'
			},
			info: {
				status: 'requesting'
			},
			error: {
				status: 'failed',
				onRuntime: 'Failed to call endpoint',
				onConfig: 'Configuration error'
			}
		});
	}

	RED.nodes.registerType('particle-api', ParticleAPINode);

};
