export interface accessTokenPayload<GroupType = string> {
	at_hash: string;
	sub: string;
	'cognito:groups': GroupType[];
	email_verified: true;
	iss: string;
	'cognito:username': string;
	aud: string;
	token_use: string;
	auth_time: number;
	exp: number;
	iat: number;
	jti: string;
	email: string;
}
