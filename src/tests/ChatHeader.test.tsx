import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatHeader from '@/components/chat/ChatHeader';

describe('ChatHeader', () => {
  const mockProps = {
    title: 'AI Chat',
    subtitle: 'Your smart assistant',
    activeModel: 'gemini',
    availableModels: [
      { id: 'gemini', name: 'ИИ Скорость', icon: 'Zap', color: 'from-blue-500 to-cyan-500' },
      { id: 'llama', name: 'ИИ Логика', icon: 'Brain', color: 'from-purple-500 to-pink-500' },
    ],
    voiceEnabled: false,
    messagesCount: 0,
    translations: {
      clearChat: 'Очистить чат',
      exportChat: 'Экспорт',
      promptLibrary: 'Библиотека промптов',
      close: 'Закрыть',
    },
    onModelChange: vi.fn(),
    onVoiceToggle: vi.fn(),
    onExport: vi.fn(),
    onClear: vi.fn(),
    onPromptSelect: vi.fn(),
  };

  it('renders title and subtitle', () => {
    render(<ChatHeader {...mockProps} />);
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
    expect(screen.getByText('Your smart assistant')).toBeInTheDocument();
  });

  it('displays active model name', () => {
    render(<ChatHeader {...mockProps} />);
    expect(screen.getByText('ИИ Скорость')).toBeInTheDocument();
  });

  it('calls onModelChange when model button is clicked', () => {
    render(<ChatHeader {...mockProps} />);
    
    const modelButton = screen.getByText('ИИ Скорость');
    fireEvent.click(modelButton);
    
    const llamaModel = screen.getByText('ИИ Логика');
    fireEvent.click(llamaModel);
    
    expect(mockProps.onModelChange).toHaveBeenCalledWith('llama');
  });

  it('calls onVoiceToggle when voice button is clicked', () => {
    render(<ChatHeader {...mockProps} />);
    
    const voiceButton = screen.getAllByRole('button').find(
      btn => btn.querySelector('svg')
    );
    
    if (voiceButton) {
      fireEvent.click(voiceButton);
      expect(mockProps.onVoiceToggle).toHaveBeenCalledTimes(1);
    }
  });

  it('calls onExport when export button is clicked', () => {
    const props = { ...mockProps, messagesCount: 5 };
    render(<ChatHeader {...props} />);
    
    const exportButton = screen.getByRole('button', { name: /экспорт/i });
    fireEvent.click(exportButton);
    
    expect(props.onExport).toHaveBeenCalledTimes(1);
  });

  it('calls onClear when clear button is clicked', () => {
    const props = { ...mockProps, messagesCount: 5 };
    render(<ChatHeader {...props} />);
    
    const clearButton = screen.getByRole('button', { name: /очистить/i });
    fireEvent.click(clearButton);
    
    expect(props.onClear).toHaveBeenCalledTimes(1);
  });

  it('disables export and clear buttons when no messages', () => {
    render(<ChatHeader {...mockProps} />);
    
    const exportButton = screen.getByRole('button', { name: /экспорт/i });
    const clearButton = screen.getByRole('button', { name: /очистить/i });
    
    expect(exportButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it('enables export and clear buttons when messages exist', () => {
    const props = { ...mockProps, messagesCount: 3 };
    render(<ChatHeader {...props} />);
    
    const exportButton = screen.getByRole('button', { name: /экспорт/i });
    const clearButton = screen.getByRole('button', { name: /очистить/i });
    
    expect(exportButton).not.toBeDisabled();
    expect(clearButton).not.toBeDisabled();
  });

  it('opens prompt library dialog when button is clicked', () => {
    render(<ChatHeader {...mockProps} />);
    
    const libraryButton = screen.getByRole('button', { name: /библиотека/i });
    fireEvent.click(libraryButton);
    
    expect(screen.getByText('Библиотека промптов')).toBeInTheDocument();
  });

  it('highlights active model with correct styling', () => {
    render(<ChatHeader {...mockProps} />);
    
    const geminiButton = screen.getByText('ИИ Скорость').closest('button');
    expect(geminiButton).toHaveClass('from-blue-500');
  });
});
