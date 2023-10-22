import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { IChatbotMessage } from '../../@types/chatbot';
import { getChatbotMessageHistory, queryChatbot } from '../../api/chatbotApi';
import Message from './Message';
import SendIcon from '@mui/icons-material/Send';

export interface IChatbotProps {
  sessionId: string;
  language: string;
  userSolution: string;
}

export interface IChatbotPopupProps {
  handleChatbotClose: () => void;
}

export default function Chatbot({
  sessionId,
  language,
  userSolution,
  handleChatbotClose,
}: IChatbotProps & IChatbotPopupProps) {
  const [messages, setMessages] = useState<IChatbotMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getChatbotMessageHistory(sessionId).then((resp) => {
      const { messages } = resp.data;
      setMessages(messages);
    });
  }, []);

  const handleSend = () => {
    setMessages([...messages, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');

    queryChatbot(sessionId, language, input, userSolution).then((resp) => {
      const { messages } = resp.data;
      setMessages(messages);
      setLoading(false);
      setInput('');
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.shiftKey && e.key === 'Enter') {
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <Box sx={{ p: 2, backgroundColor: 'primary.main' }}>
        <Typography variant="h6" color="primary.contrastText">
          PeerPrep Chatbot
        </Typography>
        <Button
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            textTransform: 'none',
            color: 'primary.contrastText',
          }}
          variant="text"
          onClick={handleChatbotClose}
        >
          Close
        </Button>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 'calc(100% - 170px)' }}>
        <Box sx={{ display: 'flex', overflow: 'auto', flexDirection: 'column-reverse' }}>
          <Box>
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            {loading && <Message message={{ role: 'assistant', content: '...' }} />}
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
        <Grid container spacing={2}>
          <Grid
            item
            sx={{
              flexGrow: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              size="small"
              placeholder="Type a message"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </Grid>
          <Grid item alignSelf={'flex-end'}>
            <Button
              size="large"
              color="primary"
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSend}
            >
              Send
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}