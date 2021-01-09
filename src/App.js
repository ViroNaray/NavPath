import './App.css';

import { useState } from 'react';
import Grid from './Components/Grid';
import Introduction from './Components/Introduction';

function App() {
  const [showIntro, setIntroVisibility] = useState(true);

  return (
    <div className="App">
      {showIntro &&
        <Introduction closeIntro={() => setIntroVisibility(false)} />
      }
      <Grid openIntro={() => setIntroVisibility(true)} />
    </div>
  );
}

export default App;
