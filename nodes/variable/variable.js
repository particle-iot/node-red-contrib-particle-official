'use strict';

const ParticleBaseNode = require('../../src/particle-base-node');

module.exports = (RED) => {
	function ParticleVariableNode(node) {
		RED.nodes.createNode(this, node);

		new ParticleBaseNode({
			self: this,
			node: node,
			RED: RED,
			properties: ['name', 'scope', 'device', 'product', 'variable'],
			inputProperties: ['device', 'variable'],
			functionName: 'getVariable',
			functionArguments: [
				{ key: 'deviceId', value: 'device' },
				{ key: 'name', value: 'variable' },
				{ key: 'product', value: 'product' }
			],
			mandatoryArguments: ['deviceId', 'name'],
			success: {
				fields: [
					{ key: 'payload' },
					{ key: 'variable', value: 'variable' },
					{ key: 'device', value: 'device' }
				],
				status: 'fetched'
			},
			info: {
				status: 'fetching'
			},
			error: {
				status: 'failed',
				onRuntime: 'Failed to fetch varaible'
			}
		});
	}

	RED.nodes.registerType('particle-variable', ParticleVariableNode);

	RED.httpAdmin.get('/particle/js/variable.definition.js', (req, res) => {
		res.sendFile(__dirname + '/variable.definition.js');
	});

	RED.httpAdmin.get('/particle/js/variable.client.js', (req, res) => {
		res.sendFile(__dirname + '/variable.client.js');
	});
};
