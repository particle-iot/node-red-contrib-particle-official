'use strict';

const helpers = require('../../src/helpers');
const ParticleBaseNode = require('../../src/particle-base-node');

module.exports = (RED) => {
	function ParticleSubscribeNode(node) {
		RED.nodes.createNode(this, node);

		new ParticleBaseNode({
			self: this,
			node: node,
			RED: RED,
			properties: ['name', 'scope', 'device', 'product', 'event'],
			functionName: 'listenToEventStream',
			functionArguments: [
				{ key: 'deviceId', customValue: ({ device, product }) => {
					if (product) {
						return device === '' ? undefined : device;
					} else {
						return device === '' ? 'mine' : device;
					}
				} },
				{ key: 'name', value: 'event' },
				{ key: 'product', value: 'product' },
				{ key: 'onEvent', defaultValue: (data) => {
					helpers.onSuccess({ status: this.status.bind(this), message: 'new event' });

					this.send({
						event: data.name,
						payload: data.data,
						published_at: data.published_at,
						device: data.coreid
					});
				} }
			],
			mandatoryArguments: [],
			runOnLoad: true,
			info: {
				status: 'setting up stream'
			},
			error: {
				status: 'failed to set up stream',
				onRuntime: 'Failed to set up stream'
			}
		});
	}

	RED.nodes.registerType('particle-subscribe', ParticleSubscribeNode);

	RED.httpAdmin.get('/particle/js/subscribe.definition.js', (req, res) => {
		res.sendFile(__dirname + '/subscribe.definition.js');
	});
};
