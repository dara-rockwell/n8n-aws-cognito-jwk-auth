import { JWK } from 'jwk-to-pem';
import { User } from './types/user';
import { AccessTokenPayload } from './utilities/jwt/types/accessTokenPayload';
import { verifyJWT } from './utilities/jwt/verifyJWT';

export interface ExtractUserFromJwtParameters {
	accessToken: string;
	jwks: JWK[];
	ignoreExpiration: boolean;
}

export function extractUserFromJwt({
	accessToken,
	jwks,
	ignoreExpiration,
}: ExtractUserFromJwtParameters): User {
	console.log({ accessToken });

	const payload = verifyJWT<AccessTokenPayload>({
		token: accessToken,
		key: jwks[1],
		ignoreExpiration,
	});

	const user: User = {
		username: payload.username,
		groups: payload['cognito:groups'],
	};

	return user;
}
