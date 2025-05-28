import { useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import dashboardButton from "../images/dashboard_button.png";
import dashboardMobile from "../images/dashboardMobile.png";

function Sidebar({ showTopBar, onFavoritesClick, onAllTripsClick, onFutureTripsClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const onDashboard = location.pathname === "/dashboard";

  const isTripPage = /^\/trip\/\d+$/.test(location.pathname);
  const isReportPage = /^\/trip\/\d+\/report$/.test(location.pathname);

  const tripId = location.pathname.split("/")[2]; // Works for both /trip/:id and /trip/:id/report

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClick = () => {
    if (!onDashboard) navigate("/dashboard");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-[#16172A] text-white p-6 relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 120% 80% at top right, rgba(213,249,66,0.3) 0%, transparent 40%),
              radial-gradient(ellipse 120% 80% at 85% 10%, rgba(255,140,0,0.2) 0%, transparent 40%)`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <div className="mt-4 mb-6 text-center">
              <img src={logo} alt="Logo" className="mx-auto h-[4.5rem]" />
            </div>

            <div className="text-center mb-6">
              <img
                src={dashboardButton}
                alt="Dashboard"
                className={`mx-auto cursor-pointer ${
                  onDashboard ? "pointer-events-none opacity-100" : "hover:opacity-90"
                }`}
                onClick={handleClick}
              />
            </div>

            {onDashboard && (
              <nav className="space-y-4 mt-6 text-base font-semibold">
                <a
                  onClick={onAllTripsClick}
                  className="block px-4 py-2 rounded-md text-white hover:bg-[#2a2b45] hover:text-[#D5F942] cursor-pointer transition"
                >
                  Show All Trips
                </a>
                <a
                  onClick={onFavoritesClick}
                  className="block px-4 py-2 rounded-md text-white hover:bg-[#2a2b45] hover:text-[#D5F942] cursor-pointer transition"
                >
                  Show Favorite Trips
                </a>
                <a
                  onClick={onFutureTripsClick}
                  className="block px-4 py-2 rounded-md text-white hover:bg-[#2a2b45] hover:text-[#D5F942] cursor-pointer transition"
                >
                  Future Trips
                </a>
              </nav>
            )}

            {isTripPage && (
              <div className="mt-6 text-base font-semibold">
                <a
                  onClick={() => navigate(`/trip/${tripId}/report`)}
                  className="block px-4 py-2 rounded-md text-white hover:bg-[#2a2b45] hover:text-[#D5F942] cursor-pointer transition"
                >
                  View Spending Report
                </a>
              </div>
            )}

            {isReportPage && (
              <div className="mt-6 text-base font-semibold">
                <a
                  onClick={() => navigate(`/trip/${tripId}`)}
                  className="block px-4 py-2 rounded-md text-white hover:bg-[#2a2b45] hover:text-[#D5F942] cursor-pointer transition"
                >
                  Return to Trip
                </a>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="absolute bottom-6 left-6 flex items-center text-sm text-gray-400 hover:text-[#D5F942]"
            >
              <span className="mr-2">Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[#16172A] text-white shadow-md md:hidden transition-transform duration-300 ${
          showTopBar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="Logo" className="h-10" />
            <img
              src={dashboardMobile}
              alt="Dashboard"
              onClick={handleClick}
              className={`h-8 cursor-pointer ${
                onDashboard ? "pointer-events-none opacity-100" : "hover:opacity-90"
              }`}
            />
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center text-sm text-gray-400 hover:text-[#D5F942]"
          >
            <span className="mr-2">Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
          </button>
        </div>

        {(isTripPage || isReportPage) && (
          <div className="px-4 pb-3 text-center space-y-2">
            {isTripPage && (
              <button
                onClick={() => navigate(`/trip/${tripId}/report`)}
                className="w-full bg-[#2a2b45] text-white px-4 py-2 rounded hover:text-[#D5F942] transition text-sm font-semibold"
              >
                View Spending Report
              </button>
            )}
            {isReportPage && (
              <button
                onClick={() => navigate(`/trip/${tripId}`)}
                className="w-full bg-[#2a2b45] text-white px-4 py-2 rounded hover:text-[#D5F942] transition text-sm font-semibold"
              >
                Return to Trip
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
