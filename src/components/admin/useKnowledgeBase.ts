import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const useKnowledgeBase = () => {
  const [knowledgeFiles, setKnowledgeFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadKnowledgeFiles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8');
      const data = await response.json();
      setKnowledgeFiles(data.files || []);
    } catch (error) {
      console.error('Ошибка загрузки файлов');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string = 'Без категории') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        
        await new Promise((resolve, reject) => {
          reader.onload = async () => {
            try {
              const base64 = (reader.result as string).split(',')[1];
              
              const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  file_name: file.name,
                  file_content: base64,
                  file_type: file.type || 'text/plain',
                  category: category
                })
              });
              
              if (response.ok) {
                toast.success(`Файл ${file.name} загружен`);
              }
              resolve(true);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch (error) {
        toast.error(`Ошибка загрузки ${file.name}`);
      }
    }
    
    setUploading(false);
    loadKnowledgeFiles();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteFile = async (fileId: number): Promise<void> => {
    const response = await fetch(`https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8?id=${fileId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    
    await loadKnowledgeFiles();
  };

  return {
    knowledgeFiles,
    uploading,
    fileInputRef,
    loadKnowledgeFiles,
    handleFileUpload,
    handleDeleteFile
  };
};