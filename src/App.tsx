import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { AppRouter } from '@/routes';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="cotams-theme">
      <QueryProvider>
        <BrowserRouter>
          <AppRouter />
          <Toaster />
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  );
}

export default App;
