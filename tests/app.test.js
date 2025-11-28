const request = require('supertest');
const express = require('express');

const app = express();
app.get('/cicdtest', (req, res) => {
  res.send('Hello, World!');
});

describe('GET /cicdtest', () => {
  it('should return Hello, World!', async () => {
    const res = await request(app).get('/cicdtest');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Hello, World!');
  });
});