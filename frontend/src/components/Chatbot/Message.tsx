import { Box, Paper } from '@mui/material';
import { IChatbotMessage } from '../../@types/chatbot';
import TextContent from '../TextContent';

export default function Message({ message }: { message: IChatbotMessage }) {
  const isBot = message.role === 'assistant';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        mb: 2,
      }}
    >
      <Paper
        sx={{
          p: 1,
          backgroundColor: isBot ? 'primary.light' : 'secondary.light',
        }}
      >
        <Box
          sx={{ typography: 'body1' }}
          color={isBot ? 'primary.contrastText' : 'secondary.contrastText'}
        >
          <TextContent content={message.content} />
        </Box>
      </Paper>
    </Box>
  );
}
