import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider, useTheme, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../api/taskApi'
import '../../css/custom-editor.css'

const TaskModal = props => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const boardId = props.boardId
  const [task, setTask] = useState(props.task)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorRef = useRef()

  useEffect(() => {
    setTask(props.task)
    setTitle(props.task?.title || '')
    setContent(props.task?.content || '')
    // adjust editor height...
  }, [props.task])

  const modalStyle = {
    position: 'absolute',
    top: isXs ? 0 : '50%',
    left: isXs ? 0 : '50%',
    transform: isXs ? 'none' : 'translate(-50%, -50%)',
    width: isXs ? '100vw' : '50%',
    height: isXs ? '100vh' : '80%',
    bgcolor: 'background.paper',
    p: isXs ? 1 : 2,
    outline: 'none'
  }

  return (
    <Modal
      open={!!task}
      onClose={() => props.onUpdate(task) && props.onClose()}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
    >
      <Fade in={!!task}>
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={() => {/* deleteTask */}}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: isXs ? 1 : 2 }}>
            <TextField
              value={title}
              onChange={() => {/* updateTitle */}}
              placeholder='Untitled'
              variant='outlined'
              fullWidth
              sx={{ mb: 1, '& .MuiOutlinedInput-root': { fontSize: isXs ? '1.5rem' : '2.5rem' } }}
            />
            <Typography variant='body2' fontWeight='700'>
              {task ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box ref={editorRef} sx={{ flex: 1, overflowY: 'auto' }}>
              <CKEditor editor={ClassicEditor} data={content} onChange={() => {/* updateContent */}} />
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}

export default TaskModal

