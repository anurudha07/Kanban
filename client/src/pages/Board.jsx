import React, { useEffect, useState, useRef } from 'react'
import { Box, IconButton, TextField, Typography, useTheme, useMediaQuery } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import EmojiPicker from '../components/common/EmojiPicker'
import Kanban from '../components/common/Kanban'
import { setBoards, updateBoard, removeBoard } from '../redux/features/boardSlice'
import { setFavouriteList, updateFavourite, removeFavourite } from '../redux/features/favouriteSlice'

const Board = () => {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [sections, setSections] = useState([])
  const [fav, setFav] = useState(false)
  const [icon, setIcon] = useState('')
  const [justSaved, setJustSaved] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const favourites = useSelector(s => s.favourites.value)

  const titleTimer = useRef()
  const iconTimer  = useRef()

  // Load board data on mount or when boardId changes
  useEffect(() => {
    boardApi.getOne(boardId)
      .then(r => {
        setTitle(r.title)
        setDesc(r.description || '')
        setSections(r.sections || [])
        setFav(r.favourite)
        setIcon(r.icon)
      })
      .catch(console.error)
  }, [boardId])

  // Save changes then re-fetch full boards list
  const save = changes =>
    boardApi.update(boardId, changes)
      .then(updated => {
        dispatch(updateBoard(updated))
        dispatch(updateFavourite(updated))
        return boardApi.getAll()
      })
      .then(all => {
        dispatch(setBoards(all))
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 1500)
      })
      .catch(console.error)

  // Title change handler
  const onTitleChange = e => {
    const v = e.target.value
    setTitle(v)
    dispatch(updateBoard({ id: boardId, title: v }))

    clearTimeout(titleTimer.current)
    titleTimer.current = setTimeout(() => save({ title: v }), 500)
  }

  // Emoji change handler
  const onIconChange = newIcon => {
    setIcon(newIcon)
    dispatch(updateBoard({ id: boardId, icon: newIcon }))
    dispatch(updateFavourite({ id: boardId, icon: newIcon }))

    clearTimeout(iconTimer.current)
    iconTimer.current = setTimeout(() => save({ icon: newIcon }), 500)
  }

  // Toggle favourite status
  const onToggleFav = () => {
    const nf = !fav
    setFav(nf)
    boardApi.update(boardId, { favourite: nf })
      .then(updated => {
        dispatch(updateBoard(updated))
        if (nf) dispatch(setFavouriteList([updated, ...favourites]))
        else   dispatch(removeFavourite(updated.id))
      })
      .catch(() => setFav(fav))
  }

  // Delete board
  const onDelete = async () => {
  dispatch(removeBoard(boardId))
  dispatch(removeFavourite(boardId))
  navigate('/')

  try {
    await boardApi.delete(boardId)
    
  } catch (err) {
    console.error('Failed to delete board:', err)
  }
}


  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: isMobile ? 1 : 5, py: 1 }}>
        <IconButton onClick={onToggleFav}>
          {fav
            ? <StarOutlinedIcon color="warning" />
            : <StarBorderOutlinedIcon />}
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>

      <Box sx={{ px: isMobile ? 1 : 5, py: isMobile ? 1 : 2 }}>
        <EmojiPicker icon={icon} onChange={onIconChange} />

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Untitled"
          value={title}
          onChange={onTitleChange}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-input': {
              fontSize: isMobile ? '1.5rem' : '2rem',
              fontWeight: 700
            }
          }}
        />
        {justSaved && (
          <Typography variant="caption" color="success.main" sx={{ mt: 0.5 }}>
            Saved!
          </Typography>
        )}

        <TextField
          fullWidth
          variant="outlined"
          multiline
          placeholder="Add a description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          sx={{
            mt: 1,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '& .MuiInputBase-input': {
              fontSize: isMobile ? '0.75rem' : '0.8rem'
            }
          }}
        />

        <Box sx={{ mt: 2 }}>
          <Kanban
            data={sections}
            boardId={boardId}
            onSectionsChange={setSections}
          />
        </Box>
      </Box>
    </>
  )
}

export default Board
