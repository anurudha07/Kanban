import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  IconButton,
  TextField,
  useTheme,
  useMediaQuery,
  Fade,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import ViewKanbanIcon from '@mui/icons-material/ViewKanban'
import ListIcon from '@mui/icons-material/List'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import boardApi from '../api/boardApi'
import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/Kanban'
import TaskList from '../components/common/TaskList'

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

  const allBoards = useSelector(s => s.board.value || [])
  const favourites = useSelector(s => s.favourites.value || [])

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [sections, setSections] = useState([])
  const [fav, setFav] = useState(false)
  const [icon, setIcon] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [view, setView] = useState('kanban')

  const titleTimer = useRef(null)
  const descTimer = useRef(null)
  const iconTimer = useRef(null)

  const loadBoard = async () => {
    setLoaded(false)
    try {
      const r = await boardApi.getOne(boardId)
      setTitle(r.title || '')
      setDesc(r.description || '')
      setSections(r.sections || [])
      setFav(r.favourite)
      setIcon(r.icon)
    } catch (err) {
      console.error(err)
    } finally {
      setLoaded(true)
    }
  }

  useEffect(() => { loadBoard() }, [boardId])

  const save = (changes) => {
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
    if (nf) {
      const thisBoard = { id: boardId, title, description: desc, icon, favourite: true }
      dispatch(setFavouriteList([thisBoard, ...favourites]))
    } else dispatch(removeFavourite(boardId))
    boardApi.update(boardId, { favourite: nf })
      .then(updated => dispatch(updateBoard(updated)))
      .catch(err => {
        console.error('Failed to toggle favourite:', err)
        setFav(!nf)
      })
  }

  const onDelete = () => {
    dispatch(removeBoard(boardId))
    dispatch(removeFavourite(boardId))
    navigate('/')
    boardApi.delete(boardId).catch(console.error)
  }

  const handleViewChange = (_, next) => { if (next) setView(next) }

  if (!loaded) return null

  return (
    <Fade in timeout={200}>
      <Box>
        {/* Top Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 1, py: 0.25 }}>
          <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
            <ToggleButton value="kanban"><ViewKanbanIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="list"><ListIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>

          <Box>
            <IconButton onClick={onToggleFav} size="small">
              {fav ? <StarOutlinedIcon color="warning" fontSize="small" /> : <StarBorderOutlinedIcon fontSize="small" />}
            </IconButton>
            <IconButton color="error" onClick={onDelete} size="small">
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ px: 1, py: 0.5, overflowY: 'auto', maxHeight: 'calc(100vh - 60px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <EmojiPicker icon={icon} onChange={onIconChange} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Untitled"
              value={title}
              onChange={onTitleChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputBase-input': { fontSize: '1rem', fontWeight: 600, py: 0.3 }
              }}
              size="small"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            placeholder="Description..."
            value={desc}
            onChange={onDescChange}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiInputBase-input': { fontSize: '0.75rem', py: 0.3 }
            }}
            size="small"
          />

          <Box sx={{ mt: 1 }}>
            {view === 'kanban' ? (
              <Kanban data={sections} boardId={boardId} onSectionsChange={setSections} />
            ) : (
              <TaskList
                sections={sections}
                boardId={boardId}
                onReload={(resp) => {
                  if (resp && resp.sections) {
                    setSections(resp.sections)
                    setTitle(resp.title || '')
                    setDesc(resp.description || '')
                    setFav(resp.favourite)
                    setIcon(resp.icon)
                  } else loadBoard()
                }}
                compact
              />
            )}
          </Box>
        </Box>
      </Box>
    </Fade>
  )
}

export default Board
