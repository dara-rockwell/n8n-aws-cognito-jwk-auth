import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

export interface JWTVerification {
	token: string;
	key: jwkToPem.JWK;
	ignoreExpiration?: boolean;
}

export function verifyJWT<TokenPayloadType>(verification: JWTVerification): TokenPayloadType {
	const { token, key, ignoreExpiration } = verification;

	const pem = jwkToPem(key);

	const decoded = jwt.verify(token, pem, {
		ignoreExpiration,
	}) as TokenPayloadType;

	return decoded;
}
