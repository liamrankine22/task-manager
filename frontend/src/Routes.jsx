import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

import HeroLayout from "./layouts/HeroLayout";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HeroPage from "./pages/HeroPage";
import InvitePage from "./pages/InvitePage";
import TasksPage from "./pages/TasksPage";
import GroupsPage from "./pages/GroupsPage";
import GroupPage from "./pages/GroupPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import TaskPage from "./pages/TaskPage";

export const router = createBrowserRouter([
    //Hero
    {
        path: "/",
        Component: HeroLayout,
        children: [
            { index: true, element: <HeroPage /> },
        ],
    },

    //Auth
    {
        path: "/register",
        Component: AuthProtected,
        children: [
            {
                Component: AuthLayout,
                children: [
                    { index: true, element: <RegisterPage /> },
                ]
            }
        ]
    },

    {
        path: "invite/:token",
        Component: InvitePage,
    },

    {
        path: "/login",
        Component: AuthProtected,
        children: [
            {
                Component: AuthLayout,
                children: [
                    { index: true, element: <LoginPage /> },
                ]
            }
        ]
    },

    //App
    {
        path: "/app",
        Component: MainProtected,
        children: [
            {
                Component: AppLayout,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: "tasks", element: <TasksPage />},
                    { path: "tasks/:taskId", element: <TaskPage />},
                    { path: "groups", element: <GroupsPage />},
                    { path: "groups/:groupId", element: <GroupPage />},
                    { path: "calendar", element: <CalendarPage />},
                    { path: "settings", element: <SettingsPage />}
                ]
            }
        ],
    },

    //NotFound
    {
        path: "*",
        Component:NotFound,
    },
]);

function MainProtected() {
    const {user, loading} = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return <Outlet />;
}

function AuthProtected() {
    const {user, loading} = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
};