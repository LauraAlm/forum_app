import React, { useState, useEffect, useRef } from 'react';
import http from '../plugins/http';
import Toolbar from '../components/Toolbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState(null);
  const [subcategories, setSubcategories] = useState(null);
  const ref = useRef();
  const [error, setError] = useState('');

  const updateImage = async () => {
    const data = {
      imgURL: ref.current.value,
    };

    try {
      const response = await http.post(`updateImage/${user._id}`, data);

      if (response.success) {
        setUser((prevState) => ({ ...prevState, imgURL: data.imgURL }));
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(
        'An error occured during profile picture update. Please try again.'
      );
    }
  };

  const getUser = () => {
    http
      .getWithToken('/getCurrentUser')
      .then((data) => {
        setUser(data.data.currentUser);
        setComments(data.data.comments);
        setSubcategories(data.data.subcategories);
      })

      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <Toolbar />
      <div className='profile-container'>
        <div>
          {user && (
            <div className='profile-section-main'>
              <div className='profile-section-circular'>
                <img src={user.imgURL} alt='' />{' '}
              </div>
              <h1>{user.username}</h1>
              <p>Update profile picture below:</p>
              <input
                type='text'
                className='profile-img-update'
                ref={ref}
                placeholder='New user image URL'
              />

              {error && <div className='error'>{error}</div>}

              <div>
                <button className='primary-btn' onClick={updateImage}>
                  Update
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className='profile-section overflow-auto'>
            <h5>List of your comments on the forum:</h5>
            {comments && (
              <div>
                {comments.map((comment, index) => (
                  <div key={index}>
                    <h6>comment:</h6>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='profile-section overflow-auto'>
            <h5>List of subthemes you have created:</h5>
            {subcategories && (
              <div>
                {subcategories.map((subcategory, index) => (
                  <div key={index}>
                    <h6>subcategory:</h6>
                    <p>{subcategory.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
//  <h1>{user.username}</h1>
//

//
