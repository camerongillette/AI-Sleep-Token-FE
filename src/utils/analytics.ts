// utils/analytics.ts

declare global {
    interface Window {
        dataLayer: Record<string, any>[];
    }
}

export const logPageView = (path: string): void => {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
        event: 'page_view',
        page_path: path,
        });
    } else {
        console.warn('dataLayer not found');
    }
};
export const logGeneratedTopic = (topicName: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'generated_topic',
      topic_name: topicName,
    });
  };
