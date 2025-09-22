import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // enterprise blue
    },
    secondary: {
      main: "#ff9800", // accent orange
    },
    background: {
      default: "#f4f6f8 ",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
