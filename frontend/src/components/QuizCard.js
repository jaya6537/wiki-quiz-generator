import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Button, Box, Chip, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function QuizCard({ question, index }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Question {index + 1}
          </Typography>
          <Chip 
            label={question.difficulty} 
            color={getDifficultyColor(question.difficulty)} 
            size="small"
            sx={{ fontWeight: 'medium' }}
          />
        </Box>
        
        <Typography variant="body1" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
          {question.question}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {question.options.map((option, optIdx) => (
            <Typography 
              key={optIdx} 
              variant="body2" 
              sx={{ 
                mb: 1,
                pl: 2,
                color: showAnswer && option === question.answer ? 'success.main' : 'text.primary',
                fontWeight: showAnswer && option === question.answer ? 'bold' : 'normal',
                borderLeft: showAnswer && option === question.answer ? '3px solid' : '3px solid transparent',
                borderLeftColor: showAnswer && option === question.answer ? 'success.main' : 'transparent',
              }}
            >
              {String.fromCharCode(65 + optIdx)}. {option}
            </Typography>
          ))}
        </Box>

        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => setShowAnswer(!showAnswer)}
          sx={{ 
            mb: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </Button>

        {showAnswer && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
              <strong>Explanation:</strong> {question.explanation}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default QuizCard;