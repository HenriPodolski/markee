import React, { Suspense } from 'react';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import DevelopStore from './DevelopStore';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <I18nextProvider i18n={i18n}>
    <RecoilRoot>
      <DevelopStore />
      <App />
    </RecoilRoot>
  </I18nextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
