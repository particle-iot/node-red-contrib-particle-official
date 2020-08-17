'use strict';

if (typeof window !== 'undefined' && !window.helpers) {

	const generateFieldScopeSelector = () => {
		return `
			<div class="form-row form-row-radio">
					<label for="node-input-scope"><i class="im im-scope-icon"></i> <span>Scope</span></label>
					<label class="radio">
					<input type="radio" name="node-input-scope-options" id="node-input-scope-user" value="user">
					User
					</label>
					<label class="radio">
					<input type="radio" name="node-input-scope-options" id="node-input-scope-product" value="product">
					Product
					</label>
					<input type="hidden" id="node-input-scope">
			</div>
			<div class="form-row hidden" id="particle-scope-product">
					<label for="node-input-scope"><i class="im im-product-icon"></i> <span>Product</span></label>
					<input type="text" id="node-input-product" placeholder="Product slug or ID">
			</div>
		`;
	};

	const generateFieldSelect = (field) => {
		let html = `
			<div class="form-row">
					<label for="node-input-${field.name}"><i class="${field.icon}"></i> ${field.title}</label>

					<select id="node-input-${field.name}">
		`;

		field.values.forEach(val => {
			if (val.value === field.defaultValue) {
				html += `<option value="${val.value}" selected>${val.title}</option>`;
			} else {
				html += `<option value="${val.value}">${val.title}</option>`;
			}
		});

		html += `
				</select>
			</div>
		`;

		return html;
	};

	const generateField = (field) => {
		let html = '';

		if (field.type === 'scope-selector') {
			html = generateFieldScopeSelector(field);
		} else if (field.type === 'select') {
			html = generateFieldSelect(field);
		} else {
			html = `
				<div class="form-row">
						<label for="node-input-${field.name}"><i class="${field.icon}"></i> ${field.title}</label>
						<input type="${field.type === 'object' ? 'text' : field.type}" id="node-input-${field.name}" placeholder="${field.placeholder}">
				</div>
			`;
		}

		return html;
	};

	const generateEditTemplate = ({ name, fields }) => {
		let html = '';

		fields.forEach(field => {
			html += generateField(field);
		});

		$(`script[data-template-name="${name}"]`).html(html);
	};

	const generateDocumentation = ({ name, title, inputs, outputs, details, resources }) => {
		let html = `
					<p>${title}</p>
			`;

		if (inputs) {
			html += `
				<h3>Inputs</h3>
				<dl class="message-properties">
			`;

			inputs.forEach(input => {
				html += `
								<dt class="${input.optional ? 'optional' : ''}">${input.name} <span class="property-type">${input.type}</span></dt>
								<dd>${input.description}</dd>
						`;
			});
		}

		html += `
					</dl>
		`;

		if (outputs) {
			html += `
						<h3>Outputs</h3>
						<dl class="message-properties">
			`;

			outputs.forEach(output => {
				html += `
								<dt>${output.name} <span class="property-type">${output.type}</span></dt>
								<dd>${output.description}</dd>
						`;
			});


			html += `
						</dl>
			`;
		}

		html += `
					</dl>
					<h3>Details</h3>
					<p>${details}</p>
					<h3>Resources</h3>
					<ul>
		`;



		resources.forEach(resource => {
			html += `
							<li>
									<a href="${resource.link}">${resource.name}</a> - ${resource.description}
							</li>
					`;
		});

		html += '</ul>';

		$(`script[data-help-name="${name}"]`).html(html);
	};

	const generateClientConfig = (config) => {
		let nodeClient = Object.assign({}, config, {
			category: 'particle',
			color: '#C0DEED'
		});

		if (config._scopeSelector === true) {
			nodeClient.onScopeChange = function onscopechange() {
				let stream = $('input[name=node-input-scope-options]:checked').val() || 'user';

				if (stream === 'product') {
					$('#particle-scope-product').removeClass('hidden');
				} else {
					$('#particle-scope-product').addClass('hidden');
					$('#node-input-product').val('');
				}

				$('#node-input-stream').val(stream);
			};

			nodeClient.oneditprepare = function oneditprepare() {
				$('input[name=node-input-scope-options]')
					.prop('checked', null)
					.change(nodeClient.onScopeChange.bind(this));

				const isProduct = $('#node-input-product').val();

				if (isProduct) {
					$('#node-input-scope-product').prop('checked', true);
				} else {
					$('#node-input-scope-user').prop('checked', true);
				}

				nodeClient.onScopeChange();
			};

			nodeClient.oneditsave = function oneditsave() {
				nodeClient.onScopeChange();
			};
		}

		return nodeClient;
	};

	const addCSS = () => {
		$('body').append(`
			<link rel="stylesheet" href="https://s3.amazonaws.com/icomoon.io/49057/Dashboard/style.css?r41hg3">
			<style>
					.form-row input[type="radio"] {
							width: auto !important;
					}

					.form-row label i.fa {
							width: 14px;
					}

					.form-row-radio {
							padding-top: 9px;
					}
			</style>
		`);
	};

	const generateNodeFromDefinition = (name, definition) => {
		generateEditTemplate(definition.editTemplate);
		generateDocumentation(definition.documentation);
		addCSS();

		RED.nodes.registerType(name, generateClientConfig(definition.client));
	};

	/*global window*/
	window.helpers = {
		generateEditTemplate,
		generateDocumentation,
		generateClientConfig,
		generateNodeFromDefinition
	};

}