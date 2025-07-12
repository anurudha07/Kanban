import React, { useState, useEffect } from 'react'
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputBase,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Slide,
  useScrollTrigger
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import boardApi from '../../api/boardApi'
import { setBoards, addBoard, updateBoard, removeBoard } from '../../redux/features/boardSlice'
import { setFavouriteList } from '../../redux/features/favouriteSlice'

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger()
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>
}

const Sidebar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isMobile)
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const boards = useSelector(s => s.board.value || [])
  const favourites = useSelector(s => s.favourites.value || [])

  useEffect(() => {
    boardApi.getAll().then(res => dispatch(setBoards(res))).catch(console.error)
    boardApi.getFavourites().then(res => dispatch(setFavouriteList(res))).catch(console.error)
  }, [dispatch])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleAdd = () => {
    const placeholder = { id: `temp-${Date.now()}`, title: 'Untitled', icon: '' }
    dispatch(addBoard(placeholder))
    navigate(`/boards/${placeholder.id}`)
    boardApi.create()
      .then(real => {
        dispatch(updateBoard(real))
        navigate(`/boards/${real.id}`)
      })
      .catch(() => {
        dispatch(removeBoard(placeholder.id))
        navigate('/')
      })
  }

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return
    const updated = Array.from(boards)
    const [moved] = updated.splice(source.index, 1)
    updated.splice(destination.index, 0, moved)
    dispatch(setBoards(updated))
    boardApi.updatePosition({ boards: updated }).catch(console.error)
  }

  const filterBoards = list =>
    list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

  const drawerWidth = 280

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { width: 0, height: 0 }
        }}
      >
        <Box sx={{ m: 2, p: '4px 8px', display: 'flex', alignItems: 'center', bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
          <SearchIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <InputBase placeholder="Search boards…" value={search} onChange={e => setSearch(e.target.value)} fullWidth sx={{ fontSize: '0.8rem' }} />
        </Box>

        <Typography sx={{ mx: 3, mt: 1, mb: 0.5, fontWeight: 600, fontSize: '0.8rem', color: theme.palette.text.secondary }}>
          FAVOURITES
        </Typography>
        <List dense sx={{ px: 1 }}>
          {filterBoards(favourites).map(b => (
            <ListItem
              key={b.id}
              component={Link}
              to={`/boards/${b.id}`}
              button
              selected={b.id === boardId}
              sx={{ mx: 0, borderRadius: 50 }}
            >
              <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary={b.title} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ px: 3, py: 1, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ flexGrow: 1, fontWeight: 600, fontSize: '0.8rem', color: theme.palette.text.secondary }}>
            PRIVATE
          </Typography>
          <IconButton onClick={handleAdd} size="small"><AddIcon /></IconButton>
        </Box>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="boards">
            {provided => (
              <List ref={provided.innerRef} {...provided.droppableProps} dense>
                {filterBoards(boards).map((b, i) => (
                  <Draggable key={b.id} draggableId={b.id} index={i}>
                    {prov => (
                      <ListItem
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        component={Link}
                        to={`/boards/${b.id}`}
                        button
                        selected={b.id === boardId}
                        sx={{ mx: 0, borderRadius: 50 }}
                      >
                        <ListItemIcon><Typography variant="body2">{b.icon}</Typography></ListItemIcon>
                        <ListItemText primary={b.title} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Box>

      <Divider />
      <Box sx={{
        px: 2,
        py: 1,
        position: 'sticky',
        bottom: 0,
        bgcolor: theme.palette.background.paper,
        zIndex: 1
      }}>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2' }} />
        </ListItem>
      </Box>
    </Box>
  )

  return (
    <>
      {isMobile && (
        <HideOnScroll>
          <AppBar position="fixed" sx={{ bgcolor: '#000401' }}>
            <Toolbar sx={{ minHeight: 67 }}>
              <IconButton onClick={() => setOpen(true)} sx={{ color: '#fff' }}><MenuIcon /></IconButton>
              <Typography variant="subtitle1" sx={{ flexGrow: 1, color: '#fff', ml: 1 }}>Kanban</Typography>
              <IconButton onClick={handleLogout} sx={{ color: '#fff' }}><LogoutIcon /></IconButton>
            </Toolbar>
          </AppBar>
        </HideOnScroll>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setOpen(false)}
        disableScrollLock
        transitionDuration={{ enter: 300, exit: 300 }}
        SlideProps={{ timeout: 300, easing: { enter: theme.transitions.easing.easeOut, exit: theme.transitions.easing.easeIn } }}
        ModalProps={{ keepMounted: true }}
        BackdropProps={{ style: { backdropFilter: isMobile ? 'blur(3px)' : 'none' } }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: theme.shadows[4],
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transitionProperty: 'transform',
            transitionDuration: '300ms',
            transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
            transform: 'translateZ(0)',
            overflow: 'hidden',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2.8, justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Kanban</Box>
          {isMobile && <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>}
        </Box>
        {content}
      </Drawer>
    </>
  )
}

export default Sidebar
