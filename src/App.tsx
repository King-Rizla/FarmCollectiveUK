
import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import routes from "tempo-routes";
import { AuthProvider } from "./context/AuthContext";

// Lazy load pages for better performance
const Marketplace = lazy(() => import("./pages/marketplace"));
const SocialFeed = lazy(() => import("./pages/social"));
const TokenRewards = lazy(() => import("./pages/rewards"));
const AboutUs = lazy(() => import("./pages/about"));
const JoinAsGrower = lazy(() => import("./pages/grower"));
const ContactUs = lazy(() => import("./pages/contact"));
const FAQ = lazy(() => import("./pages/faq"));
const ConsumerProfile = lazy(() => import("./pages/profile/consumer"));
const ProducerProfile = lazy(() => import("./pages/profile/producer"));
const Cart = lazy(() => import("./pages/cart"));
const Checkout = lazy(() => import("./pages/checkout"));
const SignInPage = lazy(() => import("./pages/signin"));
const SignUpPage = lazy(() => import("./pages/signup"));
const ProfilePage = lazy(() => import("./pages/profile"));
const NotFound = lazy(() => import("./pages/404"));

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/marketplace"
          element={
            <Suspense fallback={<Loading />}>
              <Marketplace />
            </Suspense>
          }
        />
        <Route
          path="/social"
          element={
            <Suspense fallback={<Loading />}>
              <SocialFeed />
            </Suspense>
          }
        />
        <Route
          path="/rewards"
          element={
            <Suspense fallback={<Loading />}>
              <TokenRewards />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<Loading />}>
              <AboutUs />
            </Suspense>
          }
        />
        <Route
          path="/grower"
          element={
            <Suspense fallback={<Loading />}>
              <JoinAsGrower />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<Loading />}>
              <ContactUs />
            </Suspense>
          }
        />
        <Route
          path="/faq"
          element={
            <Suspense fallback={<Loading />}>
              <FAQ />
            </Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <Suspense fallback={<Loading />}>
              <ProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/profile/consumer"
          element={
            <Suspense fallback={<Loading />}>
              <ConsumerProfile />
            </Suspense>
          }
        />
        <Route
          path="/profile/producer"
          element={
            <Suspense fallback={<Loading />}>
              <ProducerProfile />
            </Suspense>
          }
        />
        <Route
          path="/cart"
          element={
            <Suspense fallback={<Loading />}>
              <Cart />
            </Suspense>
          }
        />
        <Route
          path="/checkout"
          element={
            <Suspense fallback={<Loading />}>
              <Checkout />
            </Suspense>
          }
        />
        <Route
          path="/signin"
          element={
            <Suspense fallback={<Loading />}>
              <SignInPage />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<Loading />}>
              <SignUpPage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
