import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface KnowledgeFile {
  id: number;
  file_name: string;
  file_size: number;
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

      <div className="space-y-6">
        <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
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
          <h4 className="text-white font-semibold">Загруженные файлы ({knowledgeFiles.length})</h4>
          {knowledgeFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Файлы еще не загружены</p>
            </div>
          ) : (
            <div className="space-y-2">
              {knowledgeFiles.map((file) => (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteFile(file.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default KnowledgeBase;
