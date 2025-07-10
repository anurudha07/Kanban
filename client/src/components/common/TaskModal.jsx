// src/components/common/TaskModal.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  Modal, Backdrop, Fade, Box, IconButton, TextField,
  Typography, Divider, useTheme, useMediaQuery
} from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'
import '../../css/custom-editor.css'

const baseStyle = {
  position: 'absolute',
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 1
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

  // Sync whenever a new task is loaded into the modal
  useEffect(() => {
    setTask(t0)
    setTitle(t0?.title || '')
    setContent(t0?.content || '')
    // adjust editor height after render
    setTimeout(() => {
      if (editorRef.current) {
        const editable = editorRef.current.querySelector('.ck-editor__editable_inline')
        if (editable) {
          editable.style.height = (editorRef.current.offsetHeight - 80) + 'px'
        }
      }
    }, 300)
  }, [t0])

  // Called when user hits the X button or backdrop
  const handleClose = () => {
    // Propagate update back up
    onUpdate({ ...task, title, content })
    onClose()
  }

  const handleDelete = () => {
    taskApi.delete(boardId, task.id)
      .then(_ => {
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
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={!!task}>
        <Box sx={{
          ...baseStyle,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: isMobile ? '90vw' : '50%',
          height: isMobile ? '90vh' : '80%',
          outline: 'none',
          display: 'flex', flexDirection: 'column'
        }}>
          {/* Top actions: Delete & Save/Close */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleDelete} color='error'>
              <DeleteOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleClose} sx={{ ml: 1 }}>
              <CloseOutlinedIcon />
            </IconButton>
          </Box>

          {/* Title, date, editor */}
          <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <TextField
              fullWidth
              variant='outlined'
              placeholder='Untitled'
              value={title}
              onChange={updateTitle}
              sx={{
                mb: 1,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 700
                }
              }}
            />
            <Typography variant='body2' fontWeight={700}>
              {Moment(task.createdAt).format('YYYY-MM-DD')}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box ref={editorRef} sx={{ flex: 1, overflow: 'auto' }}>
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
