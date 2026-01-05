import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface InlineEditNameProps {
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  maxLength?: number;
}

export function InlineEditName({ value, onSave, onCancel, maxLength = 50 }: InlineEditNameProps) {
  const [editValue, setEditValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const validate = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return '名稱不可為空';
    if (trimmed.length > maxLength) return `名稱不可超過 ${maxLength} 字元`;
    return null;
  };

  const handleSave = () => {
    const validationError = validate(editValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSave(editValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => {
          setEditValue(e.target.value);
          setError(null);
        }}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8"
        data-testid="inline-edit-input"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
