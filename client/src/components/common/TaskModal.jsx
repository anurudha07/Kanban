import React, { useEffect, useRef, useState } from 'react'
import {
  Modal, Backdrop, Fade, Box, IconButton, TextField,
  Typography, Divider, useTheme, useMediaQuery
} from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'
import '../../css/custom-editor.css'

const baseStyle = {
  position: 'absolute',
  bgcolor: '#1e1e1e', 
  border: 'none',
  boxShadow: 12,
  p: 0.5,
  borderRadius: 1,
  fontSize: '0.7rem'
}

let debounceTimer
const DEBOUNCE = 500

const TaskModal = ({ task: t0, boardId, onUpdate, onDelete, onClose }) => {
  const [task, setTask] = useState(t0)
  const [title, setTitle] = useState(t0?.title || '')
  const [content, setContent] = useState(t0?.content || '')
  const editorRef = useRef()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setTask(t0)
    setTitle(t0?.title || '')
    setContent(t0?.content || '')

    setTimeout(() => {
      if (editorRef.current) {
        const editable = editorRef.current.querySelector('.ck-editor__editable_inline')
        if (editable) {
          editable.style.height = (editorRef.current.offsetHeight - 60) + 'px'
        }
      }
    }, 300)
  }, [t0])

  const handleClose = () => {
    onUpdate({ ...task, title, content })
    onClose()
  }

  const handleDelete = () => {
    taskApi.delete(boardId, task.id)
      .then(() => {
        onDelete(task)
        onClose()
      })
      .catch(console.error)
  }

  const updateTitle = e => {
    clearTimeout(debounceTimer)
    const v = e.target.value
    setTitle(v)
    setTask(prev => ({ ...prev, title: v }))
    debounceTimer = setTimeout(() => {
      taskApi.update(boardId, task.id, { title: v }).catch(console.error)
    }, DEBOUNCE)
  }

  const updateContent = (_, editor) => {
    clearTimeout(debounceTimer)
    const d = editor.getData()
    setContent(d)
    setTask(prev => ({ ...prev, content: d }))
    debounceTimer = setTimeout(() => {
      taskApi.update(boardId, task.id, { content: d }).catch(console.error)
    }, DEBOUNCE)
  }

  if (!task) return null

  return (
    <Modal
      open={!!task}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 400 }}
    >
      <Fade in={!!task}>
        <Box sx={{
  ...baseStyle,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%,-50%)',
  width: isMobile ? '90vw' : '38%',
  height: isMobile ? '75vh' : '55%',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column'
}}>

          {/* Top Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0.5 }}>
            <IconButton
              onClick={handleDelete}
              size="small"
              sx={{
                color: 'error.main',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255,0,0,0.1)' }
              }}
            >
              <DeleteOutlinedIcon fontSize="inherit" />
            </IconButton>

            <IconButton
              onClick={handleClose}
              size="small"
              sx={{
                ml: 0.5,
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseOutlinedIcon fontSize="inherit" />
            </IconButton>

            
          </Box>

          {/* Title & Content */}
          <Box sx={{ px: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Title + Date */}
            <Box sx={{ mb: 0.5 }}>
              <TextField
                fullWidth
                variant='outlined'
                placeholder='Untitled'
                value={title}
                onChange={updateTitle}
                size="small"
                sx={{
                  mb: 0.25,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiInputBase-input': {
                    fontSize: isMobile ? '0.95rem' : '1.05rem',
                    fontWeight: 600,
                    py: 0.3,
                    color: '#fff'
                  }
                }}
              />
              <Typography
                variant='caption'
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  display: 'block'
                }}
              >
                Created: {Moment(task.createdAt).format('YYYY-MM-DD')}
              </Typography>
            </Box>

            <Divider sx={{ mb: 0.5, borderColor: 'rgba(255,255,255,0.2)' }} />

            {/* CKEditor Content */}
<Box
  ref={editorRef}
  sx={{
    flex: 1,         
    overflowY: 'auto', 
    overflowX: 'hidden',
    minHeight: 100,   
    maxHeight: '100%', 
  }}
>
  <CKEditor
    editor={ClassicEditor}
    data={content}
    onChange={updateContent}
  />
</Box>

          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal
