import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Fee from "./pages/fee";
import Students from "./pages/students";
import Batches from "./pages/batches";
import Attendence from "./pages/attendence";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Info from "./pages/info";
import EditStudent from "./components/EditStudent";

function App() {
  return (
    <>
      

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Info />
                </ProtectedRoute>
              }
            />

            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <Students />
                </ProtectedRoute>
              }
            />
               <Route
        path="/students/edit/:id"
        element={
          <ProtectedRoute>
            <EditStudent />
          </ProtectedRoute>
        }
      />
            <Route
              path="/fee"
              element={
                <ProtectedRoute>
                  <Fee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendence"
              element={
                <ProtectedRoute>
                  <Attendence />
                </ProtectedRoute>
              }
            />
            <Route
              path="/batch"
              element={
                <ProtectedRoute>
                  <Batches />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Navigate to="/login" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
