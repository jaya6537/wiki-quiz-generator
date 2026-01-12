import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Typography, Box, CircularProgress, Link, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Card, CardContent
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import config from '../config';

function QuizHistory({ onShowDetails }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [qaDialogOpen, setQaDialogOpen] = useState(false);
  const [qaLoading, setQaLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(config.ENDPOINTS.GET_QUIZZES);
      setQuizzes(response.data);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
    }
    setLoading(false);
  };

  const handleViewQA = async (quiz) => {
    setQaDialogOpen(true);
    setQaLoading(true);
    
    if (!quiz.quiz) {
      try {
        const response = await axios.get(config.ENDPOINTS.GET_QUIZ(quiz.id));
        setSelectedQuiz(response.data);
      } catch (err) {
        console.error('Failed to fetch quiz details:', err);
        setSelectedQuiz(quiz); // Fallback to basic data
      }
    } else {
      setSelectedQuiz(quiz);
    }
    
    setQaLoading(false);
  };

  const handleCloseQA = () => {
    setQaDialogOpen(false);
    setSelectedQuiz(null);
    setQaLoading(false);
  };

  // Mock score data - in a real app, this would come from the backend
  const getQuizScore = (quizId) => {
    // For demo purposes, generate a random score
    // In production, this would be stored in the database
    const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    return scores[quizId] || null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, backgroundColor: 'white', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', textAlign: 'center' }}>
          Past Quizzes
        </Typography>
        {quizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No quizzes generated yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first quiz to see it here!
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ borderRadius: '10px', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>URL</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Best Score</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => {
                  const score = getQuizScore(quiz.id);
                  return (
                    <TableRow key={quiz.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' } }}>
                      <TableCell sx={{ fontWeight: 'medium' }}>{quiz.title}</TableCell>
                      <TableCell>
                        <Link
                          href={quiz.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          View Article →
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(quiz.created_at).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {score ? (
                          <Chip
                            label={`${score.correct}/${score.total} (${score.percentage}%)`}
                            color={score.percentage >= 80 ? 'success' : score.percentage >= 60 ? 'warning' : 'error'}
                            size="small"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not taken
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => onShowDetails(quiz)}
                            startIcon={<PlayArrowIcon />}
                            sx={{
                              borderRadius: 2,
                            }}
                          >
                            Take Quiz
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleViewQA(quiz)}
                            startIcon={<VisibilityIcon />}
                            sx={{
                              borderRadius: '20px',
                              borderColor: 'primary.main',
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                            }}
                          >
                            Q&A
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Questions and Answers Dialog */}
      <Dialog
        open={qaDialogOpen}
        onClose={handleCloseQA}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
          {selectedQuiz?.title} - Questions & Answers
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {qaLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: 'primary.main' }} />
            </Box>
          ) : selectedQuiz?.quiz && selectedQuiz.quiz.length > 0 ? (
            selectedQuiz.quiz.map((q, idx) => (
              <Card key={idx} sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {idx + 1}. {q.question}
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                      Options:
                    </Typography>
                    {q.options.map((option, optIdx) => (
                      <Typography
                        key={optIdx}
                        variant="body2"
                        sx={{
                          ml: 2,
                          mb: 0.5,
                          color: option === q.answer ? 'success.main' : 'text.primary',
                          fontWeight: option === q.answer ? 'bold' : 'normal',
                          borderLeft: option === q.answer ? '3px solid' : '3px solid transparent',
                          borderLeftColor: option === q.answer ? 'success.main' : 'transparent',
                          pl: 1
                        }}
                      >
                        {String.fromCharCode(65 + optIdx)}. {option}
                      </Typography>
                    ))}
                    <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary', backgroundColor: 'grey.50', p: 2, borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No questions available for this quiz.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseQA}
            variant="contained"
            sx={{
              borderRadius: 2,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default QuizHistory;