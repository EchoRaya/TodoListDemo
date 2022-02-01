import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState,useEffect,useRef } from 'react';
import { Button, Navbar,Modal } from "react-bootstrap";
import  {CardChecklist,Trash} from 'react-bootstrap-icons';
import  Container  from 'react-bootstrap/Container';
import  FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';

import ReactDOM from 'react-dom';

const storage=window.localStorage;

function useCallbackState (od) {
  const cbRef = useRef();
  const [data, setData] = useState(od);

  useEffect(() => {
      cbRef.current && cbRef.current(data);
  }, [data]);

  return [data, function (d, callback) {
      cbRef.current = callback;
      setData(d);
  }];
}


function fetchTodos(){
  let todoTasks=storage.getItem("todoTasks");
  if(eval(todoTasks)){
    todoTasks=JSON.parse(todoTasks);
    return todoTasks;
  }
  return [
    {
      id:1,
      title:"Hey, 这是一个用于追踪计划完成明细的清单,你可以点击下面的按钮,试着添加独属于你的计划任务",
      completed:false,
    }
  ]
}

function App(){
 const [todos,setTodos]=useCallbackState(fetchTodos());
 const [show, setShow] = useState(false);
 const handleClose = () => setShow(false);
 const handleShow = () => setShow(true);

 const handleAddItem=()=>{
  let todo={};
  todo.id=guid();
  todo.title=document.getElementById("todoItem").value;
  todo.completed=document.getElementById("ifCompleted").checked;
  todos.push(todo);
  setTodos(todos);
  setShow(false);
  save(todos);
}

  return (
  <>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">
          <CardChecklist/> 待办清单
        </Navbar.Brand>
      </Container>
    </Navbar>
    <Container>
      {todos.map((todo)=>(
        <TodoItem key={todo.id} 
        title={todo.title} 
        completed={todo.completed} 
        onDelete={()=>{
           setTodos(todos.filter((x)=>x.id!==todo.id),function (todos){
            save(todos);
           });
        }}
        onToggle={()=>{
          setTodos(todos.map((x)=>x.id==todo.id?{...x,completed:!x.completed}:x),function (todos){
            save(todos);
           });
        }}
        onEdit={(event)=>{
          setTodos(todos.map((x)=>x.id==todo.id?{...x,title:event.target.value}:x),function (todos){
            save(todos);
           });
        }}
        />
      ))}
      <div className="d-grid gap-2">
        <Button variant="primary" size="lg" onClick={handleShow}>
          新增待办
        </Button>
      </div>
    </Container>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>添加待办事项</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <InputGroup className="mb-3" >
          <InputGroup.Checkbox aria-label="是否已完成" id="ifCompleted" />
          <FormControl aria-label="输入待办事项" id="todoItem" placeholder="输入待办任务,勾选左侧代表已完成"/>
        </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleAddItem}  >
            保存
          </Button>
        </Modal.Footer>
      </Modal>

  </>);

  function save(todos) {
    storage.setItem("todoTasks", JSON.stringify(todos));
  }

  function TodoItem(props) {
    return (<InputGroup key={props.id}>
      <InputGroup.Checkbox checked={props.completed} onChange={props.onToggle}  />
      <FormControl  defaultValue={props.title}  onBlur={props.onEdit}   style={{ textDecoration: props.completed ? "line-through 4px" : "none", }} />
      <Button variant="outline-danger" onClick={props.onDelete}>
        <Trash/>
      </Button>
    </InputGroup>
    
    );
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  } 
  
}

ReactDOM.render(<App />, document.getElementById('root'));