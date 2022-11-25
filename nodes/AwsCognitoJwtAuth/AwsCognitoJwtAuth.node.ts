import { JWK } from 'jwk-to-pem';
import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import { AccessTokenPayload } from '../../utilities/jwt/types/accessTokenPayload';
import verifyJWT, { JWTVerification } from '../../utilities/jwt/verifyJWT';

export class AwsCognitoJwtAuth implements INodeType {
	description: INodeTypeDescription = {
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
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
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
				displayName: 'JWT Data',
				name: 'jwtData',
				type: 'string',
				required: true,
				default: '={{$json["headers"]["authorization"]}}',
				description:
					'Property that holds the JWT Data. Likely the `Authorization` Header from the first item of a Webhook Event.',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		try {
			const userPoolId = this.getNodeParameter('userPoolId', 0) as string;
			const awsRegion = this.getNodeParameter('awsRegion', 0) as string;
			const ignoreExpiration = this.getNodeParameter('ignoreExpiration', 0) as boolean;

			const staticData = this.getWorkflowStaticData('node');

			if (!staticData.jwks) {
				const jwksUrl = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

				const jwksResponse = await this.helpers.httpRequest({
					url: jwksUrl,
					method: 'GET',
					json: true,
				});

				staticData.jwks = jwksResponse.keys as JWK[];
			}

			const jwks = staticData.jwks as JWK[];

			const jwtData: string = this.getNodeParameter('jwtData', 0, '') as string;

			console.log({ jwtData });

			const verification: JWTVerification = {
				token: jwtData,
				key: jwks[1],
				ignoreExpiration,
			};

			const payload: AccessTokenPayload = verifyJWT(verification);

			console.log({ payload });

			return this.prepareOutputData([{ json: { payload } }]);
		} catch (error) {
			if (error.context) {
				// If the error thrown already contains the context property,
				// only append the itemIndex
				throw error;
			}

			throw new NodeOperationError(this.getNode(), error);
		}
	}
}
