import { useEffect, useState } from 'react';
import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import globalRouter from './globalRouter';
import ResponsiveAppBar from './components/navbar/NavbarComponent';
import { ThemeProvider } from './theme/ThemeProvider';
import { Logout } from './axios/AxiosInstance';
import { CircularProgress } from '@mui/material';
import { useSetRecoilState } from 'recoil';
import { userState } from './recoil/RecoilAtoms';
import SnackbarComponent from './commonComponents/snackbar/SnackbarProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import ProtectedRoute from './components/RouteComponents/ProtectedRoute';
import CustomerRoutes from './components/RouteComponents/CustomerRoutes';
import UserRoutes from './components/RouteComponents/UserRoutes';
import BasicRoutes from './components/RouteComponents/BasicRoutes';
import PageNotFound from './components/RouteComponents/PageNotFound';
import { userInfoGetMe } from './apiCalls/apiUserCalls';

dayjs.locale('sv');

const App = () => {
  const navigate = useNavigate();
  globalRouter.navigate = navigate;
  const [loading, setLoading] = useState<boolean>(true);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const checkUserLogin = async () => {
      if (localStorage.getItem('TOKEN')) {
        try {
          const userRoleData = await userInfoGetMe();

          if (userRoleData.success) {
            setUser({
              loggedIn: true,
              isAdmin: userRoleData.data!.isAdmin,
              userId: userRoleData.data!.userId,
            });
          } else {
            Logout();
          }
        } catch (error) {
          Logout();
        }
      }
      setLoading(false);
    };

    checkUserLogin();
  }, []);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="App" style={{ display: 'grid' }}>
          {loading ? (
            <>
              <CircularProgress />
            </>
          ) : (
            <>
              <SnackbarComponent />
              <ResponsiveAppBar />
              <>
                <Routes>
                  {/* Home and Login */}
                  {BasicRoutes}

                  {/* Protected routes nested */}
                  <Route element={<ProtectedRoute />}>
                    {/* Logout, users and myaccount */}
                    {UserRoutes}
                    {/* Customer related pages */}
                    {CustomerRoutes}
                  </Route>
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </>
            </>
          )}
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
