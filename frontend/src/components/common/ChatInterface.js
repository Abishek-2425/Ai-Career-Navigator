import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

/**
 * A reusable chat interface component that can be used across the application
 * Handles message display, input, and scrolling behavior
 */
const ChatInterface = ({
  messages = [],
  onSendMessage,
  onNewChat,
  isLoading = false,
  placeholder = 'Type your message...',
  containerSx = {},
  paperSx = {},
  showNewChatButton = true,
  renderMessageContent = null, // Custom message renderer
  renderAvatar = null, // Custom avatar renderer
}) => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    
    onSendMessage(userInput);
    setUserInput('');
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Default message renderer if custom one not provided
  const defaultRenderMessage = (msg, index) => {
    const isUser = msg.role === 'user' || msg.sender === 'user';
    const messageContent = msg.content || msg.text;
    
    return (
      <Box
        key={index}
        sx={{
          display: 'flex',
          p: 2,
          bgcolor: isUser ? 'primary.light' : 'background.paper',
          borderRadius: 1,
          mb: 2,
          alignSelf: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '80%'
        }}
      >
        {!isUser && renderAvatar && renderAvatar()}
        <Typography color={isUser ? 'white' : 'text.primary'}>
          {messageContent}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ height: '80vh', py: 2, ...containerSx }}>
      <Paper
        elevation={3}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ...paperSx
        }}
      >
        {/* Chat header with new chat button */}
        {showNewChatButton && (
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Button
              startIcon={<AddIcon />}
              onClick={onNewChat}
              variant="outlined"
              size="small"
            >
              New Chat
            </Button>
          </Box>
        )}

        {/* Messages container */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.map((msg, index) => (
            renderMessageContent ? renderMessageContent(msg, index) : defaultRenderMessage(msg, index)
          ))}
          
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>

        {/* Message input */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex'
          }}
        >
          <TextField
            fullWidth
            placeholder={placeholder}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            disabled={isLoading}
            sx={{ mr: 1 }}
          />
          <IconButton
            color="primary"
            type="submit"
            disabled={!userInput.trim() || isLoading}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatInterface;