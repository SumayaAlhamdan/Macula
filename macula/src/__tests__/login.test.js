import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'
import { AuthContextProvider } from '../context/authContext'; // Import AuthContextProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter as Router
import Login from '../pages/login';
import React from 'react';


describe("Log in test suite", () => {

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

test('Student LogIn with wrong password', async () => {
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
  fireEvent.change(passwordInput, { target: { value: '1234' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument();
});

test('Educator LogIn with wrong password', async () => {
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
  fireEvent.change(passwordInput, { target: { value: '1234' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument();
});

test('Admin LogIn with wrong password', async () => {
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
  fireEvent.change(passwordInput, { target: { value: '1234' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument();
});

test('Student LogIn with student that doesnt exist', async () => {
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
  
  fireEvent.change(idInput, { target: { value: '442200' } });
  fireEvent.change(passwordInput, { target: { value: '12345678' } });

  // Submit the form
  fireEvent.click(loginButton);

  expect(await screen.findByText('Invalid credentials.')).toBeInTheDocument();
});

test('Eduactor LogIn with educator that doesnt exist', async () => {
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

test('admin LogIn with admin that doesnt exist', async () => {
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
  
  fireEvent.change(idInput, { target: { value: 'theAdmin' } });
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

it('should toggle the showPassword state', () => {

  const { getByTestId } = render(
    <AuthContextProvider>
      <Router>
        <Login />
      </Router>
    </AuthContextProvider>
  );
  
  const toggleButton = getByTestId('toggle-password-button');

    // Simulate a click on the toggle button
    fireEvent.click(toggleButton);

    // Assert that the password visibility state has been toggled
    expect(getByTestId('password').type).toBe('text');

    // Simulate another click on the toggle button
    fireEvent.click(toggleButton);

    // Assert that the password visibility state has been toggled back
    expect(getByTestId('password').type).toBe('password');
}); 


test('handleSubmit function is called when the form is submitted', () => {
  // Mock the login function
  const loginMock = jest.fn();

  render( <AuthContextProvider>
    <Router>
      <Login />
    </Router>
  </AuthContextProvider>);

  // Get form elements
  const idInput = screen.getByTestId('ID');
  const passwordInput = screen.getByTestId('password');
  const loginButton = screen.getByRole('button', { name: 'Login' });

  // Set input values
  fireEvent.change(idInput, { target: { value: '' } });
  fireEvent.change(passwordInput, { target: { value: '' } });

  // Submit the form
  fireEvent.click(loginButton);

  // Check if handleSubmit was called
  expect(loginMock).toHaveBeenCalled();
});


}) ;
 