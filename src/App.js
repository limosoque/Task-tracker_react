import logo from './logo.svg';
import './App.css';

function App() {
  const tasks = [{title:"Clean", task:"Wash dishes"}, {title:"Cook", task:"Pizza"}];
  return (
    <div className='taskboard'>
      <Status title="Todo" tasks={ tasks }/>
      <Status title="In progress" tasks={ tasks }/>
      <Status title="Done" tasks={ tasks }/>
    </div>
  )
}

function Status({ title, tasks }) {
  return (
    <div className='status'>
      <h2>{ title }</h2>
      { tasks.map(task => (
        <Task task={ task } />
      ))}
    </div>
  );
}

function Task({ task }) {
  return (
    <div className='task'>
      <h3>{ task.title }</h3>
      <p>{ task.task }</p>
    </div>
  );
}

export default App;
