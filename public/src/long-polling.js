import { useEffect, useState } from "react";
import axios from 'axios';
import './style.css';
import { v4 as uuid } from 'uuid';

const LongPollingChat = () => {
 const [userName, setUserName] = useState('');
 const [messages, setMessages] = useState(JSON.parse(localStorage.getItem('messages')) || []);
 const [value, setValue] = useState("");
 const [showLogin, setShowLogin] = useState(true);

 const id = uuid();
 
 const subscribeOnAuth = async () => {
  try {
   const { data } = await axios.get(`/login?id=${id}`);
   const name = `${data.firstName} ${data.lastName}`;
   setUserName(name);
   localStorage.setItem('userName', name);
   setShowLogin(false);
  } catch (err) {
   console.error(err);
   subscribeOnAuth();
  }
 };

 const subscribe = async () => {
  try {
   const { data } = await axios.get('/messages');
   setMessages((prev) => {
    const newMessages = [...prev, data.message];
    localStorage.setItem('messages', JSON.stringify(newMessages));
    return newMessages;
   });
   subscribe();
  } catch (err) {
   console.error(err);
   setTimeout(() => subscribe(), 500);
  }
 };
 useEffect(() => {
  const userName = localStorage.getItem('userName');
  if (userName) {
   setUserName(userName);
   setShowLogin(false);
   subscribe();
  } else {
   subscribeOnAuth()
    .then(() => subscribe());
  }
 }, []);

 const sendMessage = async () => {
  const saveMessage = {
    userName,
    text: value,
    date: Date.now()
   };
  try {
    await axios.post('/messages', saveMessage);
    await axios.post('/api/message', saveMessage);
    setMessages((prev) => {
      const newMessages = [...prev, saveMessage];
      localStorage.setItem('messages', JSON.stringify(newMessages));
      return newMessages;
    });
  } catch (err) {
    console.error(err);
  };
 };

 return (
  <>
   <div className="login" style={{ display: showLogin ? 'flex' : 'none' }}>
    <input type="text" value={id} readOnly />
   </div>
   <div className="container">
    <div className="form">
     <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)} />
     <button onClick={sendMessage}>Send message</button>
    </div>
    <div className="messages">
     {messages.map(message => <div>
      <div>
       <b>{message.userName}</b><br />
       <b style={{ fontSize: '10px' }}>{new Date(message.date).toISOString()}</b>
      </div>
      <div>{message.text}</div>
     </div>)}
    </div>
   </div>
  </>
 );
};

export default LongPollingChat;