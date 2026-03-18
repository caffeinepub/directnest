import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { AppProvider } from "./context/AppContext";
import AddPropertyPage from "./pages/AddPropertyPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import HomePage from "./pages/HomePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-center" />
      <Outlet />
    </>
  ),
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

function getUser() {
  try {
    const s = localStorage.getItem("directnest_user");
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    if (!getUser()) throw redirect({ to: "/auth" });
  },
  component: HomePage,
});

const addPropertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/add-property",
  beforeLoad: () => {
    if (!getUser()) throw redirect({ to: "/auth" });
  },
  component: AddPropertyPage,
});

const propertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/property/$id",
  beforeLoad: () => {
    if (!getUser()) throw redirect({ to: "/auth" });
  },
  component: PropertyDetailPage,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  forgotPasswordRoute,
  indexRoute,
  addPropertyRoute,
  propertyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
