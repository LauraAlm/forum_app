import React from 'react';

const ChatUser = (owner, active, onClick) => {
  console.log(active);

  return (
    <div key={owner.owner.userId} className={active ? 'user active' : 'user'}>
      <button onClick={() => onClick}>{owner.owner.username}</button>
    </div>
  );
};

export default ChatUser;
