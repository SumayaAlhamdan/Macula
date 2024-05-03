import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import { AuthContextProvider } from '../context/authContext'; // Import AuthContextProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter as Router
import Login from '../pages/login';

test('should render login components', () => {
  render(
    <AuthContextProvider>
      <Router>
      <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  

});

test('LogIn with valid student credentials', () => {
  render(
    <AuthContextProvider>
      <Router>
      <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  
  fireEvent.change(idInput, { target: { value: '442200845' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(window.location.pathname).toBe('/');

});

test('LogIn with valid educator credentials', () => {
  render(
    <AuthContextProvider>
      <Router>
      <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  
  fireEvent.change(idInput, { target: { value: 'salhamdan' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(window.location.pathname).toBe('/');

});

test('LogIn with valid admin credentials', () => {
  render(
    <AuthContextProvider>
      <Router>
      <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  
  fireEvent.change(idInput, { target: { value: 'admin' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(window.location.pathname).toBe('/');

});

test('LogIn with invalid credentials', async () => {
  render(
    <AuthContextProvider>
      <Router>
        <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  
  fireEvent.change(idInput, { target: { value: 'nalhamda' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument();
});

test('LogIn with empty fields', async () => {
  render(
    <AuthContextProvider>
      <Router>
        <Login />
      </Router>
    </AuthContextProvider>
  );
  
  // Your existing assertions
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  expect(idInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
  
  fireEvent.change(idInput, { target: { value: ""} });
  fireEvent.change(passwordInput, { target: { value: "" } });

  // Submit the form
  fireEvent.click(loginButton);

  //expect(await screen.findByText('All fields should be filled"')).toBeInTheDocument();
  expect(await screen.findByText('All fields should be filled')).toBeInTheDocument();
});
