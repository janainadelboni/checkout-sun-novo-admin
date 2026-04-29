import type { ThemeConfig } from 'antd';
import dsTheme from '@eduzz/design-tokens/theme';

// Wraps the Eduzz Design System theme with our app-level customizations.
// Source: https://github.com/eduzz-design/design-tokens (synced via `pnpm sync-tokens`)
const antdTheme = (isDark: boolean): ThemeConfig => ({
  ...dsTheme(isDark),
  cssVar: true,
  hashed: false,
});

export default antdTheme;
