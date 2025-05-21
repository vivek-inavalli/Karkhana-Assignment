import { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firsebase.js";
import { setUser, clearUser } from "./slices/authSlice";
import { fetchItems } from "./slices/itemsSlice";
import { fetchOtherCosts } from "./slices/otherCostsSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Extract only serializable fields you need
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          // add any other simple fields you want
        };

        dispatch(setUser(userData));
        dispatch(fetchItems(firebaseUser.uid));
        dispatch(fetchOtherCosts(firebaseUser.uid));
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
