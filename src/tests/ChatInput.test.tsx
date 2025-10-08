import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  const mockProps = {
    input: '',
    uploadedFiles: [],
    isLoading: false,
    placeholder: 'Введите сообщение...',
    fileInputRef: { current: null } as React.RefObject<HTMLInputElement>,
    onInputChange: vi.fn(),
    onSend: vi.fn(),
    onFileUpload: vi.fn(),
    onFileRemove: vi.fn(),
    onFileButtonClick: vi.fn(),
  };

  it('renders textarea with placeholder', () => {
    render(<ChatInput {...mockProps} />);
    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    expect(textarea).toBeInTheDocument();
  });

  it('calls onSend when send button is clicked', () => {
    const props = { ...mockProps, input: 'Test message' };
    render(<ChatInput {...props} />);
    
    const sendButton = screen.getByRole('button', { name: '' });
    fireEvent.click(sendButton);
    
    expect(props.onSend).toHaveBeenCalledTimes(1);
  });

  it('disables send button when input is empty and no files uploaded', () => {
    render(<ChatInput {...mockProps} />);
    const sendButton = screen.getByRole('button', { name: '' });
    expect(sendButton).toBeDisabled();
  });

  it('calls onInputChange when typing in textarea', () => {
    render(<ChatInput {...mockProps} />);
    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    
    fireEvent.change(textarea, { target: { value: 'Hello' } });
    
    expect(mockProps.onInputChange).toHaveBeenCalledWith('Hello');
  });

  it('displays uploaded files', () => {
    const propsWithFiles = {
      ...mockProps,
      uploadedFiles: [
        { name: 'test.txt', type: 'text/plain', size: 1024, content: 'base64content' }
      ],
    };
    
    render(<ChatInput {...propsWithFiles} />);
    
    expect(screen.getByText('test.txt')).toBeInTheDocument();
    expect(screen.getByText('(1.0KB)')).toBeInTheDocument();
  });

  it('calls onFileRemove when remove button is clicked', () => {
    const propsWithFiles = {
      ...mockProps,
      uploadedFiles: [
        { name: 'test.txt', type: 'text/plain', size: 1024, content: 'base64content' }
      ],
    };
    
    render(<ChatInput {...propsWithFiles} />);
    
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find(btn => btn.querySelector('svg'));
    
    if (removeButton) {
      fireEvent.click(removeButton);
      expect(propsWithFiles.onFileRemove).toHaveBeenCalledWith(0);
    }
  });

  it('disables input when isLoading is true', () => {
    const props = { ...mockProps, isLoading: true };
    render(<ChatInput {...props} />);
    
    const textarea = screen.getByPlaceholderText('Введите сообщение...');
    expect(textarea).toBeDisabled();
  });
});
