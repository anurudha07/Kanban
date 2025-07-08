import { Box, Button, TextField, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authApi from '../api/authApi'


const contentWidth = 400

const Signup = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [nameErr, setNameErr] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setNameErr('')
    setEmailErr('')
    setPasswordErr('')

    const form = new FormData(e.currentTarget)
    const name = form.get('name')?.toString().trim() || ''
    const email = form.get('email')?.toString().trim() || ''
    const password = form.get('password')?.toString().trim() || ''

    let hasError = false
    if (!name) {
      setNameErr('Please fill this field')
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
      const res = await authApi.signup({ name, email, password })
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data?.errors || []
      errors.forEach(e => {
        if (e.param === 'name') setNameErr(e.msg)
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
        pt: 5,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >

      {/* Two-line tagline */}
      <Typography
        variant="subtitle1"
        align="center"
        sx={{ width: contentWidth, mb: 4, color: 'text.secondary' }}
      >
        Welcome, Create an account to get started.
      </Typography>

      {/* Signup Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: contentWidth,
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Signup
        </Typography>

        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          disabled={loading}
          error={!!nameErr}
          helperText={nameErr}
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
