import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', pt: 2,}} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        SlugSwap
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Remember to buy and sell responsibly!
      </Typography>
    </Box>
  )
}