import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import FacultyDashboard from "@/pages/faculty-dashboard";
import StudentView from "@/pages/student-view";
import FacultyStatus from "@/pages/faculty-status";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FacultyDashboard} />
      <Route path="/faculty" component={FacultyDashboard} />
      <Route path="/student" component={StudentView} />
      <Route path="/faculty/:id" component={FacultyStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
