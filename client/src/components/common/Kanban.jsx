import { Box, Button, Typography, Divider, TextField, IconButton, Card, useTheme, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'
import TaskModal from './TaskModal'

let timer
const timeout = 500

const Kanban = props => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const boardId = props.boardId
  const [data, setData] = useState([])
  const [selectedTask, setSelectedTask] = useState()

  useEffect(() => setData(props.data), [props.data])

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return
    const srcIdx = data.findIndex(e => e.id === source.droppableId)
    const dstIdx = data.findIndex(e => e.id === destination.droppableId)
    const newData = [...data]
    const sourceTasks = [...newData[srcIdx].tasks]
    const destTasks = [...newData[dstIdx].tasks]
    if (source.droppableId !== destination.droppableId) {
      const [moved] = sourceTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, moved)
      newData[srcIdx].tasks = sourceTasks
      newData[dstIdx].tasks = destTasks
    } else {
      const [moved] = destTasks.splice(source.index, 1)
      destTasks.splice(destination.index, 0, moved)
      newData[dstIdx].tasks = destTasks
    }
    try {
      await taskApi.updatePosition(boardId, {
        resourceList: sourceTasks,
        destinationList: destTasks,
        resourceSectionId: data[srcIdx].id,
        destinationSectionId: data[dstIdx].id
      })
      setData(newData)
    } catch (err) {
      alert(err)
    }
  }

  // ... createSection, deleteSection, updateSectionTitle, createTask, onUpdateTask, onDeleteTask ...

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Button onClick={() => {/* createSection */}}>
          Add section
        </Button>
        <Typography variant='body2' fontWeight='700'>
          {data.length} Sections
        </Typography>
      </Box>
      <Divider sx={{ mb: 1 }} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{
          display: 'flex',
          flexDirection: isXs ? 'column' : 'row',
          overflowX: isXs ? 'visible' : 'auto',
          gap: 1,
          px: 1
        }}>
          {data.map(section => (
            <Droppable key={section.id} droppableId={section.id}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    flex: isXs ? 'none' : '0 0 300px',
                    width: isXs ? '100%' : 300,
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1
                  }}
                >
                  {/* section header with TextField, Add, Delete icons */}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </Box>
      </DragDropContext>
      <TaskModal
        task={selectedTask}
        boardId={boardId}
        onClose={() => setSelectedTask(undefined)}
        onUpdate={() => {/* onUpdateTask */}}
        onDelete={() => {/* onDeleteTask */}}
      />
    </>
  )
}

export default Kanban
