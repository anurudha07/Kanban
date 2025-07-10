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
  alpha
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
  const user = useSelector(s => s.user.value)

  // Fetch on mount
  useEffect(() => {
    boardApi.getAll().then(res => dispatch(setBoards(res))).catch(console.error)
    boardApi.getFavourites().then(res => dispatch(setFavouriteList(res))).catch(console.error)
  }, [dispatch])

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }
  const handleAdd = async () => {
    try {
      const nb = await boardApi.create()
      dispatch(addBoard(nb))
      navigate(`/boards/${nb.id}`)
    } catch (e) {
      console.error(e)
    }
  }

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return
    const updated = Array.from(boards)
    const [moved] = updated.splice(source.index, 1)
    updated.splice(destination.index, 0, moved)
    dispatch(setBoards(updated))
    boardApi.updatePosition({ boards: updated }).catch(console.error)
  }

  // Filter for search
  const filterBoards = list =>
    list.filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

  const drawerWidth = 280

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: theme.palette.background.paper }}>
      {/* Search */}
      <Box sx={{
        m: 2, p: '4px 8px', display: 'flex', alignItems: 'center',
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        borderRadius: 1
      }}>
        <SearchIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
        <InputBase
          placeholder="Search boards…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          fullWidth
          sx={{ fontSize: '0.8rem' }}
        />
      </Box>

      {/* Favorites */}
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
            sx={{
              mx: 0, borderRadius: 50,
              '&.Mui-selected': { bgcolor: '#1b1c1c#3d3d3d', color: '#fff' },
              '&:hover': { bgcolor: '#000000' }
            }}
          >
            <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary={b.title}
              primaryTypographyProps={{ noWrap: true, variant: 'body2' }}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* Private */}
      <Box sx={{ px: 3, py: 1, display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ flexGrow: 1, fontWeight: 600, fontSize: '0.8rem', color: theme.palette.text.secondary }}>
          PRIVATE
        </Typography>
        <IconButton onClick={handleAdd} size="small" color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
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
                        sx={{
                          mx: 0, borderRadius: 50,
                          '&.Mui-selected': { bgcolor: '#000000' },
                          '&:hover': { bgcolor: '#000000' }
                        }}
                      >
                        <ListItemIcon>
                          <Typography variant="body2">{b.icon}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={b.title}
                          primaryTypographyProps={{ noWrap: true, variant: 'body2' }}
                        />
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

      {/* Logout */}
      <ListItem button onClick={handleLogout} sx={{ mt: 1 }}>
        <ListItemIcon><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2' }} />
      </ListItem>
    </Box>
  )

  return (
    <>
      {isMobile && (
        <AppBar position="fixed" sx={{ bgcolor: '#000401' }}>
          <Toolbar sx={{ minHeight: 67 }}>
            <IconButton onClick={() => setOpen(true)} sx={{ color: '#fff' }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ flexGrow: 1, color: '#fff', ml: 1 }}>
              Kanban
            </Typography>
            <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        BackdropProps={{
         style: {
           backdropFilter: isMobile ? 'blur(3px)' : 'none'
         }
       }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            borderRight: 'none',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        {/* Sidebar top logo and (close icon on mobile only) */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 2.8, justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: '1.3rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
            Kanban
          </Box>
          {isMobile && (
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {content}
      </Drawer>
    </>
  )
}

export default Sidebar
