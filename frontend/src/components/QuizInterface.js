import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Box, RadioGroup, FormControlLabel, Radio,
  Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  LinearProgress, Chip, Fade, Zoom, Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';

function QuizInterface({ quiz, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const handleAnswerChange = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    // Calculate score
    let correct = 0;
    quiz.quiz.forEach((q, idx) => {
      if (answers[idx] === q.answer) correct++;
    });

    // Save score to localStorage
    const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    const currentScore = scores[quiz.id];
    const newScore = {
      correct,
      total: quiz.quiz.length,
      percentage: Math.round((correct / quiz.quiz.length) * 100)
    };

    // Only update if this is a better score or first attempt
    if (!currentScore || newScore.percentage > currentScore.percentage) {
      scores[quiz.id] = newScore;
      localStorage.setItem('quizScores', JSON.stringify(scores));
    }

    onComplete(correct);
  };

  const currentQ = quiz.quiz[currentQuestion];
  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quiz.quiz.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Card sx={{ mb: 3, backgroundColor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {quiz.title}
          </Typography>
          <Typography variant="h6" sx={{ textAlign: 'center', opacity: 0.9 }}>
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  backgroundColor: 'white',
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Box sx={{ mb: 3 }}>
        <Stepper activeStep={currentQuestion} alternativeLabel sx={{ flexWrap: 'wrap' }}>
          {quiz.quiz.map((_, index) => (
            <Step key={index} sx={{ mb: 1 }}>
              <StepLabel
                StepIconComponent={() => (
                  answers[index] ?
                    <CheckCircleIcon sx={{ color: 'success.main' }} /> :
                    <RadioButtonUncheckedIcon sx={{ color: 'action.disabled' }} />
                )}
              >
                {index + 1}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Question Card */}
      <Zoom in={true} key={currentQuestion} timeout={500}>
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
              {currentQ.question}
            </Typography>

            <RadioGroup
              value={answers[currentQuestion] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              sx={{ mb: 3 }}
            >
              {currentQ.options.map((option, idx) => (
                <Card
                  key={idx}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    border: answers[currentQuestion] === option ? '2px solid' : '1px solid',
                    borderColor: answers[currentQuestion] === option ? 'primary.main' : 'grey.300',
                    backgroundColor: answers[currentQuestion] === option ? 'primary.50' : 'white',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => handleAnswerChange(option)}
                >
                  <CardContent sx={{ py: 2, px: 3, '&:last-child': { pb: 2 } }}>
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio
                          sx={{
                            color: 'primary.main',
                            '&.Mui-checked': { color: 'primary.main' }
                          }}
                        />
                      }
                      label={
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {option}
                        </Typography>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                startIcon={<NavigateBeforeIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' }
                }}
              >
                Previous
              </Button>

              <Chip
                label={`${answeredQuestions}/${totalQuestions} Answered`}
                color={answeredQuestions === totalQuestions ? 'success' : 'default'}
                sx={{ fontWeight: 'bold' }}
              />

              {currentQuestion === totalQuestions - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmitClick}
                  disabled={answeredQuestions !== totalQuestions}
                  endIcon={<SendIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                  }}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={nextQuestion}
                  disabled={!answers[currentQuestion]}
                  endIcon={<NavigateNextIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Next
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Zoom>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
          Ready to Submit?
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            You have answered {answeredQuestions} out of {totalQuestions} questions.
          </Alert>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowSubmitDialog(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Review Answers
          </Button>
          <Button
            onClick={confirmSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
            }}
          >
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default QuizInterface;