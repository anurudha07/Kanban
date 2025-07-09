import { Box, CircularProgress, useTheme, useMediaQuery } from '@mui/material'

const Loading = props => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: props.fullHeight ? '100vh' : '100%'
    }}>
      <CircularProgress size={isXs ? 40 : 60} />
    </Box>
  )
}

export default Loading
