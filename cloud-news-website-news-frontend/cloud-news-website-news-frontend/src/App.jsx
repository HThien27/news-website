import { RouterProvider } from "react-router-dom";
import { ChangePasswordProvider } from "./contexts/ChangePasswordContext";
import { SavedArticlesProvider } from "./contexts/SavedArticlesContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { router } from "./routes";

function App() {
  return (
    <NotificationProvider>
      <SavedArticlesProvider>
        <ChangePasswordProvider>
          <RouterProvider router={router} />
        </ChangePasswordProvider>
      </SavedArticlesProvider>
    </NotificationProvider>
  );
}

export default App;