import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  CircularProgress
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/Kanban'
import {
  setBoards,
  updateBoard,
  removeBoard
} from '../redux/features/boardSlice'
import {
  setFavouriteList,
  updateFavourite,
  removeFavourite
} from '../redux/features/favouriteSlice'

const Board = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { boardId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Global boards/favourites
  const allBoards = useSelector(state => state.board.value, shallowEqual)
  const favourites = useSelector(state => state.favourites.value, shallowEqual)

  // Local state
  const [board, setBoard] = useState(null)
  const [saving, setSaving] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const titleTimer = useRef()
  const descTimer = useRef()
  const iconTimer = useRef()

  // Load board data once
  useEffect(() => {
    boardApi.getOne(boardId)
      .then(r => setBoard(r))
      .catch(console.error)
  }, [boardId])

  // Debounced save handler
  const save = useCallback((changes) => {
    setSaving(true)
    boardApi.update(boardId, changes)
      .then(updated => {
        setBoard(prev => ({ ...prev, ...changes }))
        dispatch(updateBoard(updated))
        if ('favourite' in changes) {
          dispatch(updateFavourite(updated))
        }
      })
      .catch(console.error)
      .finally(() => {
        setSaving(false)
        setJustSaved(true)
        clearTimeout(titleTimer.current)
        titleTimer.current = setTimeout(() => setJustSaved(false), 1500)
      })
  }, [boardId, dispatch])

  const onTitleChange = e => {
    const title = e.target.value
    setBoard(prev => ({ ...prev, title }))
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => save({ title }), 200)
  }

  const onDescChange = e => {
    const description = e.target.value
    setBoard(prev => ({ ...prev, description }))
    clearTimeout(descTimer.current)
    descTimer.current = setTimeout(() => save({ description }), 200)
  }

  const onIconChange = newIcon => {
    setBoard(prev => ({ ...prev, icon: newIcon }))
    clearTimeout(iconTimer.current)
    iconTimer.current = setTimeout(() => save({ icon: newIcon }), 200)
  }

  const onToggleFav = () => {
    const favourite = !board.favourite
    setBoard(prev => ({ ...prev, favourite }))
    save({ favourite })
  }

  const onDelete = () => {
    dispatch(removeBoard(boardId))
    dispatch(removeFavourite(boardId))
    boardApi.delete(boardId)
      .catch(console.error)
      .finally(() => navigate('/'))
  }

  if (!board) {
    return <Box sx={{ display:'flex', justifyContent:'center', mt:4 }}><CircularProgress /></Box>
  }

  return (
    <Fade in timeout={200}>
      <Box>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: isMobile ? 1 : 5, py: 1 }}>
          <IconButton onClick={onToggleFav} disabled={saving}>
            {board.favourite ? <StarOutlinedIcon color="warning" /> : <StarBorderOutlinedIcon />}
          </IconButton>
          <IconButton color="error" onClick={onDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ px: isMobile ? 1 : 5, py: isMobile ? 1 : 2, position: 'relative', overflowY: 'auto' }}>
          <EmojiPicker icon={board.icon} onChange={onIconChange} />

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Untitled"
            value={board.title}
            onChange={onTitleChange}
            sx={{ mt: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiInputBase-input': { fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700 } }}
          />

          {justSaved && (
            <Typography
              variant="caption"
              color="success.main"
              sx={{ position: 'absolute', top: isMobile ? 82 : 88, right: isMobile ? 40 : 100, bgcolor: 'background.paper', px: 0.5, borderRadius: 0.5 }}
            >
              Saved!
            </Typography>
          )}

          <TextField
            fullWidth
            variant="outlined"
            multiline
            value={board.description}
            onChange={onDescChange}
            sx={{ mt: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.8rem' } }}
          />

          <Box sx={{ mt: 2 }}>
            {/* Memoized Kanban to prevent unnecessary re-renders */}
            <Kanban data={board.sections} boardId={boardId} onSectionsChange={sections => save({ sections })} />
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default React.memo(Board)
