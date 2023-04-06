import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import FormComponent from "./FormComponent";
import Header from "./Header";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
function App() {
  return (
    <Router>
      <div className="bg-gradient-to-r h-screen flex flex-col from-indigo-200 via-red-200 to-yellow-100 ">
        <Header />
        <div className=" flex flex-1  items-center justify-center">
          <Routes>
            <Route path="/" Component={FormComponent} />
            {/* <FormComponent /> */}
            {/* </Route> */}
            <Route path="/bookings/:id" Component={BookingList} />
            {/* <BookingList /> */}
            {/* </Route> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function BookingList() {
  const [bookings, setBookingd] = useState([]);
  const { id } = useParams();

  async function getBookings() {
    const response = await fetch("http://localhost:4000/api/bookings/" + id);

    const data = await response.json();

    setBookingd(data);
    console.log(data);
  }

  useEffect(() => {
    getBookings();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-slate-500 mb-5">My Bookings</h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li key={booking.bookingDate} className="flex items-center  border rounded-lg p-4 bg-slate-100">
            <div className="flex-1 px-1 mx-3">
              <strong className="text-slate-500 text-lg">{booking.courtType}</strong>
            </div>
            <div className="flex items-center  space-x-3">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-500" />
              <span className="text-slate-500 font-semibold">{booking.timeSlot}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
