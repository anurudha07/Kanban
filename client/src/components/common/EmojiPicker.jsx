import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'

const EmojiPicker = props => {
  const theme = useTheme()
  const isXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectedEmoji, setSelectedEmoji] = useState()
  const [isShowPicker, setIsShowPicker] = useState(false)

  useEffect(() => {
    setSelectedEmoji(props.icon)
  }, [props.icon])

  const selectEmoji = (e) => {
    const sym = e.unified.split('-')
    const codesArray = sym.map(el => '0x' + el)
    const emoji = String.fromCodePoint(...codesArray)
    setIsShowPicker(false)
    props.onChange(emoji)
  }

  const showPicker = () => setIsShowPicker(!isShowPicker)

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant='h3'
        fontWeight='700'
        sx={{ cursor: 'pointer' }}
        onClick={showPicker}
      >
        {selectedEmoji}
      </Typography>
      <Box sx={{
        display: isShowPicker ? 'block' : 'none',
        position: 'absolute',
        top: isXs ? 'auto' : '100%',
        bottom: isXs ? 0 : 'auto',
        left: isXs ? 0 : 'auto',
        width: isXs ? '100vw' : 'auto',
        height: isXs ? '50vh' : 'auto',
        zIndex: 9999
      }}>
        <Picker theme='dark' onSelect={selectEmoji} showPreview={false} />
      </Box>
    </Box>
  )
}

export default EmojiPicker
