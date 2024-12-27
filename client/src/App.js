import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './layout/Navbar';
import ShoppingListOverview from './components/ShoppingListOverview';
import AddUserForm from './components/AddUserForm';
import UserPanel from './components/UserPanel';
import AdminPanel from './components/AdminPanel';
import ShoppingListDetail from './components/ShoppingListDetail';
import { enableMocking } from "./mockServer";

// Povolení mock serveru ihned při načítání souboru
if (process.env.NODE_ENV === "development") {
  enableMocking();
  console.log("Mock server enabled.");
}

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShoppingListOverview />}></Route>
          <Route path="/addUser" element={<AddUserForm />}></Route>
          <Route path="/userPanel" element={<UserPanel />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/list/:id" element={<ShoppingListDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
