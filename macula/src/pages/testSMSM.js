import React from 'react';

class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      studentID: '',
      courseID: ''
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    
    const { studentID, courseID } = this.state;

    // Make an HTTP POST request to send data to the backend
    try {
      const response = await fetch('http://127.0.0.1:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentID, courseID })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Handle response
      const data = await response.json();
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { studentID, courseID } = this.state;

    return (
      <form 
      //onSubmit={this.handleSubmit}
      >
        <label>
          Student ID:
          <input 
            type="text" 
            name="studentID" 
            value={studentID} 
            onChange={this.handleInputChange} 
            required 
          />
        </label>
        <br />
        <label>
          Course ID:
          <input 
            type="text" 
            name="courseID" 
            value={courseID} 
            onChange={this.handleInputChange} 
            required 
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default MyComponent;
