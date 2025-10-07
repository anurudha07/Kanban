import React, { useEffect, useState } from 'react'
import { Container, Box, useTheme, useMediaQuery } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import assets from '../../assets'

const AuthLayout = () => {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  useEffect(()=>{
    authUtils.isAuthenticated().then(isAuth=>{
      if(isAuth) navigate('/')
      else setLoading(false)
    })
  },[navigate])

  if(loading) return <Loading fullHeight/>

  return (
    <Container component='main' maxWidth='xs'>
      <Box sx={{
        mt: isMobile?4:8,
        display:'flex',
        flexDirection:'column',
        alignItems:'center'
      }}>
        <img
          src={assets.images.logoDark}
          alt='logo'
          width={isMobile?64:100}
          style={{ marginBottom: theme.spacing(2) }}
        />
        <Outlet/>
      </Box>
    </Container>
  )
}

export default AuthLayout