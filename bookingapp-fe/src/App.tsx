import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormLogin from './components/Login/FormLogin';
import ProtectedRoute from './Route/ProtectedRoute';
import LayoutApp from './components/Layout/Layout';
import ListBookingOfUser from './components/Bookings/ListBookingOfUser';
import InvitationList from './components/Bookings/InvitationList';
import PrivateRoute from './Route/PrivateRoute';
import Rooms from './components/Rooms/Rooms';
import UsersManager from './components/Users/UserManager';
import CalendarBooking from './components/Bookings/Bookings';
import Notification from './components/Notification/Notification';
import WaitingBookingList from './components/Bookings/WaitingBookingList';
import InfoUser from './components/InfoAccount/InfoUser';
import Dashboard from './components/DashBoard/DashBoard';

function App() {
  return (
    <div className='App'>
      <Notification />
      <Routes>
        <Route path='/login' element={<FormLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<LayoutApp />}>
            <Route path='/calendarmeeting' element={<CalendarBooking />} />
            <Route path='/bookingroom' element={<ListBookingOfUser />} />
            <Route path='/invitations' element={<InvitationList />} />
            <Route path='/informationaccount' element={<InfoUser/>}/>
            <Route element={<PrivateRoute />}>
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/roomManager' element={<Rooms />} />
              <Route path='/usermanager' element={<UsersManager />} />
              <Route path='/bookingmanager' element={<WaitingBookingList />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
