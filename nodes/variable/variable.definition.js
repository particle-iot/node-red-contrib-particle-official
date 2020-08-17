'use strict';

const variableEditTemplate = {
	name: 'particle-variable',
	fields: [
		{ name: 'name', icon: 'icon-tag', title: 'Name', placeholder: 'Name', type: 'text' },
		{ name: 'auth', icon: 'fa fa-user', title: 'Auth', placeholder: 'Auth', type: 'text' },
		{ name: 'variable', icon: 'im im-speech-bubble-icon', title: 'Variable', placeholder: 'Variable name', type: 'text' },
		{ name: 'device', icon: 'im im-devices-icon', title: 'Device', placeholder: 'Device name or ID', type: 'text' },
		{ type: 'scope-selector' }
	]
};

const variableDocumentation = {
	name: 'particle-variable',
	title: 'Retrieve a cloud variable from a Particle device',
	inputs: [
		{ name: 'variable', type: 'string', description: 'If not configured in node properties, this optional property sets the variable name to retrieve', optional: true },
		{ name: 'device', type: 'string', description: 'If not configured in node properties, this optional property sets the device name or ID for which to retrieve the variable', optional: true }
	],
	outputs: [
		{ name: 'payload', type: 'string', description: 'The value of the variable retrieved from the device' },
		{ name: 'variable', type: 'string', description: 'The name of the variable that was retrieved from the device' },
		{ name: 'device', type: 'string', description: 'The name or ID of the device that was queried' }
	],
	details: `
		<p>Cloud variables allow you to read the value of a sensor or check device state remotely. They are defined in application firmware using <code>Particle.variable()</code>.</p>
		<p>This node is intended to be placed in the middle of a flow to retrieve a cloud variable from a Particle device.</p>
		<p>Scope the query to a device either owned by your <b>user</b> account or a device in a <b>product</b> fleet.
		If querying a device in a product, providing the product slug or ID is required.</p>
		<p>You may set the variable name to retrieve and the targeted device either as part of node properties, or by passing <code>msg.variable</code> or <code>msg.device</code> as an input to this node, respectively.</p>
		<p>When the variable value is fetched, it will be appended to to the outbound <code>msg</code> object as <code>msg.payload</code>.
		The variable name and the device name/ID will also be appended to the outbound <code>msg</code> as <code>msg.variable</code> and <code>msg.device</code>, respectively.</p>
	`,
	resources: [
		{ name: 'Particle.variable() docs', link: 'https://docs.particle.io/reference/firmware/#particle-variable-', description: 'Describes how to define cloud variables in application firmware' }
	]
};

const variableClient = {
	defaults: {
		name: { value: '' },
		auth: { type: 'particle-config', required: true },
		variable: {},
		scope: { value: 'user', required: true },
		device: {},
		product: {},
		refresh: {}
	},
	inputs: 1,
	outputs: 1,
	icon: 'particle.png',
	align: 'left',
	paletteLabel: function () {
		return 'variable';
	},
	label: function label() {
		if (this.name) {
			return this.name;
		}

		if (this.variable) {
			return `variable ${this.variable}`;
		}

		return variableClient.paletteLabel();
	},
	_scopeSelector: true
};

/*global window*/
window.variableNodeDefinition = {
	editTemplate:variableEditTemplate,
	documentation:variableDocumentation,
	client:variableClient
};
