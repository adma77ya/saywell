import React, { useContext, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route } from 'react-router-dom';
import MiniDrawer from './miniDrawer';
import Customise from './customise';
import ConvertFile from './convertFile';
import ChatWindow from './chatWindow';
import '@fontsource/lexend';
import '@fontsource/opendyslexic';
import axios from 'axios';
import './App.css';
import AllContext from './AllContext';
import Signup from './signup';
import Login from './login';
import Questionnaire from './questionnaire';
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useMemo } from 'react';

function App() {
  const { theme } = useContext(AllContext)
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const themeToSet = createTheme(theme);

  const handleSpeechToText = async () => {
    setIsRecording(true);
    try {
      // Here you would typically handle the audio recording
      // For now, we'll just simulate it
      const response = await axios.post('http://localhost:5000/api/speech-to-text');
      setText(response.data.text);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsRecording(false);
  };

  const handleTextUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/process-text', { text });
      setText(() => response.data.updatedText);  // Ensures instant update
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const handleTextToSpeech = async () => {
    try {
      await axios.post('http://localhost:5000/api/text-to-speech', { text });
      // Here you would typically play the audio
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkSpelling = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/check-spelling', { text });
      setFeedback(response.data.analysis);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  // const renderFeedback = () => {
  //   if (!feedback) return null;

  //   const getTypeColor = (type) => {
  //     switch (type) {
  //       case 'spelling': return '#f44336';  // Red for spelling errors
  //       case 'informal': return '#ff9800';  // Orange for informal words
  //       case 'improper': return '#9c27b0';  // Purple for improper usage
  //       default: return '#000000';
  //     }
  //   };

  //   const getTypeLabel = (type) => {
  //     switch (type) {
  //       case 'spelling': return 'Spelling Error';
  //       case 'informal': return 'Informal Word';
  //       case 'improper': return 'Improper Usage';
  //       default: return 'Unknown';
  //     }
  //   };

    
  // };

  // return (
  //   <ThemeProvider theme={themeToSet}>
  //     <div className="App" style={{ backgroundColor: themeToSet.palette.secondary.main, minHeight: '100vh' }}>
  //     <MiniDrawer>
  //     <Routes>
  //       <Route path='/chatWindow' element={<ChatWindow/>}/>
  //       <Route path='/customise' element={<Customise/>}/>
  //       <Route path='/convertfile' element={<ConvertFile/>}/>
  //     </Routes>
  //     </MiniDrawer>
  //     </div>
  //   </ThemeProvider>
  // );
  
  return (
    <ThemeProvider theme={themeToSet}>
      <div className="App" style={{ backgroundColor: themeToSet.palette.secondary.main, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/app" element={<MiniDrawer />}>
            <Route path="chatWindow" element={<ChatWindow />} />
            <Route path="customise" element={<Customise />} />
            <Route path="convertfile" element={<ConvertFile />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;