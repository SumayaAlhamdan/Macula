import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../testing/resetPassword';
import '@testing-library/jest-dom/extend-expect'; // This import adds the toBeInTheDocument matcher
import { act } from 'react-dom/test-utils'; // Import act from react-dom/test-utils

describe('ResetPassword component', () => {

  //TC1
  test('handles send OTP correctly', async () => {
    render(<ResetPassword />);
    
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'OTP sent successfully' }),
        status: 200,
      })
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const sendOTPButton = screen.getByText('Send OTP');

    // Enter email and click Send OTP button
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(sendOTPButton);

  });

  //TC2
   test('handles empty email correctly', async () => {
    render(<ResetPassword />);
    
    const sendOTPButton = screen.getByText('Send OTP');
    
    // Click Send OTP button without entering an email
    fireEvent.click(sendOTPButton);
    
    // Assert that an error message is displayed for empty email
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });
  
  //TC3
  test('handles invalid email correctly', async () => {
    render(<ResetPassword />);
    
    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'OTP sent successfully' }),
        status: 200,
      })
    );
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const sendOTPButton = screen.getByText('Send OTP');
  
    // Wrap state update inside act
    await act(async () => {
      // Enter invalid email (without proper format) and click Send OTP button
      fireEvent.change(emailInput, { target: { value: 'test@example' } });
      fireEvent.click(sendOTPButton);
    });
  
    // Assert that an error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  //TC4
  test('handles verifying correct OTP correctly', async () => {
    render(<ResetPassword />);
    
    // Mock fetch function to simulate successful OTP verification
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ message: 'OTP verified successfully' }),
        status: 200,
      })
    );
  
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const otpInput = screen.getByPlaceholderText('Enter OTP');
    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    const verifyOTPButton = screen.getByText('Verify OTP');
    const resetPasswordButton = screen.getByText('Reset Password');
    
    // Enter a valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Enter a correct OTP
    fireEvent.change(otpInput, { target: { value: '123456' } });
    
    // Click Verify OTP button
    fireEvent.click(verifyOTPButton);
  
    // Simulate entering a valid new password
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
  
    // Click Reset Password button with correct OTP and valid new password
    fireEvent.click(resetPasswordButton);
    
    // Wait for component to update after state change
    await waitFor(() => {
      // Assert that no error message is displayed
      expect(screen.queryByText('Password is required')).not.toBeInTheDocument();
      // Additional assertions can be added here if needed
    });
  });

//TC5
test('handles empty OTP correctly', async () => {
  render(<ResetPassword />);
  
  const emailInput = screen.getByPlaceholderText('Enter your email');
  const verifyOTPButton = screen.getByText('Verify OTP');
  
  // Enter a valid email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Click Send OTP button without entering an OTP
  fireEvent.click(verifyOTPButton);
  
  // Assert that an error message is displayed for empty OTP
  await waitFor(() => {
    expect(screen.getByText('OTP is required')).toBeInTheDocument();
  });
});

  //TC6
test('handles incorrect OTP correctly', async () => {
  render(<ResetPassword />);
  
  // Mock fetch function to simulate OTP verification failure
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Incorrect OTP' }),
      status: 400,
    })
  );

  const emailInput = screen.getByPlaceholderText('Enter your email');
  const otpInput = screen.getByPlaceholderText('Enter OTP');
  const verifyOTPButton = screen.getByText('Verify OTP');
  
  // Enter a valid email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Enter an incorrect OTP
  fireEvent.change(otpInput, { target: { value: '123456' } });
  
  // Click Verify OTP button
  fireEvent.click(verifyOTPButton);
  
  // Assert that an error message is displayed for incorrect OTP
  await waitFor(() => {
    expect(screen.getByText('Incorrect OTP')).toBeInTheDocument();
  });
});

//TC7
  test('handles change password correctly', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({ status: 200 });

    jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    // Simulate user input
    act(() => {
      fireEvent.change(getByPlaceholderText('Enter your email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(getByPlaceholderText('Enter OTP'), {
        target: { value: '123456' },
      });
      fireEvent.change(getByPlaceholderText('Enter new password'), {
        target: { value: 'newPassword123' },
      });
    });

    // Simulate button click
    act(() => {
      fireEvent.click(getByText('Reset Password'));
    });

    // Ensure that the API call was made to reset the password
    expect(fetchMock).toHaveBeenCalledWith('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', newPassword: 'newPassword123' }),
    });
  });



//TC8
test('handles empty new password correctly', async () => {
  render(<ResetPassword />);
  
  // Mock fetch function to simulate successful OTP verification
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'OTP verified successfully' }),
      status: 200,
    })
  );

  const emailInput = screen.getByPlaceholderText('Enter your email');
  const otpInput = screen.getByPlaceholderText('Enter OTP');
  const newPasswordInput = screen.getByPlaceholderText('Enter new password');
  const resetPasswordButton = screen.getByText('Reset Password');
  
  // Enter a valid email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Enter a correct OTP
  fireEvent.change(otpInput, { target: { value: '123456' } });
  
  // Click Verify OTP button
  fireEvent.click(screen.getByText('Verify OTP'));

  // Ensure that the Reset Password button is initially disabled
  expect(resetPasswordButton).toBeDisabled();

  // Simulate entering an empty new password
  fireEvent.change(newPasswordInput, { target: { value: '' } });
  
  // Ensure that the Reset Password button remains disabled when the new password is empty
  expect(resetPasswordButton).toBeDisabled();
});

//TC9
test('handles invalid new password', async () => {
  render(<ResetPassword />);
  
  // Mock fetch function to simulate successful OTP verification
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'OTP verified successfully' }),
      status: 200,
    })
  );

  const emailInput = screen.getByPlaceholderText('Enter your email');
  const otpInput = screen.getByPlaceholderText('Enter OTP');
  const newPasswordInput = screen.getByPlaceholderText('Enter new password');
  const resetPasswordButton = screen.getByText('Reset Password');
  
  // Enter a valid email
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  
  // Enter a correct OTP
  fireEvent.change(otpInput, { target: { value: '123456' } });
  
  // Click Verify OTP button
  fireEvent.click(screen.getByText('Verify OTP'));

  // Ensure that the Reset Password button is initially disabled
  expect(resetPasswordButton).toBeDisabled();

  // Simulate entering an invalid new password (less than 8 characters)
  fireEvent.change(newPasswordInput, { target: { value: '12345' } });
  
  // Ensure that the Reset Password button remains disabled when the new password is invalid
  expect(resetPasswordButton).toBeDisabled();
});

});
