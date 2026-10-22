process.env.NODE_ENV = 'test';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../server.js';
import { initializeDatabase, getPool } from '../config/db.js';

let server;
let baseUrl;
let isDbConnected = false;

before(async () => {
  isDbConnected = await initializeDatabase();
  if (!isDbConnected) {
    console.warn('⚠️ MongoDB không thể kết nối. Các bài test phụ thuộc DB sẽ được bỏ qua an toàn.');
  }

  // Start ephemeral server on random port for testing
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (isDbConnected) {
    try {
      const pool = await getPool();
      if (pool) {
        await pool.close();
      }
    } catch {
      // Ignore
    }
  }
});

describe('AutoPremium API Test Suite', () => {
  test('GET /api/health should return status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.service, 'AutoPremium API');
  });

  test('GET /api/cars should return list of cars', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const res = await fetch(`${baseUrl}/api/cars`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
  });

  test('GET /api/cars/:id should return single car details', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const res = await fetch(`${baseUrl}/api/cars/1`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.id, 1);
    assert.ok(body.data.specs);
  });

  test('POST /api/auth/login with valid admin should succeed', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.user.username, 'admin');
    assert.equal(body.user.role, 'admin');
    assert.equal(body.user.password, undefined);
  });

  test('POST /api/auth/login with invalid password should fail with 401', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
  });

  test('POST /api/bookings should register a test drive appointment', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const newBooking = {
      carId: 1,
      carName: 'Mercedes-Benz S-Class 2026',
      name: 'Nguyen Test User',
      phone: '0901234567',
      date: '2026-10-15',
      location: 'showroom',
      note: 'Yêu cầu test drive'
    };
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.equal(body.data.name, 'Nguyen Test User');
    assert.equal(body.data.status, 'pending');
  });

  test('GET /api/users should return registered users list without passwords', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const res = await fetch(`${baseUrl}/api/users`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.some(u => u.username === 'admin'));
    for (const u of body.data) {
      assert.equal(u.password, undefined);
    }
  });

  test('POST /api/auth/register should hash password and allow login', async (t) => {
    if (!isDbConnected) {
      t.skip('MongoDB không kết nối được trong môi trường CI');
      return;
    }
    const uniqueSuffix = Date.now();
    const testUsername = `bcrypt_test_${uniqueSuffix}`;
    const testEmail = `bcrypt_${uniqueSuffix}@example.com`;
    const testPassword = 'Password123!';

    // 1. Register
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: testPassword,
        fullname: 'Bcrypt Test User',
        email: testEmail
      })
    });
    assert.equal(regRes.status, 201);
    const regBody = await regRes.json();
    assert.equal(regBody.success, true);
    assert.equal(regBody.user.password, undefined);

    // 2. Login with correct password
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: testPassword })
    });
    assert.equal(loginRes.status, 200);
    const loginBody = await loginRes.json();
    assert.equal(loginBody.success, true);
    assert.equal(loginBody.user.password, undefined);

    // 3. Change password with wrong current password should fail
    const changeFailRes = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: regBody.user.id,
        currentPassword: 'WrongPassword!',
        newPassword: 'NewPassword456!'
      })
    });
    assert.equal(changeFailRes.status, 400);

    // 4. Change password with correct current password should succeed
    const changeSuccessRes = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: regBody.user.id,
        currentPassword: testPassword,
        newPassword: 'NewPassword456!'
      })
    });
    assert.equal(changeSuccessRes.status, 200);

    // 5. Login with new password should succeed
    const newLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: testUsername, password: 'NewPassword456!' })
    });
    assert.equal(newLoginRes.status, 200);
    const newLoginBody = await newLoginRes.json();
    assert.equal(newLoginBody.success, true);
    assert.equal(newLoginBody.user.password, undefined);
  });
});
