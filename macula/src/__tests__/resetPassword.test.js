import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from '../testing/resetpassword';
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
test('handles successful password reset correctly', async () => {
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

  // Ensure that the success message is displayed upon successful password reset
  await waitFor(() => {
    expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
  });
});
test('handles password reset failure correctly', async () => {
  const fetchMock = jest.fn().mockResolvedValueOnce({ status: 400, json: () => Promise.resolve({ message: 'Password reset failed' }) });

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

  // Ensure that the error message is displayed upon password reset failure
  await waitFor(() => {
    expect(screen.getByText('Password reset failed')).toBeInTheDocument();
  });
});


// TC11: Test Invalid New Password (No Numbers)
test('handles invalid new password without numbers', async () => {
  render(<ResetPassword />);
  
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

  // Simulate entering an invalid new password (no numbers)
  fireEvent.change(newPasswordInput, { target: { value: 'Password' } });
  
  // Ensure that the Reset Password button remains disabled when the new password is invalid
  expect(resetPasswordButton).toBeDisabled();
});

// TC12: Test Password Reset Failure with Specific Error Message
test('handles password reset failure with specific error message', async () => {
  const fetchMock = jest.fn().mockResolvedValueOnce({ status: 400, json: () => Promise.resolve({ message: 'User not found' }) });

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

  // Ensure that the specific error message is displayed upon password reset failure
  await waitFor(() => {
    expect(screen.getByText('User not found')).toBeInTheDocument();
  });
});


// Mock the fetch function
jest.mock('node-fetch', () => jest.fn());

// Test suite for handleSendOTP function
describe('handleSendOTP function', () => {
  // Test case for successful OTP sending
  test('sends OTP successfully', async () => {
    // Mock the fetch response
    fetch.mockResolvedValueOnce({
      status: 200,
      json: async () => ({ message: 'OTP sent successfully' }), // Mock JSON response
    });

    // Render the ResetPassword component
    render(<ResetPassword />);

    // Simulate user entering an email
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });

    // Simulate user clicking the Send OTP button
    fireEvent.click(screen.getByText('Send OTP'));

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      // Assert that the loading indicator is hidden
      expect(screen.queryByText('Loading...')).toBeNull();

      // Assert that the error message is not present
      expect(screen.queryByText('An error occurred while sending OTP.')).toBeNull();

      // Assert that the success message is displayed
      expect(screen.getByText('OTP sent successfully')).toBeInTheDocument();
    });
  });

  // Test case for failed OTP sending
  test('handles failed OTP sending', async () => {
    // Mock the fetch response for a failed request
    fetch.mockResolvedValueOnce({
      status: 400,
      json: async () => ({ message: 'Failed to send OTP' }), // Mock JSON response
    });

    // Render the ResetPassword component
    render(<ResetPassword />);

    // Simulate user entering an email
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });

    // Simulate user clicking the Send OTP button
    fireEvent.click(screen.getByText('Send OTP'));

    // Wait for the asynchronous operation to complete
    await waitFor(() => {
      // Assert that the loading indicator is hidden
      expect(screen.queryByText('Loading...')).toBeNull();

      // Assert that the error message is displayed
      expect(screen.getByText('Failed to send OTP')).toBeInTheDocument();

      // Assert that the success message is not present
      expect(screen.queryByText('OTP sent successfully')).toBeNull();
    });
  });
});
describe('ResetPassword component', () => {
  test('handles error during OTP sending', async () => {
    const mockError = new Error('Failed to send OTP');
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

    render(<ResetPassword />);

    // Fill in the email field
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Click the Send OTP button
    const sendOTPButton = screen.getByText('Send OTP');
    fireEvent.click(sendOTPButton);

    // Assert that error state is set correctly
    await waitFor(() => {
      expect(screen.getByText('An error occurred while sending OTP.')).toBeInTheDocument();
    });
  });
});

describe('ResetPassword component', () => {
  test('handles missing or invalid password during password reset', async () => {
    render(<ResetPassword />);

    // Fill in the email field
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Fill in the OTP field
    const otpInput = screen.getByPlaceholderText('Enter OTP');
    fireEvent.change(otpInput, { target: { value: '123456' } });

    // Fill in an invalid or missing password
    const newPasswordInput = screen.getByPlaceholderText('Enter new password');
    fireEvent.change(newPasswordInput, { target: { value: '' } }); // Simulate a missing password

    // Click the "Reset Password" button
    const resetPasswordButton = screen.getByText('Reset Password');
    fireEvent.click(resetPasswordButton);

   

    // Change the password to a too short one
    fireEvent.change(newPasswordInput, { target: { value: 'short' } }); // Simulate a too short password

    // Click the "Reset Password" button again
    fireEvent.click(resetPasswordButton);

  
  });
});

});
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import ResetPassword from '../testing/resetpassword';
// import '@testing-library/jest-dom/extend-expect'; // This import adds the toBeInTheDocument matcher
// import { act } from 'react-dom/test-utils'; // Import act from react-dom/test-utils

// // Mock the fetch function
// jest.mock('node-fetch', () => jest.fn());

// describe('ResetPassword component', () => {
//   // Test case for handling send OTP correctly
//   test('handles send OTP correctly', async () => {
//     global.fetch = jest.fn();

    
//     // Mock the fetch response
//     fetch.mockResolvedValueOnce({
//       status: 200,
//       json: async () => ({ message: 'OTP sent successfully' }), // Mock JSON response
//     });

//     // Render the ResetPassword component
//     render(<ResetPassword />);
    
//     // Simulate user entering an email
//     fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });

//     // Simulate user clicking the Send OTP button
//     fireEvent.click(screen.getByText('Send OTP'));

//     // Wait for the asynchronous operation to complete
//     await waitFor(() => {
//       // Assert that the success message is displayed
//       expect(screen.getByText('OTP sent successfully')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling empty email
//   test('handles empty email correctly', async () => {
//     render(<ResetPassword />);
    
//     const sendOTPButton = screen.getByText('Send OTP');
    
//     // Click Send OTP button without entering an email
//     fireEvent.click(sendOTPButton);
    
//     // Assert that an error message is displayed for empty email
//     await waitFor(() => {
//       expect(screen.getByText('Email is required')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling invalid email
//   test('handles invalid email correctly', async () => {
//     render(<ResetPassword />);
    
//     // Mock fetch function
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ message: 'OTP sent successfully' }),
//         status: 200,
//       })
//     );
  
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const sendOTPButton = screen.getByText('Send OTP');
  
//     // Wrap state update inside act
//     await act(async () => {
//       // Enter invalid email (without proper format) and click Send OTP button
//       fireEvent.change(emailInput, { target: { value: 'test@example' } });
//       fireEvent.click(sendOTPButton);
//     });
  
//     // Assert that an error message is displayed
//     await waitFor(() => {
//       expect(screen.getByText('Invalid email format')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling verifying correct OTP correctly
//   test('handles verifying correct OTP correctly', async () => {
//     render(<ResetPassword />);
    
//     // Mock fetch function to simulate successful OTP verification
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ message: 'OTP verified successfully' }),
//         status: 200,
//       })
//     );
  
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     const newPasswordInput = screen.getByPlaceholderText('Enter new password');
//     const verifyOTPButton = screen.getByText('Verify OTP');
//     const resetPasswordButton = screen.getByText('Reset Password');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Enter a correct OTP
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click Verify OTP button
//     fireEvent.click(verifyOTPButton);
  
//     // Simulate entering a valid new password
//     fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
  
//     // Click Reset Password button with correct OTP and valid new password
//     fireEvent.click(resetPasswordButton);
    
//     // Wait for component to update after state change
//   });

//   // Test case for handling empty OTP correctly
//   test('handles empty OTP correctly', async () => {
//     render(<ResetPassword />);
    
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const verifyOTPButton = screen.getByText('Verify OTP');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Click Send OTP button without entering an OTP
//     fireEvent.click(verifyOTPButton);
    
//     // Assert that an error message is displayed for empty OTP
//     await waitFor(() => {
//       expect(screen.getByText('OTP is required')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling incorrect OTP correctly
//   test('handles incorrect OTP correctly', async () => {
//     render(<ResetPassword />);
    
//     // Mock fetch function to simulate OTP verification failure
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ message: 'Incorrect OTP' }),
//         status: 400,
//       })
//     );

//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     const verifyOTPButton = screen.getByText('Verify OTP');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Enter an incorrect OTP
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click Verify OTP button
//     fireEvent.click(verifyOTPButton);
    
//     // Assert that an error message is displayed for incorrect OTP
//     await waitFor(() => {
//       expect(screen.getByText('Incorrect OTP')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling change password correctly
//   test('handles change password correctly', async () => {
//     const fetchMock = jest.fn().mockResolvedValueOnce({ status: 200 });

//     jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

//     const { getByPlaceholderText, getByText } = render(<ResetPassword />);

//     // Simulate user input
//     act(() => {
//       fireEvent.change(getByPlaceholderText('Enter your email'), {
//         target: { value: 'test@example.com' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter OTP'), {
//         target: { value: '123456' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter new password'), {
//         target: { value: 'newPassword123' },
//       });
//     });

//     // Simulate button click
//     act(() => {
//       fireEvent.click(getByText('Reset Password'));
//     });

//     // Ensure that the API call was made to reset the password
//     expect(fetchMock).toHaveBeenCalledWith('/api/reset-password', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: 'test@example.com', newPassword: 'newPassword123' }),
//     });
//   });

//   // Test case for handling empty new password correctly
//   test('handles empty new password correctly', async () => {
//     render(<ResetPassword />);
    
//     // Mock fetch function to simulate successful OTP verification
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ message: 'OTP verified successfully' }),
//         status: 200,
//       })
//     );

//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     const newPasswordInput = screen.getByPlaceholderText('Enter new password');
//     const resetPasswordButton = screen.getByText('Reset Password');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Enter a correct OTP
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click Verify OTP button
//     fireEvent.click(screen.getByText('Verify OTP'));

//     // Ensure that the Reset Password button is initially disabled
//     expect(resetPasswordButton).toBeDisabled();

//     // Simulate entering an empty new password
//     fireEvent.change(newPasswordInput, { target: { value: '' } });
    
//     // Ensure that the Reset Password button remains disabled when the new password is empty
//     expect(resetPasswordButton).toBeDisabled();
//   });

//   // Test case for handling invalid new password
//   test('handles invalid new password', async () => {
//     render(<ResetPassword />);
    
//     // Mock fetch function to simulate successful OTP verification
//     global.fetch = jest.fn(() =>
//       Promise.resolve({
//         json: () => Promise.resolve({ message: 'OTP verified successfully' }),
//         status: 200,
//       })
//     );

//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     const newPasswordInput = screen.getByPlaceholderText('Enter new password');
//     const resetPasswordButton = screen.getByText('Reset Password');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Enter a correct OTP
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click Verify OTP button
//     fireEvent.click(screen.getByText('Verify OTP'));

//     // Ensure that the Reset Password button is initially disabled
//     expect(resetPasswordButton).toBeDisabled();

//     // Simulate entering an invalid new password (less than 8 characters)
//     fireEvent.change(newPasswordInput, { target: { value: '12345' } });
    
//     // Ensure that the Reset Password button remains disabled when the new password is invalid
//     expect(resetPasswordButton).toBeDisabled();
//   });

//   // Test case for handling successful password reset correctly
//   test('handles successful password reset correctly', async () => {
//     const fetchMock = jest.fn().mockResolvedValueOnce({ status: 200 });

//     jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

//     const { getByPlaceholderText, getByText } = render(<ResetPassword />);

//     // Simulate user input
//     act(() => {
//       fireEvent.change(getByPlaceholderText('Enter your email'), {
//         target: { value: 'test@example.com' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter OTP'), {
//         target: { value: '123456' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter new password'), {
//         target: { value: 'newPassword123' },
//       });
//     });

//     // Simulate button click
//     act(() => {
//       fireEvent.click(getByText('Reset Password'));
//     });

//     // Ensure that the success message is displayed upon successful password reset
//     await waitFor(() => {
//       expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling password reset failure correctly
//   test('handles password reset failure correctly', async () => {
//     const fetchMock = jest.fn().mockResolvedValueOnce({ status: 400, json: () => Promise.resolve({ message: 'Password reset failed' }) });

//     jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

//     const { getByPlaceholderText, getByText } = render(<ResetPassword />);

//     // Simulate user input
//     act(() => {
//       fireEvent.change(getByPlaceholderText('Enter your email'), {
//         target: { value: 'test@example.com' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter OTP'), {
//         target: { value: '123456' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter new password'), {
//         target: { value: 'newPassword123' },
//       });
//     });

//     // Simulate button click
//     act(() => {
//       fireEvent.click(getByText('Reset Password'));
//     });

//     // Ensure that the error message is displayed upon password reset failure
//     await waitFor(() => {
//       expect(screen.getByText('Password reset failed')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling invalid new password without numbers
//   test('handles invalid new password without numbers', async () => {
//     render(<ResetPassword />);
    
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     const newPasswordInput = screen.getByPlaceholderText('Enter new password');
//     const resetPasswordButton = screen.getByText('Reset Password');
    
//     // Enter a valid email
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
//     // Enter a correct OTP
//     fireEvent.change(otpInput, { target: { value: '123456' } });
    
//     // Click Verify OTP button
//     fireEvent.click(screen.getByText('Verify OTP'));

//     // Ensure that the Reset Password button is initially disabled
//     expect(resetPasswordButton).toBeDisabled();

//     // Simulate entering an invalid new password (no numbers)
//     fireEvent.change(newPasswordInput, { target: { value: 'Password' } });
    
//     // Ensure that the Reset Password button remains disabled when the new password is invalid
//     expect(resetPasswordButton).toBeDisabled();
//   });

//   // Test case for handling password reset failure with specific error message
//   test('handles password reset failure with specific error message', async () => {
//     const fetchMock = jest.fn().mockResolvedValueOnce({ status: 400, json: () => Promise.resolve({ message: 'User not found' }) });

//     jest.spyOn(global, 'fetch').mockImplementation(fetchMock);

//     const { getByPlaceholderText, getByText } = render(<ResetPassword />);

//     // Simulate user input
//     act(() => {
//       fireEvent.change(getByPlaceholderText('Enter your email'), {
//         target: { value: 'test@example.com' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter OTP'), {
//         target: { value: '123456' },
//       });
//       fireEvent.change(getByPlaceholderText('Enter new password'), {
//         target: { value: 'newPassword123' },
//       });
//     });

//     // Simulate button click
//     act(() => {
//       fireEvent.click(getByText('Reset Password'));
//     });

//     // Ensure that the specific error message is displayed upon password reset failure
//     await waitFor(() => {
//       expect(screen.getByText('User not found')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling error during OTP sending
//   test('handles error during OTP sending', async () => {
//     const mockError = new Error('Failed to send OTP');
//     jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

//     render(<ResetPassword />);

//     // Fill in the email field
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

//     // Click the Send OTP button
//     const sendOTPButton = screen.getByText('Send OTP');
//     fireEvent.click(sendOTPButton);

//     // Assert that error state is set correctly
//     await waitFor(() => {
//       expect(screen.getByText('An error occurred while sending OTP.')).toBeInTheDocument();
//     });
//   });

//   // Test case for handling missing or invalid password during password reset
//   test('handles missing or invalid password during password reset', async () => {
//     render(<ResetPassword />);

//     // Fill in the email field
//     const emailInput = screen.getByPlaceholderText('Enter your email');
//     fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

//     // Fill in the OTP field
//     const otpInput = screen.getByPlaceholderText('Enter OTP');
//     fireEvent.change(otpInput, { target: { value: '123456' } });

//     // Fill in an invalid or missing password
//     const newPasswordInput = screen.getByPlaceholderText('Enter new password');
//     fireEvent.change(newPasswordInput, { target: { value: '' } }); // Simulate a missing password

//     // Click the "Reset Password" button
//     const resetPasswordButton = screen.getByText('Reset Password');
//     fireEvent.click(resetPasswordButton);

//     // Change the password to a too short one
//     fireEvent.change(newPasswordInput, { target: { value: 'short' } }); // Simulate a too short password

//     // Click the "Reset Password" button again
//     fireEvent.click(resetPasswordButton);
//   });
// });

