import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';
import { extractUserFromJwt } from './checkJwt';
import { fetchJwk } from './unencryptPayload';
import { JWK } from 'jwk-to-pem';
import { digestCacheHash } from './digestCacheHash';
import { description } from './description';

export class AwsCognitoJwtAuth implements INodeType {
	description = description;

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const userPoolId = this.getNodeParameter('userPoolId', 0) as string;
		const awsRegion = this.getNodeParameter('awsRegion', 0) as string;
		const ignoreExpiration = this.getNodeParameter('ignoreExpiration', 0) as boolean;
		const accessToken: string = this.getNodeParameter('accessToken', 0, '') as string;

		const staticData = this.getWorkflowStaticData('node');

		const cacheHash = digestCacheHash(userPoolId, awsRegion);
		const shouldFetchJwks = staticData.cacheHash !== cacheHash;

		console.log({ cacheHash, old: staticData.cacheHash, shouldFetchJwks });

		staticData.jwks = shouldFetchJwks
			? await fetchJwk({ awsRegion, userPoolId }, this.helpers.httpRequest)
			: staticData.jwks;

		const jwks = staticData.jwks as JWK[];

		try {
			const {
				json: { body: body },
			} = this.getInputData(0)[0];

			const user = extractUserFromJwt({
				accessToken,
				jwks,
				ignoreExpiration,
			});

			staticData.cacheHash = cacheHash;

			return this.prepareOutputData([{ json: { user, body } }], 0);
		} catch (error) {
			return this.prepareOutputData(
				[
					{
						json: {},
						error: new NodeOperationError(this.getNode(), error),
					},
				],
				1,
			);
		}
	}
}
