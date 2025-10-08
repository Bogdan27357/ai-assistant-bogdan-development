export interface Voice {
  id: string;
  name: string;
  lang: string;
  gender: 'male' | 'female';
  description: string;
}

export const voices: Voice[] = [
  { id: 'ru-RU-DmitryNeural', name: 'Дмитрий', lang: 'ru', gender: 'male', description: 'Мужской голос (Россия)' },
  { id: 'ru-RU-SvetlanaNeural', name: 'Светлана', lang: 'ru', gender: 'female', description: 'Женский голос (Россия)' },
  { id: 'en-US-GuyNeural', name: 'Guy', lang: 'en', gender: 'male', description: 'Male voice (USA)' },
  { id: 'en-US-JennyNeural', name: 'Jenny', lang: 'en', gender: 'female', description: 'Female voice (USA)' },
  { id: 'en-GB-RyanNeural', name: 'Ryan', lang: 'en', gender: 'male', description: 'Male voice (UK)' },
  { id: 'en-GB-SoniaNeural', name: 'Sonia', lang: 'en', gender: 'female', description: 'Female voice (UK)' },
  { id: 'es-ES-AlvaroNeural', name: 'Alvaro', lang: 'es', gender: 'male', description: 'Voz masculina (España)' },
  { id: 'es-ES-ElviraNeural', name: 'Elvira', lang: 'es', gender: 'female', description: 'Voz femenina (España)' },
  { id: 'fr-FR-HenriNeural', name: 'Henri', lang: 'fr', gender: 'male', description: 'Voix masculine (France)' },
  { id: 'fr-FR-DeniseNeural', name: 'Denise', lang: 'fr', gender: 'female', description: 'Voix féminine (France)' },
  { id: 'de-DE-ConradNeural', name: 'Conrad', lang: 'de', gender: 'male', description: 'Männliche Stimme (Deutschland)' },
  { id: 'de-DE-KatjaNeural', name: 'Katja', lang: 'de', gender: 'female', description: 'Weibliche Stimme (Deutschland)' },
  { id: 'zh-CN-YunxiNeural', name: 'Yunxi', lang: 'zh', gender: 'male', description: '男声 (中国)' },
  { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao', lang: 'zh', gender: 'female', description: '女声 (中国)' },
  { id: 'ar-SA-HamedNeural', name: 'Hamed', lang: 'ar', gender: 'male', description: 'صوت ذكر (السعودية)' },
  { id: 'ar-SA-ZariyahNeural', name: 'Zariyah', lang: 'ar', gender: 'female', description: 'صوت أنثى (السعودية)' },
];

let currentUtterance: SpeechSynthesisUtterance | null = null;
let currentAudio: HTMLAudioElement | null = null;

export const stopSpeech = () => {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const speakText = async (text: string, voiceId: string): Promise<void> => {
  stopSpeech();

  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const synth = window.speechSynthesis;
      const availableVoices = synth.getVoices();
      
      const voice = voices.find(v => v.id === voiceId);
      if (voice) {
        const synthVoice = availableVoices.find(v => 
          v.lang.startsWith(voice.lang) && 
          (voice.gender === 'male' ? v.name.includes('Male') || v.name.includes('Guy') : v.name.includes('Female') || v.name.includes('Jenny'))
        );
        
        if (synthVoice) {
          utterance.voice = synthVoice;
        }
        
        utterance.lang = voice.lang === 'zh' ? 'zh-CN' : voice.lang === 'ar' ? 'ar-SA' : `${voice.lang}-${voice.lang.toUpperCase()}`;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => {
        currentUtterance = null;
        resolve();
      };
      
      utterance.onerror = (error) => {
        currentUtterance = null;
        reject(error);
      };
      
      currentUtterance = utterance;
      synth.speak(utterance);
      
    } catch (error) {
      reject(error);
    }
  });
};

export const isSpeaking = (): boolean => {
  return window.speechSynthesis.speaking || currentAudio !== null;
};

export const getVoicesByLanguage = (lang: string): Voice[] => {
  return voices.filter(v => v.lang === lang);
};
