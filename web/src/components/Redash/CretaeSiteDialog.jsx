import React, {
	useState, useMemo, useRef, useCallback 
} from 'react';
import { Modal, Alert } from "antd";
import { wrap as wrapDialog, DialogPropType } from './DialogWrapper';
import DynamicForm from './DynamicForm';

function CreateSiteDialog({ dialog }) {
	const [error, setError] = useState(null);
	const formRef = useRef();

	const createUser = useCallback(() => {
		if (formRef.current) {
			formRef.current.validateFieldsAndScroll((err, values) => {
				if (!err) {
					dialog.close(values).catch(setError);
				}
			});
		}
	}, [dialog]);

	const formFields = useMemo(() => {
		const common = { required: true, props: { onPressEnter: createUser } };
		return [
			{
				...common, name: 'name', title: 'Site Name', type: 'text', autoFocus: true 
			},
			{
				...common, name: 'host_name', title: 'Host Name', type: 'text' 
			},
		];
	}, [createUser]);

	return (
		<Modal {...dialog.props} title="Create a New Site" okText="Create" onOk={createUser}>
			<DynamicForm fields={formFields} ref={formRef} hideSubmitButton />
			{error && <Alert message={error.message} type="error" showIcon />}
		</Modal>
	);
}

CreateSiteDialog.propTypes = {
	dialog: DialogPropType.isRequired,
};

export default wrapDialog(CreateSiteDialog);
