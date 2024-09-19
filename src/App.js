
import {Route,Routes} from 'react-router-dom'
import TicketBoard from './components/TicketBoard';


function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketBoard />} />
    </Routes>
   
  );
}

export default App;
