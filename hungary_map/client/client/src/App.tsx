import './App.css';
import { data } from './data';
import MapView from './MapView';


function App() {
   return (
      <div className="App container">
         <MapView garbages={data} 
         />
      </div>
   );
}

export default App;