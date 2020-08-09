import React from 'react';
import Modal from 'react-native-modal';

const supportedOrientations = [
    'portrait',
    'portrait-upside-down',
    'landscape',
    'landscape-left',
    'landscape-right',
];

const CommonModal = (props) => {

	function closeModal() {
		if (props.closeModal) {
				props.closeModal(false);
		}
	}

	return (
		<Modal
			{...props.customProps}
			accessibilityLabel="CommonModal_286_1"
			transparent
			onRequestClose={closeModal}
			supportedOrientations={supportedOrientations}
		>
			{props.children}
		</Modal>
	);

};


export default CommonModal;
