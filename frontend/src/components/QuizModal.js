import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress } from '@mui/material';
import QuizView from './QuizView';

function QuizModal({ quiz: initialQuiz, onClose }) {
  const [quiz, setQuiz] = useState(initialQuiz);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuiz.quiz) {
      setLoading(true);
      axios.get(`http://localhost:8001/quiz/${initialQuiz.id}`)
        .then(response => {
          setQuiz(response.data);
        })
        .catch(err => {
          console.error('Failed to fetch quiz details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [initialQuiz]);

  return (
    <Dialog 
      open={true} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 2, maxHeight: '90vh' } }}
    >
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold', borderRadius: '8px 8px 0 0' }}>
        Quiz Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress sx={{ color: 'primary.main' }} />
          </Box>
        ) : (
          quiz && <QuizView quiz={quiz} />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuizModal;