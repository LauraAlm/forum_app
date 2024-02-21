import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';

import http from '../plugins/http';

const Chat = () => {
  const [messageOwners, setMessageOwners] = useState(null);
  const [displayedMessages, setDisplayedMessages] = useState(null);
  const [chosen, setChosen] = useState();
  const [error, setError] = useState();

  const getCurrentUsersChats = () => {
    http
      .getWithToken('getCurrentUsersChats/')
      .then((data) => {
        setMessageOwners(data.data);
        setChosen({ key: 0, userId: data.data[0].userId });
        setDisplayedMessages(data.data[0].messages);
      })
      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  const markMessagesAsRead = async (sender) => {
    try {
      const response = await http.postWithToken('markMessagesAsRead', {
        sender: sender,
      });
      if (response.success) {
      } else {
        console.log('Error');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageSelection = (username, userId, key) => {
    messageOwners.map((x) => {
      if (username == x.username) {
        setDisplayedMessages(x.messages);
      }
    });

    setChosen({ key: key, userId });

    markMessagesAsRead(userId);
  };

  useEffect(() => {
    getCurrentUsersChats();
  }, []);

  //send message function
  const handleSendMessage = async (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value;

    const message = { message: text };

    try {
      const response = await http.post(
        `/sendPrivateMessage/${chosen.userId}`,
        message
      );
      if (response.success) {
        setDisplayedMessages([...displayedMessages, { text: message.message }]);

        setError('Your message has been sent!');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(
        'An error occurred during message submission. Please try again.'
      );
    }
  };

  return (
    <div className='chat-page'>
      <div>
        <Toolbar />
      </div>

      <div className='chat-container'>
        <div className='chat-message-owner'>
          <h1>Inbox</h1>
          <div>
            {messageOwners && (
              <div>
                {messageOwners.map((owner, i) => (
                  <div
                    key={i}
                    className={i === chosen?.key ? 'user active' : 'user'}
                  >
                    <button
                      className='btn inbox-messenger'
                      onClick={() =>
                        handleMessageSelection(owner.username, owner.userId, i)
                      }
                    >
                      {owner.username}{' '}
                      {owner.unreadMessagesCount > 0
                        ? owner.unreadMessagesCount
                        : ''}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='chat-message-container'>
          <h1>Chat</h1>

          <div>
            {displayedMessages && (
              <div>
                {displayedMessages.map((message, i) => (
                  <div key={i} className='chat-message-section'>
                    {message.text}
                  </div>
                ))}
              </div>
            )}

            <div className='message-input-button-section'>
              {/*message value & button */}
              <form onSubmit={handleSendMessage} className='message-form'>
                <input
                  className='message-input-text'
                  type='text'
                  name='text'
                  placeholder='Write your message here:...'
                  required
                />

                {error && <div className='error'>{error}</div>}

                <button type='submit' className='primary-btn'>
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
