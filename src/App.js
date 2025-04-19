import { useEffect } from 'react';
import './App.css';
import BitmovinPlayer from './Player';

function App() {
  useEffect(() => {
    console.log('log---2')
  }, [])

  return (
    <div className="App">
      <div style={{ width: '100%', height: '100%' }}>
        <BitmovinPlayer />
      </div>
    </div>
  );
}

export default App;
