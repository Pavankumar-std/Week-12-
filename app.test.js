const request=require('supertest');
const app=require('../src/app');
describe('API',()=>{
 test('health endpoint',async()=>{const r=await request(app).get('/api/health');expect(r.status).toBe(200);expect(r.body.status).toBe('ok')});
 test('rejects empty caption',async()=>{const r=await request(app).post('/api/posts/validate').send({caption:' '});expect(r.status).toBe(400)});
 test('accepts valid caption',async()=>{const r=await request(app).post('/api/posts/validate').send({caption:'Hello'});expect(r.status).toBe(200);expect(r.body.valid).toBe(true)});
});
