export function EmptyWidgetContent() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-muted-foreground"
      data-testid="empty-widget-content"
    >
      <span className="text-2xl mb-2">📊</span>
      <span className="text-sm">尚未設定圖表</span>
    </div>
  );
}
