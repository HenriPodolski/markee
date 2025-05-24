import { render } from 'preact';
import './index.css';
import App from './app.tsx';

if (process.env.NODE_ENV === 'dev') {
    import('preact-devtools');
}

render(<App />, document.getElementById('app')!);
