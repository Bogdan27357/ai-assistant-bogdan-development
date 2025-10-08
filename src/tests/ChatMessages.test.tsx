import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatMessages from '@/components/chat/ChatMessages';

describe('ChatMessages', () => {
  const mockProps = {
    messages: [],
    isLoading: false,
    translations: {
      startConversation: 'Начать беседу',
      inputPlaceholder: 'Введите сообщение...',
    },
    onCopyMessage: vi.fn(),
    messagesEndRef: { current: null } as React.RefObject<HTMLDivElement>,
  };

  it('displays empty state when no messages', () => {
    render(<ChatMessages {...mockProps} />);
    expect(screen.getByText('Начать беседу')).toBeInTheDocument();
  });

  it('renders user message correctly', () => {
    const props = {
      ...mockProps,
      messages: [
        { role: 'user' as const, content: 'Hello AI' }
      ],
    };
    
    render(<ChatMessages {...props} />);
    expect(screen.getByText('Hello AI')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    const props = {
      ...mockProps,
      messages: [
        { role: 'assistant' as const, content: 'Hello! How can I help?' }
      ],
    };
    
    render(<ChatMessages {...props} />);
    expect(screen.getByText('Hello! How can I help?')).toBeInTheDocument();
  });

  it('displays loading indicator when isLoading is true', () => {
    const props = { ...mockProps, isLoading: true };
    render(<ChatMessages {...props} />);
    
    const loadingDots = document.querySelectorAll('.animate-pulse');
    expect(loadingDots.length).toBeGreaterThan(0);
  });

  it('renders multiple messages in correct order', () => {
    const props = {
      ...mockProps,
      messages: [
        { role: 'user' as const, content: 'First message' },
        { role: 'assistant' as const, content: 'Second message' },
        { role: 'user' as const, content: 'Third message' }
      ],
    };
    
    render(<ChatMessages {...props} />);
    
    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });

  it('calls onCopyMessage when copy button is clicked', () => {
    const props = {
      ...mockProps,
      messages: [
        { role: 'assistant' as const, content: 'Test message' }
      ],
    };
    
    render(<ChatMessages {...props} />);
    
    const copyButton = screen.getByRole('button', { name: /copy|копировать/i });
    fireEvent.click(copyButton);
    
    expect(props.onCopyMessage).toHaveBeenCalledWith('Test message');
  });

  it('displays quick prompts in empty state', () => {
    render(<ChatMessages {...mockProps} />);
    
    const promptButtons = screen.getAllByRole('button');
    expect(promptButtons.length).toBeGreaterThan(0);
  });

  it('calls onNavigateToAdmin when setup button is clicked', () => {
    const props = {
      ...mockProps,
      messages: [
        { role: 'assistant' as const, content: 'API ключи не настроены' }
      ],
      onNavigateToAdmin: vi.fn(),
    };
    
    render(<ChatMessages {...props} />);
    
    const setupButton = screen.getByRole('button', { name: /setup|настроить/i });
    fireEvent.click(setupButton);
    
    expect(props.onNavigateToAdmin).toHaveBeenCalledTimes(1);
  });
});
