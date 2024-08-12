// let obj = [{
//     title: "today's task",
//     description: "need to complete till monday",
//     status:"wokring on it"
//    },
//    {
//      title: "today's task",
//      description: "need to complete till monday",
//      status:"wokring on it"
//     },
//     {
//      title: "today's task",
//      description: "need to complete till monday",
//      status:"wokring on it"
//     },
//  ];

//  export default obj;
import Task from './task';

function TaskList({ tasks, deleteTask, fetchTasks }) {
  return (
    <>
      {tasks?.map(task => (
        <Task
          key={task.id}
          id={task.id}
          fileUpload={task.file_upload} 
          title={task.title}
          description={task.description}
          status={task.status}
          deleteTask={deleteTask} 
          fetchTasks={fetchTasks}
        />
      ))}
    </>
  );
}

export default TaskList;