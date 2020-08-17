'use strict';

const subscribeEditTemplate = {
	name: 'particle-subscribe',
	fields: [
		{ name: 'name', icon: 'icon-tag', title: 'Name', placeholder: 'Name', type: 'text' },
		{ name: 'auth', icon: 'fa fa-user', title: 'Auth', placeholder: 'Auth', type: 'text' },
		{ name: 'event', icon: 'im im-speech-bubble-icon', title: 'Event', placeholder: 'Event name', type: 'text' },
		{ name: 'device', icon: 'im im-devices-icon', title: 'Device', placeholder: 'Device name or ID', type: 'text' },
		{ type: 'scope-selector' }
	]
};

const subscribeDocumentation = {
	name: 'particle-subscribe',
	title: 'Subscribe to Particle events',
	outputs: [
		{ name: 'event', type: 'string', description: 'The name of the Particle event' },
		{ name: 'payload', type: 'string', description: 'The data payload sent along with the Particle event' },
		{ name: 'published_at', type: 'string', description: 'The timestamp of when the Particle event was sent' },
		{ name: 'device', type: 'string', description: 'The ID of the device that published the event' }
	],
	details: `
		<p>Subscribing to Particle events allows you to listen for events from Device Cloud publishers like Particle devices.</p>
		<p>This node is intended to be placed at the beginning of flows to trigger business logic based on an emitted Particle event.</p>
		<p>Scope the publish either to a <b>user</b> or <b>product</b> event stream. Choosing the user stream will publish the event to devices owned by the authenticated user. Choosing the product stream will publish the event to devices associated with the product fleet.
		If publishing to a product event stream, providing the product slug or ID is required.
		</p>
		<p>Optionally, you may filter the event stream to certain <b>event names</b> and/or by <b>device</b>.
		Note that event filtering uses <i>prefix matching</i>, meaning that all events starting with the provided event name will be injected into the flow.
		For device filtering, you can pass either a device ID or name.
		</p>
  `,
	resources: [
		{ name: 'Particle.subscribe() docs', link: 'https://docs.particle.io/reference/firmware/#particle-subscribe-', description: 'Describes how listen for events published by this node in device firmware' },
		{ name: 'Event stream API docs', link: 'https://docs.particle.io/reference/api/#events', description: 'Learn more about the event stream that integrates with this node' }
	]
};

const subscribeClient = {
	defaults: {
		name: { value: '' },
		auth: { type: 'particle-config', required: true },
		scope: { value: 'user', required: true },
		product: {},
		event: {},
		device: {}
	},
	inputs: 0,
	outputs: 1,
	icon: 'particle.png',
	paletteLabel: function () {
		return 'subscribe';
	},
	label: function label() {
		if (this.name) {
			return this.name;
		}
		if (this.event) {
			return 'subscribe to "' + this.event + '"';
		}
		return subscribeClient.paletteLabel();
	},
	_scopeSelector: true
};

const subscribeDefinition = {
	name: 'subscribe',
	nodeName: 'particle-subscribe',
	editTemplate:subscribeEditTemplate,
	documentation:subscribeDocumentation,
	client:subscribeClient
};

if (typeof window !== 'undefined') {
	/*global window*/
	window.subscribeNodeDefinition = subscribeDefinition;
}

if (typeof module !== 'undefined') {
	module.exports = subscribeDefinition;
}
