'use strict';

module.exports = (RED) => {
	function ParticleConfigNode(n) {
		RED.nodes.createNode(this, n);
		this.clientId = n.clientId;
		this.clientSecret = n.clientSecret;
	}

	RED.nodes.registerType('particle-config', ParticleConfigNode);

};
