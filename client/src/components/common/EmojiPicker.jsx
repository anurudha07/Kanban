import React, { useState, useEffect, useRef } from 'react'
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
  const anchorRef = useRef(null)

  useEffect(() => {
    setEmoji(icon)
  }, [icon])

  const handleSelect = e => {
    setEmoji(e.native)
    setOpen(false)
    onChange?.(e.native)
  }

  return (
    <Box ref={anchorRef} sx={{ position: 'relative', display: 'inline-block' }}>
      <IconButton
        onClick={() => setOpen(o => !o)}
        size="small"
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          width: isMobile ? 36 : 40,
          height: isMobile ? 36 : 40,
          fontSize: isMobile ? '1rem' : '1.25rem',
          bgcolor: theme.palette.background.paper,
          transition: '0.2s',
          '&:hover': { bgcolor: theme.palette.action.hover }
        }}
      >
        {emoji || '😀'}
      </IconButton>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-start"
        disablePortal={false}
        modifiers={[{ name: 'preventOverflow', enabled: true, options: { padding: 8 } }]}
        sx={{ zIndex: theme.zIndex.modal + 1 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper
            elevation={3}
            sx={{
              mt: 0.5,
              width: isMobile ? '80vw' : 350,
              maxHeight: isMobile ? '50vh' : '60vh',
              overflow: 'auto',
              borderRadius: 1.5,
              p: 0.5,
              bgcolor:
                theme.palette.mode === 'dark'
                  ? theme.palette.background.default
                  : theme.palette.background.paper
            }}
          >
            <Picker
              theme={theme.palette.mode}
              onSelect={handleSelect}
              showPreview={false}
              showSkinTones={false}
              perLine={isMobile ? 7 : 10}
              emojiSize={19}
              title=""
              style={{ border: 'none', background: 'transparent' }}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  )
}

export default EmojiPicker
