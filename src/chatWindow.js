import React, { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChatMessage from "./chatMessage";
import { useContext } from "react";
import AllContext from "./AllContext";

function ChatWindow() {
  const {messages, setMessages, input, setInput,prefTeachStyle, age, struggleSyllables, nickname} = useContext(AllContext)
  const theme = useTheme(); // Access theme

  const sendMessage = () => {
    if (!input.trim()) return;
  
    setMessages(prevMessages => [...prevMessages, { text: input, sender: "You" }]);
    setInput(""); // Clear input field
  
    const checkSpelling = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/check-spelling", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input ,  prefTeachStyle: prefTeachStyle, age: age, struggleSyllables: struggleSyllables, nickname: nickname} ), // Ensure "text" key matches backend
        });
        const data = await response.json();
        
        
        setMessages(prevMessages => [...prevMessages, { text: data.corrected_text, sender: "Ai" }]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    checkSpelling();
  };


  return (
    <Paper
      style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        height: "80vh",
        backgroundColor: theme.palette.background.paper, // Theme background
        color: theme.palette.text.secondary, // Theme text color
      }}
    >
      {/* Chat Messages */}
      <div style={{ flexGrow: 1, overflowY: "auto", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} msg={msg} />
        ))}
      </div>

      {/* Input Box */}
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          sx={{
            backgroundColor: theme.palette.secondary.textinput, // Themed input field
            color: theme.palette.text.secondary,
            borderRadius: "5px",
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          sx={{
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          Send
        </Button>
      </div>
    </Paper>
  );
}

export default ChatWindow;
