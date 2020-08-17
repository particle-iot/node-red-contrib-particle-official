'use strict';

const publishEditTemplate = {
	name: 'particle-publish',
	fields: [
		{ name: 'name', icon: 'icon-tag', title: 'Name', placeholder: 'Name', type: 'text' },
		{ name: 'auth', icon: 'fa fa-user', title: 'Auth', placeholder: 'Auth', type: 'text' },
		{ name: 'event', icon: 'im im-speech-bubble-icon', title: 'Event', placeholder: 'Event name', type: 'text' },
		{ type: 'scope-selector' }
	]
};

const publishDocumentation = {
	name: 'particle-publish',
	title: 'Publish a Particle event from a flow',
	inputs: [
		{ name: 'event', type: 'string', description: 'If not configured in the node, this optional property sets the name of the event to publish', optional: true },
		{ name: 'payload', type: 'string', description: 'The data payload that will be sent along with the published Particle event', optional: true }
	],
	details: `
		<p>Publishing Particle events allow you to send messages through the Device Coud onto subscribers like Particle devices.</p>
		<p>This node is intended to be placed at the end of a flow to publish a Particle event under certain conditions.</p>
		<p>Scope the publish either to a <b>user</b> or <b>product</b> event stream. Choosing the user stream will publish the event to devices owned by the authenticated user. Choosing the product stream will publish the event to devices associated with the product fleet.
		If publishing to a product event stream, providing the product slug or ID is required.
		</p>
		<p>You may set the event name to publish either as part of node properties, or by passing <code>msg.event</code> as an input to this node</p>
		<p>If you would like to send a data payload along with the event, pass <code>msg.payload</code> as an input to this node.</p>
	`,
	resources: [
		{ name: 'Particle.subscribe() docs', link: 'https://docs.particle.io/reference/firmware/#particle-subscribe-', description: 'Describes how listen for events published by this node in device firmware' },
		{ name: 'Event stream API docs', link: 'https://docs.particle.io/reference/api/#events', description: 'Learn more about the event stream that integrates with this node' }
	]
};

const publishClient = {
	defaults: {
		name: { value: '' },
		auth: { type: 'particle-config', required: true },
		scope: { value: 'user', required: true },
		product: {},
		event: {}
	},
	inputs: 1,
	outputs: 0,
	icon: 'particle.png',
	align: 'right',
	paletteLabel: function () {
		return 'publish';
	},
	label: function label() {
		if (this.name) {
			return this.name;
		}

		if (this.event) {
			return 'publish "' + this.event + '" event';
		}

		return publishClient.paletteLabel();
	},
	_scopeSelector: true
};

/*global window*/
window.publishNodeDefinition = {
	editTemplate:publishEditTemplate,
	documentation:publishDocumentation,
	client:publishClient
};
