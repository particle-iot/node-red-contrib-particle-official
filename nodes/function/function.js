'use strict';

const ParticleBaseNode = require('../../src/particle-base-node');

module.exports = (RED) => {
	function ParticleFunctionNode(node) {
		RED.nodes.createNode(this, node);

		new ParticleBaseNode({
			self: this,
			node: node,
			RED: RED,
			properties: ['name', 'scope', 'device', 'product', 'function', 'argument'],
			inputProperties: ['device', 'function', 'argument'],
			functionName: 'callFunction',
			functionArguments: [
				{ key: 'deviceId', value: 'device' },
				{ key: 'name', value: 'function' },
				{ key: 'argument', value: 'argument' },
				{ key: 'product', value: 'product' }
			],
			mandatoryArguments: ['deviceId', 'name'],
			success: {
				fields: [
					{ key: 'payload' },
					{ key: 'function', value: 'function' },
					{ key: 'device', value: 'device' }
				],
				status: 'called'
			},
			info: {
				status: 'calling'
			},
			error: {
				status: 'failed',
				onRuntime: 'Failed to call function'
			}
		});
	}

	RED.nodes.registerType('particle-function', ParticleFunctionNode);

};
