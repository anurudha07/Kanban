import React, { useState } from 'react'
import { Box, useTheme, useMediaQuery } from '@mui/material'
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
      // Navigate to new board—Sidebar effect will fetch & show it
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
      p: isMobile ? 2 : 0
    }}>
      <LoadingButton
        variant='outlined'
        color='success'
        loading={loading}
        onClick={createBoard}
        sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
      >
        Create your board
      </LoadingButton>
    </Box>
  )
}

export default Home
