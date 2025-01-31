import { render } from 'preact';
import './components/Button/Button';
import './global.css';

export function App() {
  return (
    <div className="content-center ms-auto me-auto max-w-fit">
      <ix-button variant="outline">Button</ix-button>
    </div>
  );
}

render(<App />, document.getElementById('app'));
