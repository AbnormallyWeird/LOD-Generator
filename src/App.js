import './App.css';
import Clock from './clock.js'
import PeopleList from './peopleList';
import {PeopleProvider} from './peopleContext'
import LODSignups from './lodSignup';

function App() {
  return (
    <PeopleProvider>
      <div className="App">
        <Clock />
        <PeopleList />
      </div>
    </PeopleProvider>
  );
}

export default App;
