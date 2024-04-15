import request from 'supertest';
import express from 'express';
import studentRouter from '../../../backend/routes/students';
import educatorRouter from '../../../backend/routes/educators';

// Define mock data for student and educator
const mockStudent = {
  ID: 'student1',
  password: '12345678'
};

const mockEducator = {
  ID: 'educator1',
  password: '12345678'
};

// Initialize Express app
const app = express();
app.use(express.json());
app.use('/students', studentRouter);
app.use('/educators', educatorRouter);

// Test cases for student login
describe('Student Login', () => {
  it('should login a student successfully', async () => {
    const res = await request(app)
      .post('/students/login')
      .send(mockStudent)
      .expect(200);

    expect(res.body.student).toHaveProperty('ID', mockStudent.ID);
    expect(res.body).toHaveProperty('token');
  });

  it('should return error message if ID or password is missing', async () => {
    await request(app)
      .post('/students/login')
      .send({})
      .expect(400, { message: 'All fields must be filled' });
  });

  it('should return status 401 for incorrect password', async () => {
    await request(app)
      .post('/students/login')
      .send({ ...mockStudent, password: 'wrongPassword' })
      .expect(401, { message: 'Incorrect password' });
  });

  it('should return status 404 for non-existent student', async () => {
    await request(app)
      .post('/students/login')
      .send({ ID: 'nonExistentID', password: 'password' })
      .expect(404, { message: 'Student not found' });
  });
});

// Test cases for educator login
describe('Educator Login', () => {
  it('should login an educator successfully', async () => {
    const res = await request(app)
      .post('/educators/login')
      .send(mockEducator)
      .expect(200);

    expect(res.body.educator).toHaveProperty('ID', mockEducator.ID);
    expect(res.body).toHaveProperty('token');
  });

  it('should return status 400 if ID or password is missing', async () => {
    await request(app)
      .post('/educators/login')
      .send({})
      .expect(400, { message: 'All fields must be filled' });
  });

  it('should return status 401 for incorrect password', async () => {
    await request(app)
      .post('/educators/login')
      .send({ ...mockEducator, password: 'wrongPassword' })
      .expect(401, { message: 'Incorrect password' });
  });

  it('should return status 404 for non-existent educator', async () => {
    await request(app)
      .post('/educators/login')
      .send({ ID: 'nonExistentID', password: 'password' })
      .expect(404, { message: 'Educator not found' });
  });
});
