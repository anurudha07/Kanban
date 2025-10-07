import React, { useEffect, useState } from 'react'
import { Box, ListItem, ListItemButton, Typography, useTheme, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import boardApi from '../../api/boardApi'
import { setFavouriteList } from '../../redux/features/favouriteSlice'

const FavouriteList = () => {
  const dispatch = useDispatch()
  const raw = useSelector((s) => s.favourites.value)
  const list = Array.isArray(raw) ? raw : []
  const [activeIdx, setActiveIdx] = useState(0)
  const { boardId } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

 
  useEffect(() => {
    boardApi.getFavourites()
      .then((res) => dispatch(setFavouriteList(res)))
      .catch((err) => console.error(err))
  }, [dispatch, list])

  useEffect(() => {
    setActiveIdx(list.findIndex((e) => e.id === boardId))
  }, [list, boardId])

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return
    const newList = Array.from(list)
    const [moved] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, moved)
    dispatch(setFavouriteList(newList))
    boardApi.updateFavouritePosition({ boards: newList }).catch((err) => console.error(err))
  }

  return (
    <>
      <ListItem sx={{ px: isMobile ? 1 : 2, py: 1 }}>
        <Typography variant="subtitle2" fontWeight="700">
          Favourites
        </Typography>
      </ListItem>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fav-list">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {list.map((item, idx) => (
                <Draggable key={item.id} draggableId={item.id} index={idx}>
                  {(prov, snap) => (
                    <ListItemButton
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      component={Link}
                      to={`/boards/${item.id}`}
                      selected={idx === activeIdx}
                      sx={{
                        pl: isMobile ? 2 : 3,
                        py: isMobile ? 0.5 : 1,
                        borderRadius: 1,
                        mb: 0.5,
                        bgcolor: snap.isDragging ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Typography variant={isMobile ? 'body2' : 'body1'} fontWeight={600} noWrap>
                        {item.icon} {item.title}
                      </Typography>
                    </ListItemButton>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </>
  )
}

export default FavouriteList