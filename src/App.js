import './index.css'
import Todo from './components/Todo';
import Form from './components/Form';
import "./Form.css";
import FilterButton from './components/FilterButton';
import React, { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";

function App(props) {
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const [tasks, setTasks] = useState(props.tasks);

  const prevTaskLength = usePrevious(tasks.length);

  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed
  };
  const [filter, setFilter] = useState('All');
  const taskList = tasks.filter(FILTER_MAP[filter]).map((data) => <Todo key={data.id} name={data.name} completed={data.completed} editTask={editTask} deleteTask={deleteTask} id={data.id} toggleTaskCompleted={toggleTaskCompleted} />);
  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const FILTER_NAMES = Object.keys(FILTER_MAP);

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter} />
  ));

  const listHeadingRef = useRef(null);

  function addTask(name) {
    setTasks([...tasks, {
      id: `todo-${nanoid()}` + props.tasks.length, name: name, completed: false
    }]
    )
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        //
        return { ...task, name: newName }
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
