import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface KnowledgeDoc {
  id: number;
  title: string;
  content: string;
  category: string;
}

interface SystemPrompt {
  id: number;
  name: string;
  prompt_text: string;
  is_active: boolean;
  ai_model: string;
}

const KB_API = 'https://functions.poehali.dev/5fedd0d4-3448-4585-bd85-f0e04e5983d3';
const PROMPT_API = 'https://functions.poehali.dev/4cf138a9-29d9-4e15-9cb0-37d9868a2491';

const KnowledgeAdmin = () => {
  const [activeTab, setActiveTab] = useState<'knowledge' | 'prompts'>('knowledge');
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  
  const [editDoc, setEditDoc] = useState<KnowledgeDoc | null>(null);
  const [editPrompt, setEditPrompt] = useState<SystemPrompt | null>(null);
  
  const [showDocForm, setShowDocForm] = useState(false);
  const [showPromptForm, setShowPromptForm] = useState(false);

  useEffect(() => {
    loadDocs();
    loadPrompts();
  }, []);

  const loadDocs = async () => {
    const res = await fetch(KB_API);
    const data = await res.json();
    setDocs(data);
  };

  const loadPrompts = async () => {
    const res = await fetch(PROMPT_API);
    const data = await res.json();
    setPrompts(data);
  };

  const saveDoc = async (doc: Partial<KnowledgeDoc>) => {
    await fetch(KB_API, {
      method: doc.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    toast.success('Документ сохранён');
    loadDocs();
    setShowDocForm(false);
    setEditDoc(null);
  };

  const deleteDoc = async (id: number) => {
    await fetch(`${KB_API}?id=${id}`, { method: 'DELETE' });
    toast.success('Документ удалён');
    loadDocs();
  };

  const savePrompt = async (prompt: Partial<SystemPrompt>) => {
    await fetch(PROMPT_API, {
      method: prompt.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt)
    });
    toast.success('Промпт сохранён');
    loadPrompts();
    setShowPromptForm(false);
    setEditPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Icon name="Database" size={32} />
            База знаний и промпты
          </h1>
          <Button onClick={() => window.location.href = '/'} variant="outline" className="border-slate-600 text-slate-300">
            <Icon name="Home" size={16} className="mr-2" />
            Главная
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setActiveTab('knowledge')}
            variant={activeTab === 'knowledge' ? 'default' : 'outline'}
            className={activeTab === 'knowledge' ? '' : 'border-slate-600 text-slate-300'}
          >
            База знаний
          </Button>
          <Button
            onClick={() => setActiveTab('prompts')}
            variant={activeTab === 'prompts' ? 'default' : 'outline'}
            className={activeTab === 'prompts' ? '' : 'border-slate-600 text-slate-300'}
          >
            Промпты
          </Button>
        </div>

        {activeTab === 'knowledge' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Документы</h2>
              <Button onClick={() => { setEditDoc(null); setShowDocForm(true); }}>
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить
              </Button>
            </div>

            {showDocForm && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editDoc ? 'Редактировать' : 'Новый'} документ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Название</label>
                    <Input
                      value={editDoc?.title || ''}
                      onChange={(e) => setEditDoc({ ...editDoc, title: e.target.value } as KnowledgeDoc)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Категория</label>
                    <Input
                      value={editDoc?.category || ''}
                      onChange={(e) => setEditDoc({ ...editDoc, category: e.target.value } as KnowledgeDoc)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Содержимое</label>
                    <Textarea
                      value={editDoc?.content || ''}
                      onChange={(e) => setEditDoc({ ...editDoc, content: e.target.value } as KnowledgeDoc)}
                      rows={10}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveDoc(editDoc!)}>Сохранить</Button>
                    <Button onClick={() => { setShowDocForm(false); setEditDoc(null); }} variant="outline" className="border-slate-600 text-slate-300">
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {docs.map(doc => (
                <Card key={doc.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{doc.category}</p>
                        <p className="text-slate-300 mt-2 line-clamp-2">{doc.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditDoc(doc); setShowDocForm(true); }}
                          className="text-slate-300 hover:text-white"
                        >
                          <Icon name="Edit" size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDoc(doc.id)}
                          className="text-slate-300 hover:text-red-400"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Системные промпты</h2>
              <Button onClick={() => { setEditPrompt(null); setShowPromptForm(true); }}>
                <Icon name="Plus" size={20} className="mr-2" />
                Добавить
              </Button>
            </div>

            {showPromptForm && (
              <Card className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {editPrompt ? 'Редактировать' : 'Новый'} промпт
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Название</label>
                    <Input
                      value={editPrompt?.name || ''}
                      onChange={(e) => setEditPrompt({ ...editPrompt, name: e.target.value } as SystemPrompt)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Модель AI</label>
                    <Select
                      value={editPrompt?.ai_model || 'yandex-gpt'}
                      onValueChange={(v) => setEditPrompt({ ...editPrompt, ai_model: v } as SystemPrompt)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="yandex-gpt" className="text-white">YandexGPT</SelectItem>
                        <SelectItem value="gigachat" className="text-white">GigaChat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editPrompt?.is_active ?? true}
                      onChange={(e) => setEditPrompt({ ...editPrompt, is_active: e.target.checked } as SystemPrompt)}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium text-slate-300">Активен</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Текст промпта</label>
                    <Textarea
                      value={editPrompt?.prompt_text || ''}
                      onChange={(e) => setEditPrompt({ ...editPrompt, prompt_text: e.target.value } as SystemPrompt)}
                      rows={10}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => savePrompt(editPrompt!)}>Сохранить</Button>
                    <Button onClick={() => { setShowPromptForm(false); setEditPrompt(null); }} variant="outline" className="border-slate-600 text-slate-300">
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {prompts.map(prompt => (
                <Card key={prompt.id} className="bg-slate-900/50 border-slate-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{prompt.name}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${prompt.is_active ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}>
                            {prompt.is_active ? 'Активен' : 'Неактивен'}
                          </span>
                          <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-400">
                            {prompt.ai_model}
                          </span>
                        </div>
                        <p className="text-slate-300 line-clamp-3">{prompt.prompt_text}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditPrompt(prompt); setShowPromptForm(true); }}
                        className="text-slate-300 hover:text-white"
                      >
                        <Icon name="Edit" size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeAdmin;
