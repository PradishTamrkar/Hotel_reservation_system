import {createTheme} from '@mui/material'

const theme = createTheme({
    palette: {
        primary:{
            main: '#e25117ff',
            light: '#f5a052ff',
            dark: '#742a00ff',
        },
        secondary:{
            main: '#e26666ff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
            },
        },
    },
})

export default theme;