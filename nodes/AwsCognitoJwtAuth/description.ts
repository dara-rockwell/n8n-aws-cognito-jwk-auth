/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { INodeTypeDescription } from 'n8n-workflow';

export const description: INodeTypeDescription = {
	displayName: 'AWS Cognito JWT Auth',
	name: 'awsCognitoJwtAuth',
	icon: 'file:aws-cognito.svg',
	group: ['transform'],
	version: 1,
	description: 'Validate AWS Cognito Auth JWTs',
	defaults: {
		name: 'AWS Cognito JWT Auth',
	},
	inputs: ['main'],
	// eslint-disable-next-line n8n-nodes-base/node-class-description-outputs-wrong
	outputs: ['main', 'main'],
	outputNames: ['valid', 'invalid'],
	properties: [
		{
			displayName: 'Cognito Region',
			name: 'awsRegion',
			type: 'string',
			default: 'us-east-1',
			required: true,
			placeholder: 'us-east-1',
			description: 'AWS Region For Cognito',
		},
		{
			displayName: 'Cognito User Pool ID',
			name: 'userPoolId',
			type: 'string',
			required: true,
			default: '',
			placeholder: '',
			description: 'AWS Cognito User Pool ID',
		},
		{
			displayName: 'Cognito Access Token',
			name: 'accessToken',
			type: 'string',
			required: true,
			default: '={{$json["headers"]["authorization"]}}',
			description:
				'Property that holds the JWT for the Cognito Access Token. Likely the `authorization` header from a Webhook Event.',
		},
		{
			displayName: 'Ignore JWT Expiration?',
			name: 'ignoreExpiration',
			type: 'boolean',
			required: true,
			default: false,
			description: 'Whether the JWT Expiration should be ignored or not',
		},
	],
};
