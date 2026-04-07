import type { ThemeConfig } from 'antd'

/**
 * Rootzz Design System v1.2 — Tokens extraídos do Figma
 * Base: Ant Design com customizações de cor, tipografia e radius
 */
export const rootzzTheme: ThemeConfig = {
  token: {
    // Primary
    colorPrimary: '#0d2772',
    colorPrimaryBg: '#e1eaf7',
    colorPrimaryBgHover: '#b0c6eb',
    colorPrimaryBorder: '#83a3de',
    colorPrimaryBorderHover: '#5a80d1',
    colorPrimaryHover: '#355ec4',
    colorPrimaryActive: '#092691',
    colorPrimaryText: '#153eb8',
    colorPrimaryTextHover: '#355ec4',
    colorPrimaryTextActive: '#092691',

    // Info (derived from primary)
    colorInfo: '#153fb8',

    // Success
    colorSuccess: '#52c41a',
    colorSuccessBg: '#f6ffed',
    colorSuccessBorder: '#b7eb8f',
    colorSuccessHover: '#95de64',
    colorSuccessActive: '#389e0d',
    colorSuccessText: '#52c41a',
    colorSuccessTextHover: '#73d13d',
    colorSuccessTextActive: '#389e0d',

    // Warning
    colorWarning: '#faad14',
    colorWarningBg: '#fffbe6',
    colorWarningBorder: '#ffe58f',
    colorWarningHover: '#ffd666',
    colorWarningActive: '#d48806',
    colorWarningText: '#faad14',
    colorWarningTextHover: '#ffc53d',
    colorWarningTextActive: '#d48806',

    // Error
    colorError: '#ff4d4f',
    colorErrorBg: '#fff2f0',
    colorErrorBorder: '#ffccc7',
    colorErrorHover: '#ff7875',
    colorErrorActive: '#d9363e',
    colorErrorText: '#ff4d4f',
    colorErrorTextHover: '#ff7875',
    colorErrorTextActive: '#d9363e',

    // Link
    colorLink: '#153fb8',
    colorLinkHover: '#355ec4',
    colorLinkActive: '#092691',

    // Neutral text
    colorTextBase: '#000000',
    colorBgBase: '#ffffff',

    // Typography
    fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeSM: 12,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontWeightStrong: 600,
    lineHeight: 1.5714,
    lineHeightSM: 1.6667,
    lineHeightLG: 1.5,
    lineHeightHeading1: 1.2105,
    lineHeightHeading2: 1.2667,
    lineHeightHeading3: 1.3333,
    lineHeightHeading4: 1.4,
    lineHeightHeading5: 1.5,

    // Border radius
    borderRadius: 4,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // Sizing
    sizeStep: 4,
    sizeUnit: 4,
    controlHeight: 32,
    controlHeightLG: 40,
    controlHeightSM: 24,

    // Line
    lineWidth: 1,
    lineWidthBold: 2,

    // Borders
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
    colorSplit: 'rgba(0,0,0,0.06)',

    // Backgrounds
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // Fills
    colorFill: 'rgba(0,0,0,0.15)',
    colorFillSecondary: 'rgba(0,0,0,0.06)',
    colorFillTertiary: 'rgba(0,0,0,0.04)',
    colorFillQuaternary: 'rgba(0,0,0,0.02)',
  },
}
