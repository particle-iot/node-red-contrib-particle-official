'use strict';

const ParticleBaseNode = require('../../src/particle-base-node');

module.exports = (RED) => {
	function ParticlePublishNode(node) {
		RED.nodes.createNode(this, node);

		new ParticleBaseNode({
			self: this,
			node: node,
			RED: RED,
			properties: ['name', 'scope', 'product', 'event', 'payload'],
			inputProperties: ['event', 'payload'],
			functionName: 'publishEvent',
			functionArguments: [
				{ key: 'name', value: 'event' },
				{ key: 'product', value: 'product' },
				{ key: 'data', value: 'payload' },
				{ key: 'isPrivate', defaultValue: true }
			],
			mandatoryArguments: ['name'],
			success: {
				status: 'published'
			},
			info: {
				status: 'publishing'
			},
			error: {
				status: 'failed',
				onRuntime: 'Failed to publish event'
			}
		});
	}

	RED.nodes.registerType('particle-publish', ParticlePublishNode);

};
