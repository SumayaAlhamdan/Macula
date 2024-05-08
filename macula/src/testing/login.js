import React, { Component } from 'react';

class Login extends Component {
  handleSubmit = async (id, password) => {
    console.log("handle submit", id, password);
    if (!id || !password) {
      console.log("empty");
      return false;
    }

    const { setIsLoading, setError, dispatch } = this.props;

    const firstChar = id.charAt(0);
    const isStudent = !isNaN(firstChar);

    try {
      setIsLoading(true);
      setError(null);

      let loginSuccessful = false;

      const response = await fetch(`/api/${isStudent ? 'students' : 'educators'}/${id}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });

      if (response.status === 404) {
        const json = await response.json();
        console.log('Error 404:', json.message);
        setError(json.message);
      } else if (response.status === 200) {
        const json = await response.json();
        console.log('Login successful:', json);
        localStorage.setItem('user', JSON.stringify(json));
        dispatch({ type: 'LOGIN', payload: json });
        loginSuccessful = true;
      }

      setIsLoading(false);

      if (loginSuccessful) {
        console.log('Login successful');
        return true;
      } else {
        console.log('Invalid credentials');
        setError('Invalid credentials.');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      console.log('An error occurred during login.');
      setError('An error occurred during login.');
      setIsLoading(false);
      return false;
    }
  };
}

export default Login;
