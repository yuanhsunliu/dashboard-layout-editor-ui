import html2canvas from 'html2canvas';

export async function captureWidget(widgetId: string): Promise<string | null> {
  const widgetElement = document.querySelector(
    `[data-widget-id="${widgetId}"]`
  ) as HTMLElement | null;

  if (!widgetElement) {
    console.warn(`Widget with id "${widgetId}" not found`);
    return null;
  }

  try {
    const canvas = await html2canvas(widgetElement, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      scale: 2,
    });

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to capture widget:', error);
    return null;
  }
}
