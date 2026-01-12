import React, { useState } from 'react';
import { 
  Typography, Box, Card, CardContent, Chip, List, ListItem, ListItemText, 
  Accordion, AccordionSummary, AccordionDetails, Button, Grid, Link, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QuizInterface from './QuizInterface';

function QuizView({ quiz }) {
  const [quizMode, setQuizMode] = useState(false); // false = overview, true = taking quiz
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  const handleStartQuiz = () => {
    setQuizMode(true);
  };

  const handleQuizComplete = (score) => {
    setFinalScore(score);
    setQuizCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizMode(false);
    setQuizCompleted(false);
    setFinalScore(null);
  };

  const handleGoHome = () => {
    setQuizMode(false);
    setQuizCompleted(false);
    setFinalScore(null);
    // This would need to be handled by parent component
    window.location.reload(); // Simple way to reset
  };

  if (quizMode && !quizCompleted) {
    return <QuizInterface quiz={quiz} onComplete={handleQuizComplete} />;
  }

  if (quizCompleted) {
    return (
      <Dialog open={quizCompleted} maxWidth="md" fullWidth>
        <DialogTitle>Quiz Completed!</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom align="center">
            Your Score: {finalScore} / {quiz.quiz.length}
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            {((finalScore / quiz.quiz.length) * 100).toFixed(1)}% Correct
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>Review Your Answers:</Typography>
            {quiz.quiz.map((q, idx) => (
              <Card key={idx} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {idx + 1}. {q.question}
                  </Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                    Correct Answer: {q.answer}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRetakeQuiz} variant="outlined">
            Retake Quiz
          </Button>
          <Button onClick={handleGoHome} variant="contained">
            Go to Home
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      {/* Article Header */}
      <Card sx={{ mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {quiz.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
            {quiz.summary}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              href={quiz.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
            >
              View Original Article →
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Take Quiz Button */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleStartQuiz}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: 2,
          }}
        >
          Start Quiz ({quiz.quiz?.length || 0} Questions)
        </Button>
      </Box>

      {/* Related Topics */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
            Related Topics
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quiz.related_topics?.map((topic, idx) => (
              <Chip
                key={idx}
                label={topic}
                color="primary"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontWeight: 'medium',
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                }}
              />
            )) || <Typography variant="body2" color="text.secondary">No related topics found</Typography>}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default QuizView;