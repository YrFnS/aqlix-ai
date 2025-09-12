import React from 'react';

export const ArabicTypography = ({ children }: { children: React.ReactNode }) => (
  <span className="arabic-typography" style={{ fontFamily: 'Noto Sans Arabic', lineHeight: 1.6 }}>
    {children}
  </span>
);
