import { Message } from '@mui/icons-material';
import { Box, Button, Popover, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import Chatbot, { IChatbotProps } from './Chatbot';

export default function ChatbotPopover(chatbotProps: IChatbotProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [input, setInput] = useState<string>('');
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const theme = useTheme();
  const onlySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const onlyMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = 'simple-popover';

  return (
    <Box>
      <Button
        aria-describedby={id}
        startIcon={<Message />}
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          textTransform: 'none',
        }}
        variant="contained"
        onClick={handleClick}
      >
        Having trouble? Ask our chatbot!
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        autoCorrect={'false'}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            style: {
              width: onlySmallScreen || onlyMediumScreen ? '100%' : '50%',
              height: onlySmallScreen ? '100%' : onlyMediumScreen ? '75%' : '50%',
            },
          },
        }}
      >
        <Chatbot
          {...chatbotProps}
          input={input}
          setInput={setInput}
          handleChatbotClose={handleClose}
        />
      </Popover>
    </Box>
  );
}
