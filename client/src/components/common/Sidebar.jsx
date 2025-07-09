import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography, useTheme, useMediaQuery } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useNavigate, useParams } from 'react-router-dom'
import assets from '../../assets'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import FavouriteList from './FavouriteList'

const Sidebar = () => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isXs)
  const user = useSelector(state => state.user.value)
  const boards = useSelector(state => state.board.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const width = isXs ? '80%' : 250

  useEffect(() => { /* fetch boards */ }, [dispatch])
  useEffect(() => { /* default navigate and activeIndex */ }, [boards, boardId])

  return (
    <>
      {isXs && (
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', top: theme.spacing(1), left: theme.spacing(1), zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer
        variant={isXs ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width,
            boxSizing: 'border-box',
            background: `linear-gradient(180deg, ${assets.colors.secondary} 0%, ${assets.colors.primary} 100%)`,
            color: 'white',
            p: 2
          }
        }}
      >
        <List disablePadding>
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h6' noWrap>{user.username}</Typography>
              <IconButton onClick={() => {/* logout */}}><LogoutOutlinedIcon /></IconButton>
            </Box>
          </ListItem>
          <FavouriteList />
          <ListItem>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Private</Typography>
              <IconButton onClick={() => {/* addBoard */}}><AddBoxOutlinedIcon /></IconButton>
            </Box>
          </ListItem>
          <DragDropContext onDragEnd={() => {/* onDragEnd */}}>
            <Droppable droppableId='boards'>
              {(prov) => (
                <Box ref={prov.innerRef} {...prov.droppableProps}>
                  {boards.map((b, i) => (
                    <Draggable key={b.id} draggableId={b.id} index={i}>
                      {(p, s) => (
                        <ListItemButton
                          ref={p.innerRef}
                          {...p.draggableProps}
                          {...p.dragHandleProps}
                          component={Link}
                          to={`/boards/${b.id}`}
                          selected={b.id === boardId}
                          sx={{ pl: 3, mt: 0.5, borderRadius: 2 }}
                        >
                          <Typography noWrap>{b.icon} {b.title}</Typography>
                        </ListItemButton>
                      )}
                    </Draggable>
                  ))}
                  {prov.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar
