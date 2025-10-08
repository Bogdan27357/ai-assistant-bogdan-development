import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ProcessedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  summary?: string;
  extractedText?: string;
  status: 'processing' | 'completed' | 'error';
}

const DocumentProcessor = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);
  const [processingAction, setProcessingAction] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { ext: 'PDF', icon: 'FileText', color: 'text-red-400' },
    { ext: 'DOCX', icon: 'FileText', color: 'text-blue-400' },
    { ext: 'DOC', icon: 'FileText', color: 'text-blue-400' },
    { ext: 'XLSX', icon: 'Sheet', color: 'text-green-400' },
    { ext: 'XLS', icon: 'Sheet', color: 'text-green-400' },
    { ext: 'TXT', icon: 'FileText', color: 'text-slate-400' },
    { ext: 'CSV', icon: 'Table', color: 'text-yellow-400' },
  ];

  const processingActions = [
    { id: 'summary', name: 'Резюме документа', icon: 'FileSearch' },
    { id: 'extract', name: 'Извлечь текст', icon: 'Type' },
    { id: 'translate', name: 'Перевести', icon: 'Languages' },
    { id: 'analyze', name: 'Анализ данных', icon: 'BarChart' },
    { id: 'qa', name: 'Вопрос-ответ', icon: 'MessageCircle' },
    { id: 'keywords', name: 'Ключевые слова', icon: 'Tag' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';
      const isSupported = supportedFormats.some(format => format.ext === fileExtension);

      if (!isSupported) {
        toast.error(`Формат ${fileExtension} не поддерживается`);
        return;
      }

      const newDoc: ProcessedDocument = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: fileExtension,
        size: file.size,
        uploadDate: new Date(),
        status: 'processing'
      };

      setDocuments(prev => [...prev, newDoc]);
      toast.success(`Загружаю ${file.name}...`);

      setTimeout(() => {
        const demoText = `Это демо-версия. Загружен файл: ${file.name}\n\nВ реальной версии здесь будет извлеченный текст из документа с использованием библиотек:\n- PDF.js для PDF\n- mammoth.js для DOCX\n- xlsx для Excel\n\nДемо содержимое:\nЛорем ипсум долор сит амет, консектетур адиписицинг элит. Нулла фацилиси. Прэсэнт эу дуй элит.`;

        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id
              ? { ...doc, status: 'completed', extractedText: demoText }
              : doc
          )
        );
        toast.success(`${file.name} обработан!`);
      }, 2000);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processDocument = (docId: string, action: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;

    setProcessingAction(action);
    toast.loading('Обрабатываю...');

    setTimeout(() => {
      let result = '';
      switch (action) {
        case 'summary':
          result = `📝 Резюме документа "${doc.name}":\n\nЭто краткое содержание документа. В реальной версии здесь будет AI-генерированное резюме основных пунктов документа.`;
          break;
        case 'translate':
          result = `🌐 Перевод документа "${doc.name}" на английский:\n\nThis is a translated version. In the real version, the entire document will be translated.`;
          break;
        case 'analyze':
          result = `📊 Анализ данных из "${doc.name}":\n\n- Найдено записей: 150\n- Числовых значений: 45\n- Уникальных категорий: 12\n- Средние значения: вычислены`;
          break;
        case 'keywords':
          result = `🏷️ Ключевые слова из "${doc.name}":\n\nИнновации, Технологии, Развитие, Стратегия, Анализ, Результаты, Эффективность`;
          break;
        default:
          result = doc.extractedText || 'Нет данных';
      }

      setDocuments(prev =>
        prev.map(d => (d.id === docId ? { ...d, summary: result } : d))
      );
      
      toast.dismiss();
      toast.success('Готово!');
      setProcessingAction('');
    }, 1500);
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
    toast.success('Документ удален');
  };

  const exportResults = () => {
    if (!selectedDoc?.summary) {
      toast.error('Нет данных для экспорта');
      return;
    }

    const blob = new Blob([selectedDoc.summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${selectedDoc.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Результат экспортирован');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon name="FileStack" size={40} className="text-purple-400" />
            Обработка документов
          </h1>
          <p className="text-slate-400">Анализируйте PDF, Word, Excel файлы с помощью AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex flex-col items-center gap-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-600 rounded-lg p-12 hover:border-purple-500 transition-colors group"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <Icon name="Upload" size={40} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white mb-1">
                        Загрузите документы
                      </p>
                      <p className="text-sm text-slate-400">
                        Поддерживаются: PDF, Word, Excel, TXT, CSV
                      </p>
                    </div>
                  </div>
                </button>

                <div className="grid grid-cols-4 gap-4 w-full">
                  {supportedFormats.map(format => (
                    <div
                      key={format.ext}
                      className="bg-slate-800 rounded-lg p-4 text-center"
                    >
                      <Icon
                        name={format.icon as any}
                        size={32}
                        className={`${format.color} mx-auto mb-2`}
                      />
                      <p className="text-xs text-slate-300">{format.ext}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {selectedDoc && (
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <Tabs defaultValue="actions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger value="actions">Действия</TabsTrigger>
                    <TabsTrigger value="content">Содержимое</TabsTrigger>
                    <TabsTrigger value="results">Результат</TabsTrigger>
                  </TabsList>

                  <TabsContent value="actions" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      {processingActions.map(action => (
                        <Button
                          key={action.id}
                          onClick={() => processDocument(selectedDoc.id, action.id)}
                          disabled={processingAction === action.id}
                          className="bg-slate-800 hover:bg-slate-700 justify-start h-auto py-4"
                        >
                          <Icon name={action.icon as any} size={20} className="mr-3" />
                          <span>{action.name}</span>
                        </Button>
                      ))}
                    </div>

                    <div className="border-t border-slate-700 pt-4">
                      <label className="text-sm font-medium text-white mb-2 block">
                        Или задайте свой вопрос:
                      </label>
                      <Textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Например: Найди все упоминания цен в документе"
                        className="bg-slate-800 border-slate-700 min-h-24"
                      />
                      <Button
                        onClick={() => {
                          if (customPrompt.trim()) {
                            processDocument(selectedDoc.id, 'custom');
                            setCustomPrompt('');
                          }
                        }}
                        className="mt-3 bg-purple-600 hover:bg-purple-700"
                      >
                        <Icon name="Send" size={16} className="mr-2" />
                        Обработать
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="mt-6">
                    <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
                      <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                        {selectedDoc.extractedText || 'Извлекаю текст...'}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="results" className="mt-6">
                    {selectedDoc.summary ? (
                      <div className="space-y-4">
                        <div className="bg-slate-800 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
                          <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                            {selectedDoc.summary}
                          </pre>
                        </div>
                        <Button onClick={exportResults} className="bg-purple-600 hover:bg-purple-700">
                          <Icon name="Download" size={16} className="mr-2" />
                          Экспортировать результат
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="FileQuestion" size={48} className="text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500">Выберите действие для обработки документа</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Загруженные файлы</h3>
                <Badge variant="secondary">{documents.length}</Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="Inbox" size={48} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Нет загруженных файлов</p>
                  </div>
                ) : (
                  documents.map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDoc?.id === doc.id
                          ? 'ring-2 ring-purple-500'
                          : 'hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Icon name="FileText" size={20} className="text-purple-400 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {doc.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {doc.type}
                              </Badge>
                              <span className="text-xs text-slate-400">
                                {formatFileSize(doc.size)}
                              </span>
                            </div>
                            <div className="mt-2">
                              {doc.status === 'processing' && (
                                <Badge className="bg-yellow-600">Обработка...</Badge>
                              )}
                              {doc.status === 'completed' && (
                                <Badge className="bg-green-600">Готово</Badge>
                              )}
                              {doc.status === 'error' && (
                                <Badge className="bg-red-600">Ошибка</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDocument(doc.id);
                          }}
                        >
                          <Icon name="Trash2" size={16} className="text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-500/30 p-6">
              <h3 className="text-lg font-bold text-white mb-3">✨ Возможности</h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>✅ Извлечение текста из документов</li>
                <li>✅ AI резюме и анализ</li>
                <li>✅ Перевод документов</li>
                <li>✅ Поиск ключевых слов</li>
                <li>✅ Анализ данных из Excel</li>
                <li>✅ Вопрос-ответ по документу</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentProcessor;
