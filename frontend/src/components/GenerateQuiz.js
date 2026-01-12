import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField, Button, Box, Alert, CircularProgress, Paper, Typography,
  LinearProgress, Card, CardContent, InputAdornment,
  Chip, Stack
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';
import QuizView from './QuizView';

function GenerateQuiz({ currentQuiz, loading, onGenerate, onLoading, onError }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [urlValid, setUrlValid] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const validateUrl = (inputUrl) => {
    const wikiRegex = /^https:\/\/en\.wikipedia\.org\/wiki\/.+/;
    return wikiRegex.test(inputUrl);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setUrlValid(validateUrl(newUrl));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLoading(true);
    setError('');
    setProgress(0);
    setCurrentStep('Initializing...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      setCurrentStep('📡 Connecting to Wikipedia...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setCurrentStep('📄 Scraping article content...');
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setCurrentStep('🤖 Analyzing with AI...');
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1200));

      setCurrentStep('🧠 Generating quiz questions...');
      setProgress(80);

      const response = await axios.post('http://localhost:8001/generate-quiz', { url });

      clearInterval(progressInterval);
      setProgress(100);
      setCurrentStep('✅ Quiz generated successfully!');

      await new Promise(resolve => setTimeout(resolve, 500));

      onGenerate(response.data);
      if (onError) onError('Quiz generated successfully! 🎉', 'success');

    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while generating the quiz');
      if (onError) onError('Failed to generate quiz. Please try again.', 'error');
    } finally {
      onLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

  const exampleUrls = [
    { title: 'Alan Turing', url: 'https://en.wikipedia.org/wiki/Alan_Turing' },
    { title: 'Python Programming', url: 'https://en.wikipedia.org/wiki/Python_(programming_language)' },
    { title: 'Machine Learning', url: 'https://en.wikipedia.org/wiki/Machine_learning' },
  ];

  return (
    <Box>
      {!currentQuiz && (
        <Card elevation={0} sx={{
          mb: 4,
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 3
        }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AutoAwesomeIcon sx={{ fontSize: 64, mb: 2, opacity: 0.9 }} />
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              AI-Powered Quiz Generator
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, maxWidth: 600, mx: 'auto' }}>
              Transform any Wikipedia article into an interactive quiz using advanced AI technology
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip icon={<ArticleIcon />} label="Wikipedia Articles" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip icon={<AutoAwesomeIcon />} label="Gemini AI" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              <Chip icon={<QuizIcon />} label="Smart Questions" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            </Stack>
          </CardContent>
        </Card>
      )}

      <Paper elevation={0} sx={{
        p: 4,
        borderRadius: 3,
        background: 'white',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
          Generate New Quiz
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Wikipedia Article URL"
            placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
            value={url}
            onChange={handleUrlChange}
            required
            variant="outlined"
            error={url && !urlValid}
            helperText={url && !urlValid ? "Please enter a valid Wikipedia URL (https://en.wikipedia.org/wiki/...)" : "Enter any Wikipedia article URL to generate a quiz"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon color={urlValid ? "primary" : "action"} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !urlValid}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                minWidth: 160,
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  <AutoAwesomeIcon sx={{ mr: 1 }} />
                  Generate Quiz
                </>
              )}
            </Button>

            {urlValid && !loading && (
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 'medium' }}>
                ✓ Valid Wikipedia URL
              </Typography>
            )}
          </Box>
        </Box>

        {/* Example URLs */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
            Try these examples:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {exampleUrls.map((example, idx) => (
              <Chip
                key={idx}
                label={example.title}
                onClick={() => setUrl(example.url)}
                variant="outlined"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                }}
              />
            ))}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ mt: 3, p: 3, backgroundColor: 'rgba(99, 102, 241, 0.04)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={32} sx={{ color: 'primary.main', mr: 2 }} />
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                {currentStep}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 'primary.main',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              This may take 10-20 seconds depending on the article length
            </Typography>
          </Box>
        )}

        {currentQuiz && !loading && (
          <Box>
            <QuizView quiz={currentQuiz} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default GenerateQuiz;