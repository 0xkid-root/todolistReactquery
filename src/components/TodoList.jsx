import { useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle, Trash2, PlusCircle, ListTodo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTodos } from '@/hooks/useTodos';
import { cn } from '@/lib/utils';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted } = useTodos();

  const handleSubmit = (e) => {
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
  const hasCompletedTodos = todos.some((todo) => todo.completed);

  return (
    <Card className="w-full max-w-2xl p-6 space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center items-center gap-2">
          <ListTodo className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Todo List</h1>
        </div>
        <p className="text-muted-foreground">
          {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
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
        <Button 
          type="submit" 
          disabled={!newTodo.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="flex gap-2 justify-center">
        {['all', 'active', 'completed'].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? 'default' : 'outline'}
            onClick={() => setFilter(filterType)}
            className={cn(
              'capitalize min-w-[100px]',
              filter === filterType
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'hover:bg-blue-50 hover:text-blue-600'
            )}
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
              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-blue-50 transition-colors group"
            >
              <button
                onClick={() => toggleTodo.mutate(todo.id)}
                className="text-blue-600 hover:text-blue-700 transition-colors"
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
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-50 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {hasCompletedTodos && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => clearCompleted.mutate()}
            className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
          >
            Clear completed
          </Button>
        </div>
      )}
    </Card>
  );
}