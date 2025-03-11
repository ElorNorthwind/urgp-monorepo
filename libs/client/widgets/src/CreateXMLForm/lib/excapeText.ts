// Helper to escape XML special characters
export const escapeXml = (unsafe: string): string => {
  return unsafe.replace(
    /[<>&'"]/g,
    (char) =>
      (
        ({
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          "'": '&apos;',
          '"': '&quot;',
        }) as Record<string, string>
      )[char],
  );
};
