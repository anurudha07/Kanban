import { Box, Button, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'

const contentWidth = 300

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [usernameErr, setUsernameErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErr('')
    setEmailErr('')
    setPasswordErr('')

    const form = new FormData(e.currentTarget)
    const username = form.get('username')?.toString().trim() || ''
    const email = form.get('email')?.toString().trim() || ''
    const password = form.get('password')?.toString().trim() || ''

    let hasError = false
    if (!username) {
      setUsernameErr('Please fill this field')
      hasError = true
    }
    if (!email) {
      setEmailErr('Please fill this field')
      hasError = true
    }
    if (!password) {
      setPasswordErr('Please fill this field')
      hasError = true
    }
    if (hasError) return

    setLoading(true)
    try {
      const res = await authApi.signup({ username, email, password })
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.errors || err.data?.errors || []
      errors.forEach(e => {
        if (e.param === 'username') setUsernameErr(e.msg)
        if (e.param === 'email') setEmailErr(e.msg)
        if (e.param === 'password') setPasswordErr(e.msg)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        pt: 1,
        px: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ width: 350, mb: 3, fontSize: 15, color: 'text.secondary' }}
      >
        Welcome, Create an account to get started.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: 300,
          bgcolor: 'background.paper',
          px: 2.5,
          pt: 1.8,
          borderRadius: 1,
          boxShadow: 1,
          // Autofill override:
          '& input:-webkit-autofill': {
            WebkitBoxShadow: theme => `0 0 0 100px ${theme.palette.background.paper} inset`,
            WebkitTextFillColor: theme => theme.palette.text.primary,
            caretColor: theme => theme.palette.text.primary,
          },
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Signup
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
          error={!!usernameErr}
          helperText={usernameErr}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          type="email"
          disabled={loading}
          error={!!emailErr}
          helperText={emailErr}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          disabled={loading}
          error={!!passwordErr}
          helperText={passwordErr}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          loading={loading}
          sx={{ mt: 2 }}
        >
          Sign Up
        </LoadingButton>

        <Button
          component={Link}
          to="/login"
          fullWidth
          sx={{ mt: 1, textTransform: 'none' }}
        >
          Already have an account? Login
        </Button>
      </Box>
    </Box>
  )
}

export default Signup
