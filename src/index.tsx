import React from 'react';
import './index.scss';
import App from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import { fetchFileSystem } from './store/slices/fileSystemSlice';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

store.dispatch(fetchFileSystem());

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <Provider store={store}>
        <App />
      </Provider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
