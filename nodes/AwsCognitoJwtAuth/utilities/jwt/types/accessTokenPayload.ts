export interface AccessTokenPayload<GroupType = string> {
	auth_time: number;
	client_id: string;
	'cognito:groups': GroupType[];
	event_id: string;
	exp: number;
	iat: number;
	iss: string;
	jti: string;
	scope: string;
	sub: string;
	token_use: string;
	username: string;
	version: number;
}
