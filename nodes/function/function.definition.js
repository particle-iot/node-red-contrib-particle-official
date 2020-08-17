'use strict';

const functionEditTemplate = {
	name: 'particle-function',
	fields: [
		{ name: 'name', icon: 'icon-tag', title: 'Name', placeholder: 'Name', type: 'text' },
		{ name: 'auth', icon: 'fa fa-user', title: 'Auth', placeholder: 'Auth', type: 'text' },
		{ name: 'function', icon: 'im im-speech-bubble-icon', title: 'Function', placeholder: 'Function name', type: 'text' },
		{ name: 'argument', icon: 'im im-speech-bubble-icon', title: 'Argument', placeholder: 'Function argument', type: 'text' },
		{ name: 'device', icon: 'im im-devices-icon', title: 'Device', placeholder: 'Device name or ID', type: 'text' },
		{ type: 'scope-selector' }
	]
};

const functionDocumentation = {
	name: 'particle-function',
	title: 'Call a cloud function on a Particle device',
	inputs: [
		{ name: 'function', type: 'string', description: 'If not configured in node properties, this optional property sets the function name to call', optional: true },
		{ name: 'argument', type: 'string', description: 'If not configured in node properties, this optional property sets the argument to pass to the device when calling the cloud function', optional: true },
		{ name: 'device', type: 'string', description: 'If not configured in the node, this property sets the device name or ID for which to call the function', optional: true }
	],
	outputs: [
		{ name: 'payload', type: 'string', description: 'The result of the called function from the device' },
		{ name: 'function', type: 'string', description: 'The name of the function that was called' },
		{ name: 'device', type: 'string', description: 'The name or ID of the device that was queried' }
	],
	details: `
		<p>Cloud functions allow you to tell a device to take an action remotely. They are defined in application firmware using <code>Particle.function()</code>.</p>
		<p>This node is intended to be placed in the middle of a flow to call a cloud function on a Particle device.</p>
		<p>Scope the function call to a device either owned by your <b>user</b> account or a device in a <b>product</b> fleet.
		If calling a function on a device in a product, providing the product slug or ID is required.</p>
		<p>You may set the function name to call, the argument to pass, and the targeted device either as part of node properties, or by passing <code>msg.function</code>, <code>msg.argument</code>, or <code>msg.device</code> as an input to this node, respectively.</p>
		<p>When the function is called, the result will be appended to to the outbound <code>msg</code> object as <code>msg.payload</code>.
		The function name and the device name/ID will also be appended to the outbound <code>msg</code> as <code>msg.function</code> and <code>msg.device</code>, respectively.</p>
	`,
	resources: [
		{ name: 'Particle.function() docs', link: 'https://docs.particle.io/reference/firmware/#particle-function-', description: 'Describes how to define cloud functions in application firmware' }
	]
};

const functionClient = {
	defaults: {
		name: { value: '' },
		auth: { type: 'particle-config', required: true },
		function: {},
		argument: {},
		scope: { value: 'user', required: true },
		device: {},
		product: {},
		refresh: {}
	},
	inputs: 1,
	outputs: 1,
	icon: 'particle.png',
	align: 'left',
	paletteLabel: function() {
		return 'function';
	},
	label: function label() {
		if (this.name) {
			return this.name;
		}

		if (this.function) {
			return `function ${this.function}`;
		}

		return functionClient.paletteLabel();
	},
	_scopeSelector: true
};

/*global window*/
window.functionNodeDefinition = {
	editTemplate:functionEditTemplate,
	documentation:functionDocumentation,
	client:functionClient
};
