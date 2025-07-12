import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Fade
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { useDispatch, useSelector } from 'react-redux'
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

  // Global boards state
  const allBoards = useSelector(s => s.board.value || [])
  const favourites = useSelector(s => s.favourites.value)

  // Local UI state
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [sections, setSections] = useState([])
  const [fav, setFav] = useState(false)
  const [icon, setIcon] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const titleTimer = useRef()
  const descTimer = useRef()
  const iconTimer = useRef()

  // Load board data
  useEffect(() => {
    setLoaded(false)
    boardApi.getOne(boardId)
      .then(r => {
        setTitle(r.title || '')
        setDesc(r.description || '')
        setSections(r.sections || [])
        setFav(r.favourite)
        setIcon(r.icon)
      })
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [boardId])

  // Debounced save
  const save = changes => {
    boardApi.update(boardId, changes)
      .then(updated => {
        dispatch(updateBoard(updated))
        dispatch(updateFavourite(updated))
        return boardApi.getAll()
      })
      .then(all => dispatch(setBoards(all)))
      .catch(console.error)

    setJustSaved(true)
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => setJustSaved(false), 1500)
  }

  const onTitleChange = e => {
    const v = e.target.value
    setTitle(v)
    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => save({ title: v }), 200)
  }

  const onDescChange = e => {
    const v = e.target.value
    setDesc(v)
    clearTimeout(descTimer.current)
    descTimer.current = setTimeout(() => save({ description: v }), 200)
  }

  const onIconChange = newIcon => {
    setIcon(newIcon)
    clearTimeout(iconTimer.current)
    iconTimer.current = setTimeout(() => save({ icon: newIcon }), 200)
  }

  const onToggleFav = () => {
    const nf = !fav
    setFav(nf)
    boardApi.update(boardId, { favourite: nf })
      .then(updated => {
        dispatch(updateBoard(updated))
        if (nf) dispatch(setFavouriteList([updated, ...favourites]))
        else dispatch(removeFavourite(updated.id))
      })
      .catch(() => setFav(fav))
  }

  const onDelete = () => {
    dispatch(removeBoard(boardId))
    dispatch(removeFavourite(boardId))
    navigate('/')
    boardApi.delete(boardId).catch(console.error)
  }

  if (!loaded) return null

  return (
    <Fade in timeout={200}>
      <Box>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: isMobile ? 1 : 5, py: 1 }}>
          <IconButton onClick={onToggleFav}>
            {fav ? <StarOutlinedIcon color="warning" /> : <StarBorderOutlinedIcon />}
          </IconButton>
          <IconButton color="error" onClick={onDelete}>
            <DeleteOutlinedIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box
          sx={{
            px: isMobile ? 1 : 5,
            py: isMobile ? 1 : 2,
            position: 'relative',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          <EmojiPicker icon={icon} onChange={onIconChange} />

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Untitled"
            value={title}
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
            placeholder="" // no default placeholder
            value={desc}
            onChange={onDescChange}
            sx={{ mt: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, '& .MuiInputBase-input': { fontSize: isMobile ? '0.75rem' : '0.8rem' } }}
          />

          <Box sx={{ mt: 2 }}>
            <Kanban data={sections} boardId={boardId} onSectionsChange={setSections} />
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default Board
