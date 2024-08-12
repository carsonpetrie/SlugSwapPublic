// Primary: Benjamin Moore Blue Note https://hextoral.com/hex-color/414C55/benjamin-moore/
// Secondary: Primary Yellow Coated UCSC https://communications.ucsc.edu/visual-design/color/
import { createTheme } from '@mui/material/styles';
const homeTheme = createTheme({
  palette: {
    primary: {
      main: '#414C55',
      dark: '#2d353b',
      light: '#676f77',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fdc700',
      dark: '#b18b00',
      light: '#fdd233',
      contrastText: '#000',
    },
  },
});

export default homeTheme;