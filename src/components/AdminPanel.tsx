import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';
import AdminHeader from '@/components/admin/AdminHeader';
import PasswordChangeCard from '@/components/admin/PasswordChangeCard';
import ApiKeysCard from '@/components/admin/ApiKeysCard';
import ModelSelectionCard from '@/components/admin/ModelSelectionCard';
import SystemPromptCard from '@/components/admin/SystemPromptCard';
import ImageGalleryCard from '@/components/admin/ImageGalleryCard';
import KnowledgeBaseCard from '@/components/admin/KnowledgeBaseCard';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [knowledgeBase, setKnowledgeBase] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, name: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const SETTINGS_API = 'https://functions.poehali.dev/c3585817-7caf-46b1-94b7-1c722a6f5748';
  const AUTH_API = 'https://functions.poehali.dev/5fedd0d4-3448-4585-bd85-f0e04e5983d3';

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    const storedSession = localStorage.getItem('adminSession');
    
    if (storedUser && storedSession) {
      const sessionTime = parseInt(storedSession);
      const currentTime = Date.now();
      const hourInMs = 60 * 60 * 1000;
      
      if (currentTime - sessionTime < 8 * hourInMs) {
        setAdminUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(SETTINGS_API);
      const data = await response.json();
      
      setSystemPrompt(data.system_prompt || '');
      setKnowledgeBase(data.knowledge_base || '');
      setSelectedModel(data.selected_model || 'openai/gpt-4o');
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      toast.error('Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(SETTINGS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: systemPrompt,
          knowledge_base: knowledgeBase,
          selected_model: selectedModel,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Настройки сохранены');
      } else {
        toast.error('Ошибка сохранения');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error('Не удалось сохранить настройки');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setAdminUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminSession');
    setAdminUser(null);
    setIsAuthenticated(false);
    toast.success('Вы вышли из системы');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} не является изображением`);
        continue;
      }

      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          
          setUploadedImages(prev => [...prev, {
            url: base64,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Не удалось загрузить ${file.name}`);
      }
    }

    toast.success('Картинки загружены!');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL скопирован! Добавьте в базу знаний как ![название](URL)');
  };

  const insertImageToKnowledge = (url: string, name: string) => {
    const imageMarkdown = `\n\n![${name}](${url})\n`;
    setKnowledgeBase(prev => prev + imageMarkdown);
    toast.success('Картинка добавлена в базу знаний');
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast.success('Картинка удалена');
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Пароль должен быть минимум 6 символов');
      return;
    }

    try {
      const response = await fetch(`${AUTH_API}?auth_action=change_password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminUser?.email,
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Пароль успешно изменён');
        setShowPasswordChange(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.error || 'Ошибка изменения пароля');
      }
    } catch (error) {
      toast.error('Не удалось изменить пароль');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordChange(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <AdminHeader
          onPasswordChange={() => setShowPasswordChange(!showPasswordChange)}
          onLogout={handleLogout}
        />

        {isLoading ? (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Icon name="Loader2" size={48} className="text-slate-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-400">Загрузка настроек...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {showPasswordChange && (
              <PasswordChangeCard
                oldPassword={oldPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                setOldPassword={setOldPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
                onSave={handleChangePassword}
                onCancel={handlePasswordCancel}
              />
            )}
            
            <ApiKeysCard />

            <ModelSelectionCard
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            <SystemPromptCard
              systemPrompt={systemPrompt}
              onSystemPromptChange={setSystemPrompt}
            />

            <ImageGalleryCard
              uploadedImages={uploadedImages}
              fileInputRef={fileInputRef}
              onImageUpload={handleImageUpload}
              onCopyUrl={copyImageUrl}
              onInsertToKnowledge={insertImageToKnowledge}
              onRemove={removeImage}
            />

            <KnowledgeBaseCard
              knowledgeBase={knowledgeBase}
              onKnowledgeBaseChange={setKnowledgeBase}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isSaving ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить изменения
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
