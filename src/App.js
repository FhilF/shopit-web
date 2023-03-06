import { useEffect, useState } from "react";
import SignIn from "pages/SignIn";
import CreateAccount from "pages/CreateAccount";

import {
  Routes,
  Route,
  Navigate,
  useRoutes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "utils/authProvider";
import GlobalLayout from "layouts/Global";
import ProfileLayout from "layouts/Profile";

import ProfilePage from "pages/User/Account";
import AddressPage from "pages/User/Account/Address";
import OrderPage from "pages/User/Account/Order";

import axios from "axios";
import Home from "pages/Home";
import ProductSearch from "pages/Product/ProductSearch";
import ProductView from "pages/Product/View";
import ShopView from "pages/Shop/View";
import Cart from "pages/Cart";
import Checkout from "pages/Checkout";
import View from "pages/User/Account/Order/View";
import Verify from "pages/verification/Verify";
import AccountSetup from "pages/AccountSetup";
import DialogEmailVerificationSent from "components/DialogEmailVerificationSent";
import Guide from "pages/Guide";
import { nodeEnv } from "config";
function App() {
  const { getSessionedUser, sessionedUserData, signout } = useAuth();

  const [openDeptDrawer, setOpenDeptDrawer] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showEmailVeriSent, setShowEmailVeriSent] = useState(false);
  console.log(nodeEnv);

  useEffect(() => {
    axios
      .get(`api/department?parentOnly=1`, {
        // withCredentials: true,
      })
      .then((res) => {
        setDepartments(res.data.Departments);
      })
      .catch((err) => {});
    getSessionedUser(setIsPageLoading);
  }, []);

  const globalRoutes = [
    {
      path: "/",
      element: (
        <Home departments={departments} setOpenDeptDrawer={setOpenDeptDrawer} />
      ),
    },
    {
      path: "/product/department",
      element: <Navigate to="/" />,
    },
    {
      path: "/product/department/:id",
      element: (
        <ProductSearch
          departmentList={departments}
          setOpenDeptDrawer={setOpenDeptDrawer}
        />
      ),
    },
    {
      path: "/product/:id",
      element: <ProductView />,
    },
    {
      path: "/shop/:id",
      element: <ShopView />,
    },
  ];
  return (
    <div className="App">
      <DialogEmailVerificationSent
        showEmailVeriSent={showEmailVeriSent}
        setShowEmailVeriSent={setShowEmailVeriSent}
      />
      {!isPageLoading && (
        <GlobalLayout
          sessionedUserData={sessionedUserData}
          signout={signout}
          openDeptDrawer={openDeptDrawer}
          setOpenDeptDrawer={setOpenDeptDrawer}
          departments={departments}
        >
          <Routes>
            <Route path="/verify/:email/:token" element={<Verify />} />
            <Route path="/guide" element={<Guide />} />
            {sessionedUserData ? (
              <>
                <Route path="/sign-in" element={<Navigate to="/" />}></Route>
                {
                  //session
                  !sessionedUserData.isEmailVerified ||
                  !sessionedUserData.isUserUpdated ? (
                    <Route path="/" element={<AccountSetup />} />
                  ) : (
                    <>
                      {globalRoutes.map((v, i) => (
                        <Route path={v.path} element={v.element} key={i} />
                      ))}
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route
                        path="/user/*"
                        element={
                          <ProfileLayout>
                            <Routes>
                              <Route
                                path="/"
                                element={<Navigate to="account/profile" />}
                              />
                              <Route
                                path="/account/*"
                                element={
                                  <Routes>
                                    <Route
                                      path="/"
                                      element={<Navigate to="profile" />}
                                    />
                                    <Route
                                      path="/profile"
                                      element={<ProfilePage />}
                                    />
                                    <Route
                                      path="/address"
                                      element={<AddressPage />}
                                    />
                                  </Routes>
                                }
                              />
                              <Route path="/order" element={<OrderPage />} />
                              <Route path="/order/:id" element={<View />} />
                            </Routes>
                          </ProfileLayout>
                        }
                      ></Route>
                    </>
                  )
                }
              </>
            ) : (
              //no session
              <>
                {globalRoutes.map((v, i) => (
                  <Route path={v.path} element={v.element} key={i} />
                ))}
                <Route path="/sign-in" element={<SignIn />}></Route>
                <Route
                  path="/create-account"
                  element={
                    <CreateAccount
                      setShowEmailVeriSent={setShowEmailVeriSent}
                    />
                  }
                ></Route>
              </>
            )}
          </Routes>
        </GlobalLayout>
      )}
    </div>
  );
}

export default App;
