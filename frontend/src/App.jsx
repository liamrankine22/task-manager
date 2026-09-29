import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material';
import { router } from './Routes.jsx';
import { UserProvider, useUser } from "./UserContext.jsx";
import { ToastProvider } from "./ToastContext.jsx";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#8b5cf6' },
  },
});

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ThemeProvider>
    </UserProvider>
  );
}

function AppContent() {
  const { loading } = useUser();

  if (loading) return null; // or a spinner — avoids flashing the login page

  return <RouterProvider router={router} />;
}

export default App;