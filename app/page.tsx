
"use client";
import App from '@/pages/App';
import { ConfigProvider, theme } from 'antd';

export default function Home(): JSX.Element {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <App />
    </ConfigProvider>
  );
}
