import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoList } from '@/components/TodoList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <TodoList />
      </div>
    </QueryClientProvider>
  );
}

export default App;