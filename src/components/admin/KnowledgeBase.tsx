import { useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface KnowledgeFile {
  id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
}

interface KnowledgeBaseProps {
  knowledgeFiles: KnowledgeFile[];
  uploading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteFile: (fileId: number) => void;
}

const KnowledgeBase = ({ 
  knowledgeFiles, 
  uploading, 
  onFileUpload, 
  onDeleteFile 
}: KnowledgeBaseProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFile, setViewingFile] = useState<KnowledgeFile | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const filteredFiles = knowledgeFiles.filter(file => 
    file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = knowledgeFiles.reduce((sum, file) => sum + file.file_size, 0);

  const handleViewFile = async (file: KnowledgeFile) => {
    setViewingFile(file);
    try {
      const response = await fetch(`https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8?id=${file.id}`);
      const data = await response.json();
      setFileContent(data.content || 'Не удалось загрузить содержимое');
    } catch {
      setFileContent('Ошибка загрузки содержимого файла');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fakeEvent = {
        target: { files: e.dataTransfer.files }
      } as React.ChangeEvent<HTMLInputElement>;
      onFileUpload(fakeEvent);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Icon name="FileUp" size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">База знаний</h3>
          <p className="text-gray-400 text-sm">Загружайте файлы для обучения помощника</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Всего файлов</p>
              <p className="text-2xl font-bold text-white">{knowledgeFiles.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Icon name="HardDrive" size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Общий размер</p>
              <p className="text-2xl font-bold text-white">{(totalSize / 1024).toFixed(1)} KB</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Активно</p>
              <p className="text-2xl font-bold text-white">{knowledgeFiles.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-500/10' 
              : 'border-slate-700 hover:border-indigo-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={onFileUpload}
            className="hidden" 
            multiple 
            accept=".txt,.pdf,.doc,.docx" 
          />
          <label htmlFor="fileUpload" className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <Icon name="Upload" size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-white font-semibold mb-2">{uploading ? 'Загрузка...' : 'Перетащите файлы сюда'}</p>
            <p className="text-gray-400 text-sm mb-4">или нажмите для выбора</p>
            <p className="text-xs text-gray-500">Поддерживаются: TXT, PDF, DOC, DOCX</p>
          </label>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">Загруженные файлы ({knowledgeFiles.length})</h4>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
              <p>{searchQuery ? 'Файлы не найдены' : 'Файлы еще не загружены'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="FileText" size={20} className="text-indigo-400" />
                    <div>
                      <p className="text-white font-medium">{file.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.file_size / 1024).toFixed(2)} KB • {new Date(file.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewFile(file)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      <Icon name="Eye" size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteFile(file.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent className="max-w-3xl bg-slate-900 border-slate-700 max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Icon name="FileText" size={20} className="text-indigo-400" />
              {viewingFile?.file_name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="bg-slate-950 rounded-lg p-4">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">{fileContent}</pre>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-slate-700">
            <p className="text-sm text-gray-400">
              {viewingFile && `${(viewingFile.file_size / 1024).toFixed(2)} KB • ${new Date(viewingFile.created_at).toLocaleDateString('ru-RU')}`}
            </p>
            <Button onClick={() => setViewingFile(null)} variant="outline" className="border-slate-700">
              Закрыть
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default KnowledgeBase;