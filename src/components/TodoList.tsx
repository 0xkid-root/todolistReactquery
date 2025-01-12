import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TodoFilter } from '@/types/todo';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo.mutate(newTodo.trim());
      setNewTodo('');
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-center">Todo List</h1>
        <p className="text-muted-foreground text-center">
          {activeTodosCount} items left
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1"
        />
        <Button type="submit" disabled={!newTodo.trim()}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="flex gap-2 justify-center">
        {(['all', 'active', 'completed'] as const).map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            onClick={() => setFilter(filterType)}
            className="capitalize"
          >
            {filterType}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <button
                onClick={() => toggleTodo.mutate(todo.id)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {todo.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm font-medium',
                    todo.completed && 'line-through text-muted-foreground'
                  )}
                >
                  {todo.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {format(new Date(todo.createdAt), 'PP')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo.mutate(todo.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {todos.some((todo) => todo.completed) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => clearCompleted.mutate()}
            className="text-sm"
          >
            Clear completed
          </Button>
        </div>
      )}
    </Card>
  );
}