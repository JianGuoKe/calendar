import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.less';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import './tracker';

console.log(
  `
    __ _____ _____ _____ _____ _____ _____ _____ _____ 
 __|  |     |  _  |   | |   __|  |  |     |  |  |   __|
|  |  |-   -|     | | | |  |  |  |  |  |  |    -|   __|
|_____|_____|__|__|_|___|_____|_____|_____|__|__|_____|
`
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ebc33f',
        },
      }}
      locale={locale}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
