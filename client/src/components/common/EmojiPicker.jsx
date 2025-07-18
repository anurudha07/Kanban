import React, { useState, useEffect } from 'react'
import {
  Box,
  IconButton,
  Paper,
  Popper,
  ClickAwayListener,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const EmojiPicker = ({ icon, onChange }) => {
  const [emoji, setEmoji] = useState(icon)
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    setEmoji(icon)
  }, [icon])

  const handleSelect = e => {
    setEmoji(e.native)
    setOpen(false)
    onChange(e.native)
  }

  // We’ll anchor the Popper to this box
  const anchorRef = React.useRef(null)

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        onClick={() => setOpen(o => !o)}
        size="small"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          width: isMobile ? 44 : 48,
          height: isMobile ? 44 : 48,
          fontSize: isMobile ? '1.5rem' : '1.75rem',
          bgcolor: theme.palette.background.paper
        }}
      >
        {emoji || '😀'}
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        disablePortal={false}
        modifiers={[{ name: 'preventOverflow', enabled: true, options: { padding: 16 } }]}
        sx={{ zIndex: theme.zIndex.modal + 1 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            elevation={4}
            sx={{
              mt: 1,
              width: isMobile ? '86vw' : 346,
              maxHeight: isMobile ? '60vh' : '70vh',
              overflow: 'auto',
              borderRadius: 2,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.default
                  : theme.palette.background.paper
            }}
          >
            <Picker
              theme="dark"
              onSelect={handleSelect}
              showPreview={false}
              showSkinTones={false}
              perLine={isMobile ? 8 : 9}
              emojiSize={24}
              title=""
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}

export default EmojiPicker
