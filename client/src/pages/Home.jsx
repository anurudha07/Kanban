import React, { useState } from 'react'
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useNavigate } from 'react-router-dom'
import boardApi from '../api/boardApi'
import { addBoard } from '../redux/features/boardSlice'
import { useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const createBoard = async () => {
    setLoading(true)
    try {
      const res = await boardApi.create()
      dispatch(addBoard(res))
      navigate(`/boards/${res.id}`)
    } catch (e) {
      alert(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: isMobile ? 2 : 0,
      flexDirection: 'column',
      gap: 1
    }}>
      <LoadingButton
        variant='outlined'
        color='success'
        loading={loading}
        onClick={createBoard}
        sx={{ fontSize: isMobile ? '0.6rem' : '0.7rem', px: 1.2, py: 0.5 }}
      >
        Create board now
      </LoadingButton>

      <Typography variant="caption" sx={{ fontSize: isMobile ? '0.66rem' : '0.74rem', color: 'text.secondary' }}>
        Create a new board now — start adding sections and tasks instantly.
      </Typography>
    </Box>
  )
}

export default Home
