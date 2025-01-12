import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Local storage helpers
const STORAGE_KEY = 'todos';

const getTodos = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTodos = (todos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addTodo = useMutation({
    mutationFn: (title) => {
      const newTodo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        createdAt: new Date().toISOString(),
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
    mutationFn: (id) => {
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
    mutationFn: (id) => {
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