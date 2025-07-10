import React from 'react'
import { Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material'

const Loading = ({ fullHeight }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box sx={{
      display:'flex', alignItems:'center', justifyContent:'center',
      width:'100%',
      height: fullHeight ? (isMobile ? '100vh' : '100vh') : '100%'
    }}>
      <CircularProgress />
    </Box>
  )
}

export default Loading
