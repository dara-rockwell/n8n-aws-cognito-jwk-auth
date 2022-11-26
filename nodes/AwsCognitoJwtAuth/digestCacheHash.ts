import crypto from 'crypto';

export function digestCacheHash(userPoolId: string, awsRegion: string): string {
	const cacheString = JSON.stringify({ userPoolId, awsRegion });
	const cacheHash = crypto.createHash('sha256').update(cacheString).digest('base64');
	return cacheHash;
}
