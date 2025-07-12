import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { setBoards, addBoard, updateBoard } from '../../redux/features/boardSlice'
import { setFavouriteList } from '../../redux/features/favouriteSlice'

const HideOnScroll = React.memo(({ children }) => {
  const trigger = useScrollTrigger()
  return <Slide appear={false} direction="down" in={!trigger}>{children}</Slide>
})

const Sidebar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isMobile)
  const [search, setSearch] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { boardId } = useParams()
  const boards = useSelector(state => state.board.value || [])
  const favourites = useSelector(state => state.favourites.value || [])

  useEffect(() => {
    Promise.all([boardApi.getAll(), boardApi.getFavourites()])
      .then(([all, favs]) => {
        dispatch(setBoards(all))
        dispatch(setFavouriteList(favs))
      })
      .catch(console.error)
  }, [dispatch])

  const handleAdd = useCallback(() => {
    boardApi.create()
      .then(realBoard => {
        dispatch(addBoard(realBoard))
        navigate(`/boards/${realBoard.id}`)
      })
      .catch(console.error)
  }, [dispatch, navigate])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token')
    navigate('/login')
  }, [navigate])

  const onDragEnd = useCallback(({ source, destination }) => {
    if (!destination) return
    const reordered = Array.from(boards)
    const [moved] = reordered.splice(source.index, 1)
    reordered.splice(destination.index, 0, moved)
    dispatch(setBoards(reordered))
    boardApi.updatePosition({ boards: reordered }).catch(console.error)
  }, [boards, dispatch])

  const filteredFavourites = useMemo(
    () => favourites.filter(b => b.title.toLowerCase().includes(search.toLowerCase())),
    [favourites, search]
  )
  const filteredBoards = useMemo(
    () => boards.filter(b => b.title.toLowerCase().includes(search.toLowerCase())),
    [boards, search]
  )

  const drawerWidth = 285

  const content = (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
    {/* Sticky header: search, favourites, private */}
    <Box sx={{ 
      position: 'sticky',
      top: 0,
      zIndex: 2,
      bgcolor: theme.palette.background.paper,
      pt: 0,
      pb: 0.5
    }}>
      {/* Search */}
      <Box sx={{
        mx: 2.2,
        my: 2,
        px: 1,
        py: 0.6,
        display: 'flex',
        alignItems: 'center',
        height: 40, 
        bgcolor: alpha(theme.palette.primary.main, 0),
        borderRadius: 1
      }}>
        <SearchIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
        <InputBase
          placeholder="Search boards…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ fontSize: '0.9rem', lineHeight: 1 }}
        />
      </Box>

        <Typography sx={{ mx: 2.8, mt: 1, mb: 0.5, fontWeight: 400, fontSize: '0.8rem', color: theme.palette.text.secondary }}>
          FAVOURITES
        </Typography>
        <Box sx={{ px: 3, maxHeight: 116, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <List dense>
            {filteredFavourites.map(b => (
              <ListItem
                key={b.id}
                component={Link}
                to={`/boards/${b.id}`}
                button
                selected={b.id === boardId}
                sx={{
                  borderRadius: 50,
                  '&:hover': {
                    bgcolor: '#000000', 
                    color: '#fff',
                    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                     color: '#fff',
                   },
                 }
                }}
              >
                <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary={b.title} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 1 }} />
        <Box sx={{ px: 3, py: 0.5, display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ flexGrow: 1, fontWeight: 400, fontSize: '0.8rem', color: theme.palette.text.secondary }}>
            PRIVATE
          </Typography>
          <IconButton onClick={handleAdd} size="small"><AddIcon /></IconButton>
        </Box>
      </Box>

      {/* Scrollable boards list */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="boards">
            {provided => (
              <List ref={provided.innerRef} {...provided.droppableProps} dense sx={{ px: 1.5, pt: 0 }}>
                {filteredBoards.map((b, i) => (
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
                      sx={{
                          borderRadius: 50,
                          '&:hover': {
                          bgcolor: '#000000',
                          color: '#fff',
                          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                          color: '#fff',
                          },
                         }
                       }}
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
      <Box sx={{ px: 2, py: 1, position: 'sticky', bottom: 0, bgcolor: theme.palette.background.paper, zIndex: 1 }}>
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
        PaperProps={{ sx: { width: drawerWidth, borderRight: 'none', boxShadow: theme.shadows[4], overflow: 'hidden' } }}
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

export default React.memo(Sidebar)
