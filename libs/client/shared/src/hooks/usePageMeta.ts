import { useEffect, useRef } from 'react';

export function usePageMeta(title: string, favicon: string) {
  const documentDefined = typeof document !== 'undefined';
  const originalTitle = useRef(documentDefined ? document.title : null);

  useEffect(() => {
    if (!documentDefined) return;
    if (document.title !== title) document.title = title;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      // @ts-expect-error ts(2322)
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    // @ts-expect-error ts(2322)
    link.href = favicon;

    return () => {
      document.title = originalTitle.current;
    };
  }, []);
}
