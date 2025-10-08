import { useState, useEffect } from 'react';
import { speakText, stopSpeech, isSpeaking } from '@/lib/tts';

export const useVoice = () => {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('ru-RU-DmitryNeural');
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('voiceEnabled');
    if (stored) setVoiceEnabled(stored === 'true');
    
    const storedVoice = localStorage.getItem('selectedVoice');
    if (storedVoice) setSelectedVoice(storedVoice);
  }, []);

  const toggleVoice = () => {
    const newValue = !voiceEnabled;
    setVoiceEnabled(newValue);
    localStorage.setItem('voiceEnabled', String(newValue));
  };

  const changeVoice = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('selectedVoice', voiceId);
  };

  const speak = async (text: string) => {
    if (!voiceEnabled) return;
    
    try {
      setSpeaking(true);
      await speakText(text, selectedVoice);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const stop = () => {
    stopSpeech();
    setSpeaking(false);
  };

  return {
    voiceEnabled,
    selectedVoice,
    speaking,
    toggleVoice,
    changeVoice,
    speak,
    stop,
    isSpeaking: () => isSpeaking() || speaking
  };
};
