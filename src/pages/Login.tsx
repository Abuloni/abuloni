import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from "../assets/vite.svg"
import '../style/App.css'
import { digestMessage } from '../shared/crypt'
import { userData } from '../shared/auth'
import { Link } from 'react-router'

// ibm api key 3jk10WXB73fIwaET6vhmbCJkqfQaOCP-Rh9KY6ncm8gE

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {

      const s = Date.now().toString();
      const d = await digestMessage(s + formData.password);

      fetch('https://function-b4.22sao0ofnhw5.br-sao.codeengine.appdomain.cloud/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: formData.email,
          pass: s + 'H' + d
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(data => {
        console.log('Response data:', data)
        // Here you would typically check the response to see if login was successful
        userData.email = formData.email;
        userData.data = data.data;
        setIsLoggedIn(true)
      })
      .catch(err => {
        throw err
      })
      // For demo purposes, accept any email/password combination
      setIsLoggedIn(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoggedIn) {
    return (
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Welcome Back!</h1>
        <div className="card">
          <div className="success">
            <p style={{ color: 'green' }}>Successfully logged in as {formData.email}</p>
            <Link to="/" className="app-link">Go to App</Link>
          </div>
        </div>
        <p className="read-the-docs">
          You are now logged into the application
        </p>
      </>
    )
  }

  return (
    <>
      <h1>Login</h1>
      <div className="card">
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {error && (
          <div className="error">
            <p style={{ color: 'red' }}>Error: {error}</p>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Enter your credentials to access the application
      </p>
    </>
  )
}

export default Login