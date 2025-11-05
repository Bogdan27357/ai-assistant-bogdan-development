import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ImageGalleryCardProps {
  uploadedImages: Array<{ url: string; name: string }>;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCopyUrl: (url: string) => void;
  onInsertToKnowledge: (url: string, name: string) => void;
  onRemove: (index: number) => void;
}

const ImageGalleryCard = ({
  uploadedImages,
  fileInputRef,
  onImageUpload,
  onCopyUrl,
  onInsertToKnowledge,
  onRemove
}: ImageGalleryCardProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Image" size={24} />
          Галерея изображений
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label htmlFor="imageUpload">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить изображения
            </Button>
          </label>
        </div>

        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {uploadedImages.map((img, idx) => (
              <div key={idx} className="relative group bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <img src={img.url} alt={img.name} className="w-full h-32 object-cover" />
                <div className="p-2 space-y-2">
                  <p className="text-xs text-slate-400 truncate">{img.name}</p>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => onCopyUrl(img.url)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-slate-600"
                    >
                      <Icon name="Copy" size={12} className="mr-1" />
                      URL
                    </Button>
                    <Button
                      onClick={() => onInsertToKnowledge(img.url, img.name)}
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs border-slate-600"
                    >
                      <Icon name="Plus" size={12} className="mr-1" />
                      Добавить
                    </Button>
                    <Button
                      onClick={() => onRemove(idx)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-red-600 text-red-400"
                    >
                      <Icon name="Trash2" size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageGalleryCard;
