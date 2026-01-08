import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface EmbedPreviewProps {
  url: string;
  title?: string;
}

export function EmbedPreview({ url, title }: EmbedPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const isValidUrl = url && (url.startsWith('http://') || url.startsWith('https://'));

  if (!isValidUrl) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">預覽</p>
        <div 
          className="border rounded-md h-48 flex items-center justify-center text-muted-foreground"
          data-testid="embed-preview-empty"
        >
          <p className="text-sm">請輸入有效的網址以預覽</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">預覽</p>
      <div 
        className="border rounded-md h-48 overflow-hidden relative"
        data-testid="embed-preview"
      >
        {isLoading && (
          <div className="absolute inset-0 z-10">
            <Skeleton className="w-full h-full" />
          </div>
        )}
        <iframe
          src={url}
          title={title || '嵌入報表'}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          data-testid="embed-preview-iframe"
        />
      </div>
    </div>
  );
}
