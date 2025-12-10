import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Layout from './Components/Layout';
import NewLand from './pages/Newland';
import UserRoles from './pages/UserRoles';
import Employee from './pages/Employess';
import LandVerification from './pages/Landverification';
import { DataEntry } from './pages/DataEntry';
import { Buyers } from './pages/Buyers';
import { Agent } from './pages/Agent';
import { LandCode } from './pages/LandCode';
import { Location } from './pages/Location';
import { LandList } from './pages/LandList';
import { MyProfile } from './pages/MyProfile';
import { BuyerForm } from './pages/BuyerForm';
import { TravelWallet } from './pages/TravelWallet';
import { UpdateModal } from './pages/UpdateModal';
import { SessionDetails } from './pages/SessionDetails';
import { AgentForm } from './pages/AgentForm';
import { LandWallet } from './pages/LandWallet';
import { LandDetails } from './pages/LandDetails';
import { UpdateLandModal } from './pages/UpdateLandModal';

function App() {

  return (
   <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="signup" element={<Signup />} />
          <Route path="land" element={<NewLand />} />
          <Route path="roles" element={<UserRoles />} />
          <Route path="employess" element={<Employee />} />
          <Route path="land-verification" element={<LandVerification />} />
          <Route path="data-entry" element={<DataEntry />} />
          <Route path="buyers" element={<Buyers />} />
          <Route path="agent" element={<Agent />} />
          <Route path="agent/forjm" element={<AgentForm />} />
          <Route path="land-code" element={<LandCode />} />
          <Route path="location" element={<Location />} />
          <Route path="land-list" element={<LandList />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="buyer/form" element={<BuyerForm />} />
          <Route path="travel/wallet" element={<TravelWallet />} />
          <Route path="updatetravel/wallet" element={<UpdateModal />} />
          <Route path="session" element={<SessionDetails />} />
          <Route path="land/wallet" element={<LandWallet />} />
          <Route path="updateLand/wallet" element={<LandDetails />} />
          <Route path="land/model" element={<UpdateLandModal />} />
        </Route>
        <Route index element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App
