import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (ID, password, userType) => {
    setIsLoading(true);
    setError(null); // Clear the error state before making the request

    try {
      const response = await fetch(`/api/${userType}/login`, {  // Adjust the endpoint based on your backend routes
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ID, password }),
      });

      if (!response.ok) {
        const json = await response.json();
        setError(json.message);
        return false; // Return false for a failed login
      } else {
        const json = await response.json();
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json });
        return true; // Return true for a successful login
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login.');
      return false; // Return false for any error during login
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, setError };
};
