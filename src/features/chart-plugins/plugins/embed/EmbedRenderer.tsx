import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ChartRendererProps } from '../../types';
import type { EmbedConfigType } from './schema';

export function EmbedRenderer({ 
  config,
}: ChartRendererProps<EmbedConfigType>) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!config.url) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center text-muted-foreground"
        data-testid="embed-empty"
      >
        <p>請設定嵌入網址</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" data-testid="embed-widget">
      {isLoading && (
        <div className="absolute inset-0 z-10" data-testid="embed-loading">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      <iframe
        src={config.url}
        title={config.title || '嵌入報表'}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        data-testid="embed-iframe"
      />
    </div>
  );
}
