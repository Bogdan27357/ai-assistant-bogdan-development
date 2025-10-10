import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useEffect } from 'react';

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  content: string;
}

interface ChatInputProps {
  input: string;
  uploadedFiles: UploadedFile[];
  isLoading: boolean;
  placeholder: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  onFileButtonClick: () => void;
  voiceEnabled?: boolean;
}

const ChatInput = ({
  input,
  uploadedFiles,
  isLoading,
  placeholder,
  fileInputRef,
  onInputChange,
  onSend,
  onFileUpload,
  onFileRemove,
  onFileButtonClick,
  voiceEnabled = false,
}: ChatInputProps) => {
  const { isRecording, transcript, toggleRecording, isSupported, clearTranscript } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      onInputChange(input + transcript);
      clearTranscript();
    }
  }, [transcript]);
  return (
    <div className="p-3 md:p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
      {uploadedFiles.length > 0 && (
        <div className="mb-3 md:mb-4 flex flex-wrap gap-1.5 md:gap-2">
          {uploadedFiles.map((file, idx) => {
            const isImage = file.type.startsWith('image/');
            return (
              <div key={idx} className="relative group">
                {isImage ? (
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-slate-700 hover:border-indigo-500 transition-colors">
                    <img 
                      src={`data:${file.type};base64,${file.content}`} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={() => onFileRemove(idx)} 
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={14} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs md:text-sm text-gray-300 hover:border-indigo-500 transition-colors">
                    <Icon name="FileText" size={16} />
                    <span className="max-w-[120px] truncate">{file.name}</span>
                    <span className="text-gray-500">({(file.size / 1024).toFixed(1)}KB)</span>
                    <button onClick={() => onFileRemove(idx)} className="ml-2 text-red-400 hover:text-red-300">
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="flex gap-2 md:gap-3">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileUpload}
          className="hidden"
          accept=".txt,.pdf,.doc,.docx,.json,.csv,.png,.jpg,.jpeg,.gif,.webp"
        />
        <Button
          onClick={onFileButtonClick}
          variant="outline"
          disabled={isLoading}
          className="border-slate-600 text-gray-300 hover:bg-slate-700 shrink-0 h-12 md:h-[60px] w-12 md:w-auto"
        >
          <Icon name="Paperclip" size={18} className="md:w-5 md:h-5" />
        </Button>
        {isSupported && voiceEnabled && (
          <Button
            onClick={toggleRecording}
            variant="outline"
            disabled={isLoading}
            className={`border-slate-600 shrink-0 h-12 md:h-[60px] w-12 md:w-auto transition-all ${
              isRecording 
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse' 
                : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            <Icon name={isRecording ? 'MicOff' : 'Mic'} size={18} className="md:w-5 md:h-5" />
          </Button>
        )}
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={placeholder}
          className="bg-slate-900/50 border-slate-600 text-white placeholder:text-gray-500 min-h-12 md:min-h-[60px] text-sm md:text-base resize-none focus:border-indigo-500 transition-colors"
          disabled={isLoading}
          rows={2}
        />
        <Button
          onClick={onSend}
          disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shrink-0 h-12 md:h-[60px] w-12 md:w-auto shadow-lg hover:shadow-xl transition-all"
        >
          <Icon name="Send" size={18} className="md:w-5 md:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;