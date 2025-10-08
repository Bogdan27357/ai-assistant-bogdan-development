import { useRef, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import JSZip from 'jszip';

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
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

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

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    
    const fileWord = selectedFiles.size === 1 ? 'файл' : selectedFiles.size < 5 ? 'файла' : 'файлов';
    const confirmed = window.confirm(`Удалить ${selectedFiles.size} ${fileWord}? Это действие нельзя отменить.`);
    if (!confirmed) return;
    
    setIsDeleting(true);
    const count = selectedFiles.size;
    try {
      const deletePromises = Array.from(selectedFiles).map(id => onDeleteFile(id));
      await Promise.all(deletePromises);
      setSelectedFiles(new Set());
      toast.success(`✅ Успешно удалено ${count} ${fileWord}`);
    } catch (error) {
      toast.error('❌ Ошибка при удалении файлов');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportZip = async () => {
    if (selectedFiles.size === 0) return;
    
    const zip = new JSZip();
    const selectedFilesList = knowledgeFiles.filter(f => selectedFiles.has(f.id));
    
    toast.loading('📦 Создаю ZIP-архив...');
    
    try {
      for (const file of selectedFilesList) {
        const blob = new Blob([`Файл: ${file.file_name}\nРазмер: ${formatFileSize(file.file_size)}\nТип: ${file.file_type}\nДата: ${new Date(file.created_at).toLocaleString('ru-RU')}`], { type: 'text/plain' });
        zip.file(file.file_name, blob);
      }
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const fileWord = selectedFiles.size === 1 ? 'файл' : selectedFiles.size < 5 ? 'файла' : 'файлов';
      toast.success(`✅ Экспортировано ${selectedFiles.size} ${fileWord}`);
    } catch (error) {
      toast.error('❌ Ошибка при создании архива');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && filteredFiles.length > 0) {
        e.preventDefault();
        toggleSelectAll();
      }
      
      if (e.key === 'Escape' && selectedFiles.size > 0) {
        setSelectedFiles(new Set());
      }
      
      if (e.key === 'Delete' && selectedFiles.size > 0) {
        handleBulkDelete();
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'e' && selectedFiles.size > 0) {
        e.preventDefault();
        handleExportZip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFiles, filteredFiles]);

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Icon name="FileUp" size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">База знаний</h3>
            <p className="text-gray-400 text-sm">Загружайте файлы для обучения помощника</p>
          </div>
        </div>
        {selectedFiles.size > 0 && (
          <div className="text-xs text-gray-500 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
            <p className="mb-1">⌨️ Горячие клавиши:</p>
            <p><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-gray-300">Ctrl+E</kbd> — экспорт</p>
            <p><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-gray-300">Delete</kbd> — удалить</p>
            <p><kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-gray-300">Esc</kbd> — снять выделение</p>
          </div>
        )}
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
        <Card className={`p-4 border-slate-700 transition-all ${
          selectedFiles.size > 0 
            ? 'bg-indigo-900/30 border-indigo-600' 
            : 'bg-slate-800/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              selectedFiles.size > 0
                ? 'bg-indigo-500/20'
                : 'bg-green-500/20'
            }`}>
              <Icon name={selectedFiles.size > 0 ? "CheckSquare" : "Zap"} size={20} className={
                selectedFiles.size > 0 ? "text-indigo-400" : "text-green-400"
              } />
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                {selectedFiles.size > 0 ? 'Выбрано' : 'Активно'}
              </p>
              <p className="text-2xl font-bold text-white">
                {selectedFiles.size > 0 ? selectedFiles.size : knowledgeFiles.length}
              </p>
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
            <div className="flex items-center gap-3">
              <h4 className="text-white font-semibold">Загруженные файлы ({knowledgeFiles.length})</h4>
              {selectedFiles.size > 0 && (
                <>
                  <Button
                    onClick={handleExportZip}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Экспорт ({selectedFiles.size})
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    disabled={isDeleting}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить ({selectedFiles.size})
                  </Button>
                </>
              )}
            </div>
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
            <>
              {filteredFiles.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <Checkbox
                    checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-slate-600"
                  />
                  <span className="text-sm text-gray-400">
                    Выбрать все ({filteredFiles.length})
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      selectedFiles.has(file.id)
                        ? 'bg-indigo-900/30 border border-indigo-600 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-800/50 border border-transparent hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onCheckedChange={() => toggleFileSelection(file.id)}
                        className="border-slate-600"
                      />
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
            </>
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