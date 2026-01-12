import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Container, Typography, Tabs, Tab, Box, CssBaseline, AppBar, Toolbar,
  IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Divider, Fab, Zoom, CircularProgress, Alert, Snackbar, Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HelpIcon from '@mui/icons-material/Help';
import GenerateQuiz from './components/GenerateQuiz';
import QuizHistory from './components/QuizHistory';
import QuizModal from './components/QuizModal';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Professional blue
      light: '#3b82f6',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#64748b', // Professional gray
      light: '#94a3b8',
      dark: '#475569',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: '#059669',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
  },
});

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const themeMaterial = useTheme();
  const isMobile = useMediaQuery(themeMaterial.breakpoints.down('md'));

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === '1') {
          event.preventDefault();
          setActiveTab(0);
        } else if (event.key === '2') {
          event.preventDefault();
          setActiveTab(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (isMobile) setDrawerOpen(false);
  };

  const handleShowDetails = (quiz) => {
    setModalData(quiz);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  const handleGenerateQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setSnackbar({
      open: true,
      message: 'Quiz generated successfully!',
      severity: 'success'
    });
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const menuItems = [
    { text: 'Generate Quiz', icon: <CreateIcon />, index: 0 },
    { text: 'Past Quizzes', icon: <HistoryIcon />, index: 1 },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <MenuBookIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Wiki Quiz Generator
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-Powered Learning Platform
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.index}
            onClick={() => handleTabChange(null, item.index)}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              '&:hover': { backgroundColor: 'primary.light', color: 'white' },
              backgroundColor: activeTab === item.index ? 'primary.main' : 'transparent',
              color: activeTab === item.index ? 'white' : 'text.primary',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            color: '#1e293b',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Toolbar>
            {isMobile && (
              <IconButton
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <MenuBookIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              Wiki Quiz Generator
            </Typography>
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  AI-Powered Learning
                </Typography>
                <Tooltip title="Keyboard shortcuts: Ctrl+1 (Generate), Ctrl+2 (History)">
                  <IconButton color="primary" size="small">
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: '#ffffff',
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            },
          }}
        >
          {drawer}
        </Drawer>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          {!isMobile && (
            <Box sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 4,
              background: 'white',
              borderRadius: 3,
              p: 1,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="quiz tabs"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    minHeight: 48,
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.04)' },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: 'primary.main',
                  },
                }}
              >
                <Tab
                  icon={<CreateIcon />}
                  iconPosition="start"
                  label="Generate Quiz"
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  icon={<HistoryIcon />}
                  iconPosition="start"
                  label="Past Quizzes"
                  sx={{ minHeight: 48 }}
                />
              </Tabs>
            </Box>
          )}

          <Box sx={{ position: 'relative', minHeight: '60vh' }}>
            {loading && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 9999,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={80} sx={{ color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    Generating AI Quiz...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Analyzing Wikipedia article and creating questions
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ opacity: loading ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
              {activeTab === 0 && (
                <GenerateQuiz
                  currentQuiz={currentQuiz}
                  loading={loading}
                  onGenerate={handleGenerateQuiz}
                  onLoading={handleLoading}
                  onError={showSnackbar}
                />
              )}
              {activeTab === 1 && <QuizHistory onShowDetails={handleShowDetails} />}
            </Box>
          </Box>
        </Container>

        {/* Floating Action Button for Mobile */}
        {isMobile && (
          <Zoom in={activeTab === 0}>
            <Tooltip title="Generate New Quiz">
              <Fab
                color="primary"
                onClick={() => setActiveTab(0)}
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                }}
              >
                <CreateIcon />
              </Fab>
            </Tooltip>
          </Zoom>
        )}

        {modalOpen && (
          <QuizModal
            quiz={modalData}
            onClose={handleCloseModal}
          />
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;