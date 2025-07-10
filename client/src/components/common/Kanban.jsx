import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Divider,
  TextField,
  IconButton,
  Card,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import sectionApi from '../../api/sectionApi'
import taskApi from '../../api/taskApi'
import TaskModal from './TaskModal'

const Kanban = ({ data, boardId, onSectionsChange }) => {
  const [sections, setSections] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setSections(data || [])
  }, [data])

  const updateAndNotify = newSecs => {
    setSections(newSecs)
    onSectionsChange(newSecs)
  }

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return
    const secs = [...sections]
    const srcIdx = secs.findIndex(s => s.id === source.droppableId)
    const dstIdx = secs.findIndex(s => s.id === destination.droppableId)
    const src = { ...secs[srcIdx] }
    const dst = { ...secs[dstIdx] }
    const [moved] = src.tasks.splice(source.index, 1)
    dst.tasks.splice(destination.index, 0, moved)
    secs[srcIdx] = src
    secs[dstIdx] = dst
    updateAndNotify(secs)
    try {
      await taskApi.updatePosition(boardId, {
        resourceList: src.tasks,
        destinationList: dst.tasks,
        resourceSectionId: src.id,
        destinationSectionId: dst.id,
      })
    } catch (err) {
      console.error(err)
    }
  }

  const createSection = () =>
    sectionApi
      .create(boardId)
      .then(s => updateAndNotify([...sections, s]))
      .catch(console.error)

  const deleteSection = id =>
    sectionApi
      .delete(boardId, id)
      .then(() => updateAndNotify(sections.filter(s => s.id !== id)))
      .catch(console.error)

  const renameSection = (id, title) => {
    const updated = sections.map(s => (s.id === id ? { ...s, title } : s))
    updateAndNotify(updated)
    sectionApi.update(boardId, id, { title }).catch(console.error)
  }

  // Create task and immediately open modal for renaming/details
  const createTask = sectionId =>
    taskApi
      .create(boardId, { sectionId })
      .then(task => {
        const updated = sections.map(s =>
          s.id === sectionId ? { ...s, tasks: [task, ...s.tasks] } : s
        )
        updateAndNotify(updated)
        setSelectedTask(task)
      })
      .catch(console.error)

  const onUpdateTask = updatedTask => {
    const updated = sections.map(s =>
      s.id === updatedTask.section.id
        ? { ...s, tasks: s.tasks.map(t => (t.id === updatedTask.id ? updatedTask : t)) }
        : s
    )
    updateAndNotify(updated)
  }

  const onDeleteTask = deletedTask => {
    const updated = sections.map(s =>
      s.id === deletedTask.section.id
        ? { ...s, tasks: s.tasks.filter(t => t.id !== deletedTask.id) }
        : s
    )
    updateAndNotify(updated)
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap' }}>
        <Button size={isMobile ? 'small' : 'medium'} onClick={createSection}>
          Add section
        </Button>
        <Typography fontWeight={700}>{sections.length} Sections</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'flex-start',
            overflowX: isMobile ? 'hidden' : 'auto',
            '& > div': { flex: isMobile ? '1 1 auto' : '0 0 300px', m: 0.5 },
          }}
        >
          {sections.map(sec => (
            <Droppable key={sec.id} droppableId={sec.id}>
              {provided => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    p: 2,
                    minWidth: 300,
                    maxWidth: 300,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TextField
                      size="small"
                      value={sec.title}
                      onChange={e => renameSection(sec.id, e.target.value)}
                      placeholder="Untitled"
                      sx={{ flexGrow: 1, '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                    />
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => createTask(sec.id)}>
                      <AddOutlinedIcon />
                    </IconButton>
                    <IconButton size={isMobile ? 'small' : 'medium'} onClick={() => deleteSection(sec.id)}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Box>

                  {sec.tasks.map((task, idx) => (
                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                      {dragProvided => (
                        <Card
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          onClick={() => setSelectedTask(task)}
                          sx={{ mb: 1, p: isMobile ? 1 : 2, cursor: 'grab' }}
                        >
                          <Typography noWrap>
                            {task.title
                              ? task.title
                              : task.content
                              ? task.content
                                  .replace(/<[^>]+>/g, '')
                                  .slice(0, 30) + '…'
                              : 'Untitled'}
                          </Typography>
                        </Card>
                      )}
                    </Draggable>
                  ))}

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
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
        onClose={() => setSelectedTask(null)}
      />
    </>
  )
}

export default Kanban
