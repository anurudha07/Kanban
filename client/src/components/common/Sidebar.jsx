import { useSelector, useDispatch } from 'react-redux'
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, Typography, useTheme, useMediaQuery } from '@mui/material'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { Link, useNavigate, useParams } from 'react-router-dom'
import assets from '../../assets/index'
import { useEffect, useState } from 'react'
import boardApi from '../../api/boardApi'
import { setBoards } from '../../redux/features/boardSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import FavouriteList from './FavouriteList'

const Sidebar = () => {
  const user = useSelector((state) => state.user.value)
  const boards = useSelector((state) => state.board.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [activeIndex, setActiveIndex] = useState(0)

  const sidebarWidth = isMobile ? '80%' : 250

  // fetch boards
  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await boardApi.getAll()
        dispatch(setBoards(res))
      } catch (err) {
        alert(err)
      }
    }
    getBoards()
  }, [dispatch])

  // set active and default navigate
  useEffect(() => {
    const idx = boards.findIndex((e) => e.id === boardId)
    if (boards.length > 0 && boardId === undefined) {
      navigate(`/boards/${boards[0].id}`)
    }
    setActiveIndex(idx)
  }, [boards, boardId, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const onDragEnd = async ({ source, destination }) => {
    if (!destination) return
    const newList = Array.from(boards)
    const [moved] = newList.splice(source.index, 1)
    newList.splice(destination.index, 0, moved)
    dispatch(setBoards(newList))

    try {
      await boardApi.updatePosition({ boards: newList })
    } catch (err) {
      alert(err)
    }
  }

  const addBoard = async () => {
    try {
      const res = await boardApi.create()
      const newList = [res, ...boards]
      dispatch(setBoards(newList))
      navigate(`/boards/${res.id}`)
    } catch (err) {
      alert(err)
    }
  }

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{ position: 'fixed', top: theme.spacing(1), left: theme.spacing(1), zIndex: theme.zIndex.drawer + 1 }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        container={window.document.body}
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarWidth,
            boxSizing: 'border-box',
            background: `linear-gradient(180deg, ${assets.colors.secondary} 0%, ${assets.colors.primary} 100%)`,
            color: theme.palette.getContrastText(assets.colors.secondary),
            border: 'none',
            p: 2,
          },
        }}
      >
        <List disablePadding>
          <ListItem>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="h6" fontWeight={700} noWrap>
                {user.username}
              </Typography>
              <IconButton onClick={logout} size="small" sx={{ color: 'inherit' }}>
                <LogoutOutlinedIcon />
              </IconButton>
            </Box>
          </ListItem>
          <Box pt={1} />
          <FavouriteList />
          <Box pt={1} />

          <ListItem>
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography variant="h6" fontWeight={700} noWrap>
                Private
              </Typography>
              <IconButton onClick={addBoard} size="small" sx={{ color: 'inherit' }}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </Box>
          </ListItem>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="board-list">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {boards.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(prov, snapshot) => (
                        <ListItemButton
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          component={Link}
                          to={`/boards/${item.id}`}
                          selected={index === activeIndex}
                          sx={{
                            pl: 3,
                            mt: 0.5,
                            borderRadius: 2,
                            '&:hover': { backgroundColor: theme.palette.action.hover },
                            cursor: snapshot.isDragging ? 'grab' : 'pointer',
                          }}
                        >
                          <Typography variant="body2" fontWeight={600} noWrap>
                            {item.icon} {item.title}
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
        </List>
      </Drawer>
    </>
  )
}

export default Sidebar
