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
import { Box, Modal } from "@mantine/core";
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
import TesterGuides from "pages/TesterGuide";
import FAQs from "pages/FAQs";
function App() {
  const { getSessionedUser, sessionedUserData, signout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [openDeptDrawer, setOpenDeptDrawer] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [showEmailVeriSent, setShowEmailVeriSent] = useState(false);

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
    console.log("test");
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
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/tester-guide/" element={<TesterGuides />} />
            {sessionedUserData ? (
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
            ) : (
              //no session
              <>
                {globalRoutes.map((v, i) => (
                  <Route path={v.path} element={v.element} key={i} />
                ))}
                <Route path="/" element={<Navigate to="/sign-in" />}></Route>
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

const SessionRoutes = ({ departments, setOpenDeptDrawer }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            departments={departments}
            setOpenDeptDrawer={setOpenDeptDrawer}
          />
        }
      ></Route>
      <Route path="/product/department" element={<Navigate to="/" />}></Route>
      <Route
        path="/product/department/:id"
        element={
          <ProductSearch
            departmentList={departments}
            setOpenDeptDrawer={setOpenDeptDrawer}
          />
        }
      ></Route>
      <Route path="/product/:id" element={<ProductView />}></Route>
      <Route path="/shop/:id" element={<ShopView />}></Route>
      <Route path="/verify/:email/:token" element={<Verify />}></Route>
    </Routes>
  );
};

// const NoSessionRoutes = ({ departments, setOpenDeptDrawer }) => {
//   return (
//     <Routes>

//     </Routes>
//   );
// };

export default App;
