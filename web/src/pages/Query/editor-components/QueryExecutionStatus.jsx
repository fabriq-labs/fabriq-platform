/* eslint-disable react/forbid-prop-types */
import { includes } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Alert, Button } from 'antd';
import Timer from './timer';



const Wrapper = styled.div`
	display: flex;
	align-items: center;
`;

const FlexFill = styled.div`
	flex: 1;
`;

export default function QueryExecutionStatus({
	status, updatedAt, error, isCancelling, onCancel 
}) {
	const alertType = status === 'failed' ? 'error' : 'info';
	const showTimer = status !== 'failed' && updatedAt;
	const isCancelButtonAvailable = includes(['waiting', 'processing'], status);
	let message = isCancelling ? <>Cancelling&hellip;</> : null;

	switch (status) {
		case 'waiting':
			if (!isCancelling) {
				message = <>Query in queue&hellip;</>;
			}
			break;
		case 'processing':
			if (!isCancelling) {
				message = <>Executing query&hellip;</>;
			}
			break;
		case 'loading-result':
			message = <>Loading results&hellip;</>;
			break;
		case 'failed':
			message = (
				<>
					Error running query: 
					{' '}
					<strong>{error}</strong>
				</>
			);
			break;
        // no default
	}

	return (
		<Alert
			data-test="QueryExecutionStatus"
			type={alertType}
			message={(
				<Wrapper>
					<FlexFill>
						{message} 
						{' '}
						{showTimer && <Timer from={updatedAt} />}
					</FlexFill>
					<div>
						{isCancelButtonAvailable && (
							<Button className="m-l-10" type="primary" size="small" disabled={isCancelling} onClick={onCancel}>
								Cancel
							</Button>
						)}
					</div>
				</Wrapper>
			)}
		/>
	);
}

QueryExecutionStatus.propTypes = {
	status: PropTypes.string,
	updatedAt: PropTypes.any,
	error: PropTypes.string,
	isCancelling: PropTypes.bool,
	onCancel: PropTypes.func,
};

QueryExecutionStatus.defaultProps = {
	status: 'waiting',
	updatedAt: null,
	error: null,
	isCancelling: true,
	onCancel: () => { },
};
