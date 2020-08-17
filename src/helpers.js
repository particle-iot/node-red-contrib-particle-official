'use strict';

const resetStatus = ({ status, timeout = 0 }) => {
	setTimeout(() => {
		status({});
	}, timeout);
};

const onSuccess = ({ status, message }) => {
	status({ fill: 'green', shape: 'dot', text: message });

	resetStatus({
		status,
		timeout: 1000
	});
};

const onInfo = ({ status, message }) => {
	status({ fill: 'blue', shape: 'dot', text: message });
};

const onError = ({ status, message }) => {
	status({ fill: 'red', shape: 'ring', text: message });
};

module.exports = {
	onSuccess,
	onInfo,
	onError,
	resetStatus
};
