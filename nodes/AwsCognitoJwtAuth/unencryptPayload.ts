import { JWK } from 'jwk-to-pem';

interface FetchJwkParameters {
	userPoolId: string;
	awsRegion: string;
}

export async function fetchJwk(
	{ userPoolId, awsRegion }: FetchJwkParameters,
	httpRequest: Function,
): Promise<JWK[]> {
	console.log('Fetching JWKS From Cognito');

	const jwksUrl = `https://cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

	const jwksResponse = await httpRequest({
		url: jwksUrl,
		method: 'GET',
		json: true,
	});

	return jwksResponse.keys;
}
