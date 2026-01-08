import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ConfigFieldsProps } from '../../types';
import type { EmbedConfigType } from './schema';

export function EmbedConfigFields({
  value,
  onChange,
  errors,
}: ConfigFieldsProps<EmbedConfigType>) {
  const handleUrlChange = (url: string) => {
    onChange({ ...value, url });
  };

  return (
    <div className="space-y-4" data-testid="embed-config-fields">
      <div className="space-y-2">
        <Label htmlFor="embed-url">嵌入網址 *</Label>
        <Input
          id="embed-url"
          type="url"
          value={value.url || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/report"
          data-testid="embed-url-input"
        />
        {errors?.url && (
          <p className="text-sm text-destructive" data-testid="embed-url-error">
            {errors.url}
          </p>
        )}
      </div>
    </div>
  );
}
