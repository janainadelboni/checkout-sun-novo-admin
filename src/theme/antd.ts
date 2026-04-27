import { theme, type ThemeConfig } from 'antd';

import tokens from './tokens.json';

const antdTheme = (isDark: boolean): ThemeConfig => {
  const { token, components } = tokens;

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token,
    components
  };
};

export default antdTheme;
