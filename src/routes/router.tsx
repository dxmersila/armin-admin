import { createBrowserRouter } from "react-router";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardPage from "../pages/admin/DashboardPage";
import ItemsPage from "../pages/admin/ItemsPage";
import ItemDetailPage from "../pages/admin/ItemDetailPage";
import CreateItemPage from "../pages/admin/CreateItemPage";
import EditItemPage from "../pages/admin/EditItemPage";
import CategoriesPage from "../pages/admin/CategoriesPage";
import CreateCategoryPage from "../pages/admin/CreateCategoryPage";
import CategoryDetailPage from "../pages/admin/CategoryDetailPage";
import EditCategoryPage from "../pages/admin/EditCategoryPage";
import OrdersPage from "../pages/admin/OrdersPage";
import OrderDetailPage from "../pages/admin/OrderDetailPage";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
    ],
  },
  {
    path: "/admin",
    Component: ProtectedRoute,
    children: [
      {
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: DashboardPage,
          },
          {
            path: "dashboard",
            Component: DashboardPage,
          },
          {
            path: "items",
            Component: ItemsPage,
          },
          {
            path: "items/create",
            Component: CreateItemPage,
          },
          {
            path: "items/:id",
            Component: ItemDetailPage,
          },
          {
            path: "items/:id/edit",
            Component: EditItemPage,
          },
          {
            path: "categories",
            Component: CategoriesPage,
          },
          {
            path: "categories/create",
            Component: CreateCategoryPage,
          },
          {
            path: "categories/:id",
            Component: CategoryDetailPage,
          },
          {
            path: "categories/:id/edit",
            Component: EditCategoryPage,
          },
          {
            path: "orders",
            Component: OrdersPage,
          },
          {
            path: "orders/:id",
            Component: OrderDetailPage,
          },
        ],
      },
    ],
  },
]);
