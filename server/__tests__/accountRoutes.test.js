const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

describe('Account Routes', () => {
	test('GET /api/accounts should return a list of accounts', async () => {
		const response = await request(app).get('/api/accounts');
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
	});

	test('POST /api/accounts should create a new account', async () => {
		const newAccount = { name: 'Test Account', balance: 100 };
		const response = await request(app).post('/api/accounts').send(newAccount);
		expect(response.statusCode).toBe(201);
		expect(response.body.name).toBe(newAccount.name);
		expect(response.body.balance).toBe(newAccount.balance);
	});
});