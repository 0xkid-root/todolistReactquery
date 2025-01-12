import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Todo } from '@/types/todo';

// Simulated local storage persistence
const STORAGE_KEY = 'todos';

const getTodos = (): Todo[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addTodo = useMutation({
    mutationFn: (title: string) => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date(),
      };
      const updatedTodos = [...todos, newTodo];
      saveTodos(updatedTodos);
      return newTodo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const toggleTodo = useMutation({
    mutationFn: (id: string) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id: string) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const clearCompleted = useMutation({
    mutationFn: () => {
      const updatedTodos = todos.filter((todo) => !todo.completed);
      saveTodos(updatedTodos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
  };
};