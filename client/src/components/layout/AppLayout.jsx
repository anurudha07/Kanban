import React, { useEffect, useState } from 'react'
import {
  Box,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authUtils from '../../utils/authUtils'
import Loading from '../common/Loading'
import Sidebar from '../common/Sidebar'
import { setUser } from '../../redux/features/userSlice'

const AppLayout = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const drawerWidth = 300

  useEffect(() => {
    authUtils.isAuthenticated().then(user => {
      if (!user) return navigate('/login')
      dispatch(setUser(user))
      setLoading(false)
    })
  }, [dispatch, navigate])

  if (loading) return <Loading fullHeight />

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isMobile ? 1 : 2,
          mt: isMobile ? theme.spacing(7) : 0,
          ml: !isMobile ? `${drawerWidth}px` : 0,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default AppLayout
