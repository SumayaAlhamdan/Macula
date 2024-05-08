import React from 'react';
import { render } from '@testing-library/react';
import Login from '../testing/login'; // Adjust the import path as needed

describe('Login Component', () => {
  test('handles empty submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '';
    const password = '';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles student valid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '442200845';
    const password = '12345678';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles educator valid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'salhamdan';
    const password = '12345678';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles admin valid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'admin';
    const password = '12345678';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles student invalid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '442200845';
    const password = '12';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles educator invalid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'salhamdan';
    const password = '12';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles admin invalid submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'admin';
    const password = '12';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles invalid student submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '442200';
    const password = '123';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles invalid educator submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'nalhamdan';
    const password = '123';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles invalid admin submission correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'notAdmin';
    const password = '123';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
  });

  test('handles 404 error correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = 'invalidId';
    const password = 'invalidPassword';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };

    // Mock fetch to return a 404 error
    global.fetch = jest.fn().mockResolvedValue({
      status: 404,
      json: () => Promise.resolve({ message: 'User not found' }),
    });

    const result = await login.handleSubmit(id, password);
    expect(result).toBe(false);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(setError).toHaveBeenCalledWith('User not found');
  });

  test('handles successful login correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '442200845';
    const password = '12345678';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };

    // Mock fetch to return a successful login response
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ user: 'John Doe' }),
    });

    const result = await login.handleSubmit(id, password);
    expect(result).toBe(true);
  });

  test('handles fetch API call correctly', async () => {
    const setIsLoading = jest.fn();
    const setError = jest.fn();
    const dispatch = jest.fn();
    const id = '442200845';
    const password = 'validPassword';
    const login = new Login();
    login.props = { setIsLoading, setError, dispatch };
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ user: 'John Doe' }),
    });
    await login.handleSubmit(id, password);
    expect(fetch).toHaveBeenCalledWith(`/api/students/${id}/login`, expect.any(Object));
  });
});



/* describe("Log in test suite", () => {


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

  expect(window.location.pathname).toBe("/");

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

  expect(window.location.pathname).toBe("/");

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

  expect(window.location.pathname).toBe("/");

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

}) ;  
*/ 