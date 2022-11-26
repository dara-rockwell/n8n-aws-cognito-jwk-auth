import { verifyJWT } from './verifyJWT';
import jwk from './fixtures/cognito.authenticationToken.jwk.json';
import { AccessTokenPayload } from './types/accessTokenPayload';

describe('Validate Javascript Web Token', () => {
	describe('With Valid Token', () => {
		it('returns the decoded payload', () => {
			const payload = verifyJWT({
				token:
					'eyJraWQiOiI3Uk82TmtSR0ZnZTE3OHB4Y0RuQTlsRmNjSmZGYlwvQktBZVhVejV2dG5VRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTNjNjAwNi1mMDI0LTRkMjEtOWYwOC1iNmIzMWE1ODg5NDYiLCJjb2duaXRvOmdyb3VwcyI6WyJNYW5hZ2VycyJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9oNEdLWWE0b2QiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIyYnRwNm9pNWdyOHVzM2FlaGg1YzMwczhvbSIsImV2ZW50X2lkIjoiZTM5NjY2NGItMWE2Yy00NjY5LTg1YWItMjk5NDM0MGMxZjc0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2NjUxMjI4MjAsImV4cCI6MTY2NTIwOTIyMCwiaWF0IjoxNjY1MTIyODIwLCJqdGkiOiJkYWUwZmE3OC0wNzMwLTRlYTAtOWU5Yy1lMDVhNTMzZTg3Y2IiLCJ1c2VybmFtZSI6ImRhcmEifQ.LKJIwA28BAJ0GScl15OpZmcVHdQmQbb73qkbhC-UuPn2s1TmaEkiryOK2H2Qccj5LeMYmLqP6A9GAgwvWGCoVEplhKvimDB0cBMH9LcgPZhZl4Xv8BMUANrgaGjShr05iXkOOWh3URuSLQ4b7jQda-gsjiSJ0C9uDmARmzjZB_pziM4ecPWq30fByb-R9-UvjGQgTnZ0C6VyZ9fKXG00GKUZn8iC9EwM8BBqISbJfsevGHj3ShiNfC1NGHD930jmScbLjwX3sEszVswvU60byuFQ1Z1VY81FqE1CtJ9WEPekqscBoLOxn8f5sTSeDqwj1JNGtSSS8K_X7C1FetIm_A',
				key: {
					e: jwk.e,
					n: jwk.n,
					kty: 'RSA',
				},
				ignoreExpiration: true,
			});

			const expectedPayload: AccessTokenPayload = {
				auth_time: 1665122820,
				client_id: '2btp6oi5gr8us3aehh5c30s8om',
				'cognito:groups': ['Managers'],
				event_id: 'e396664b-1a6c-4669-85ab-2994340c1f74',
				exp: 1665209220,
				iat: 1665122820,
				iss: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_h4GKYa4od',
				jti: 'dae0fa78-0730-4ea0-9e9c-e05a533e87cb',
				scope: 'openid',
				sub: '113c6006-f024-4d21-9f08-b6b31a588946',
				token_use: 'access',
				username: 'dara',
				version: 2,
			};

			expect(payload).toEqual(expectedPayload);
		});
	});

	describe('With Invalid Signature', () => {
		it('throws an invalid signature error', () => {
			expect(() => {
				verifyJWT({
					token:
						'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ',
					key: {
						e: jwk.e,
						n: jwk.n,
						kty: 'RSA',
					},
					ignoreExpiration: true,
				});
			}).toThrowError('invalid signature');
		});
	});

	describe('When Not Ignoring Expired Token', () => {
		it('throws a jwt expired error', () => {
			expect(() => {
				verifyJWT({
					token:
						'eyJraWQiOiI3Uk82TmtSR0ZnZTE3OHB4Y0RuQTlsRmNjSmZGYlwvQktBZVhVejV2dG5VRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTNjNjAwNi1mMDI0LTRkMjEtOWYwOC1iNmIzMWE1ODg5NDYiLCJjb2duaXRvOmdyb3VwcyI6WyJNYW5hZ2VycyJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9oNEdLWWE0b2QiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiIyYnRwNm9pNWdyOHVzM2FlaGg1YzMwczhvbSIsImV2ZW50X2lkIjoiZTM5NjY2NGItMWE2Yy00NjY5LTg1YWItMjk5NDM0MGMxZjc0IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJvcGVuaWQiLCJhdXRoX3RpbWUiOjE2NjUxMjI4MjAsImV4cCI6MTY2NTIwOTIyMCwiaWF0IjoxNjY1MTIyODIwLCJqdGkiOiJkYWUwZmE3OC0wNzMwLTRlYTAtOWU5Yy1lMDVhNTMzZTg3Y2IiLCJ1c2VybmFtZSI6ImRhcmEifQ.LKJIwA28BAJ0GScl15OpZmcVHdQmQbb73qkbhC-UuPn2s1TmaEkiryOK2H2Qccj5LeMYmLqP6A9GAgwvWGCoVEplhKvimDB0cBMH9LcgPZhZl4Xv8BMUANrgaGjShr05iXkOOWh3URuSLQ4b7jQda-gsjiSJ0C9uDmARmzjZB_pziM4ecPWq30fByb-R9-UvjGQgTnZ0C6VyZ9fKXG00GKUZn8iC9EwM8BBqISbJfsevGHj3ShiNfC1NGHD930jmScbLjwX3sEszVswvU60byuFQ1Z1VY81FqE1CtJ9WEPekqscBoLOxn8f5sTSeDqwj1JNGtSSS8K_X7C1FetIm_A',
					key: {
						e: jwk.e,
						n: jwk.n,
						kty: 'RSA',
					},
				});
			}).toThrowError('jwt expired');
		});
	});
});
