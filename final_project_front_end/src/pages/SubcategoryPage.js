import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import { useNavigate } from 'react-router';
import { useStore } from '../store/myStore';
import { useParams, Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

import http from '../plugins/http';
import PrivateMessageModal from '../components/PrivateMessageModal';

const SubcategoryPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user } = useStore((state) => state);
  const [showPrivateMessageModal, setShowPrivateMessageModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [commentsPerPage] = useState(4);

  const [subcategory, setSubcategory] = useState(null);
  const [comments, setComments] = useState([]);

  const { subcategoryId, categoryTitle } = useParams();

  const getSubcategory = () => {
    http
      .getWithToken(`getSubcategory/${subcategoryId}`)
      .then((data) => {
        setSubcategory(data.data);
      })
      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  const getCommentsBySubcategoryId = () => {
    http
      .getWithToken(`getCommentsBySubcategoryId/${subcategoryId}`)
      .then((data) => {
        console.log(data.data);
        setComments(data.data);
      })
      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  useEffect(() => {
    getSubcategory();
    getCommentsBySubcategoryId();
  }, []);

  const handleCommentcreation = async (event) => {
    event.preventDefault();
    const text = event.target.elements.text.value;
    const url = event.target.elements.url.value;

    const comment = { text, url };
    try {
      const response = await http.post(
        `/createComment/${subcategoryId}`,
        comment
      );
      if (response.success) {
        comment.user = [{ username: user.username }];
        setComments([...comments, comment]);

        setError('Your comment has been submitted!');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(
        'An error occurred during comment submission. Please try again.'
      );
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComment = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const handleSubmit = async (message, userId) => {
    console.log(userId);
    try {
      const response = await http.postWithToken(
        `sendPrivateMessage/${userId}`,
        {
          message: message,
        }
      );
      if (response.success) {
        setShowPrivateMessageModal(false);
      } else {
        setError('Error. Please try again.');
      }
    } catch (error) {
      setError(
        'An error occurred while sending the message. Please try again.'
      );
    }
  };

  const currentCommentDisplay = currentComment.map((comment, index) => (
    <div className='subcat-comment-description '>
      <p>{comment.text}</p>
      <div key={index}>
        <div className='subcat-comment-owner'>
          <div className='profile-img-circular'>
            <img src={comment.user[0].imgURL} alt='Profile image' />
          </div>
          <h6>{comment.user[0].username}</h6>
          <div>
            <button
              className='btn'
              onClick={() => {
                setShowPrivateMessageModal(true);
              }}
            >
              ✉︎
            </button>
            {showPrivateMessageModal && (
              <div>
                <PrivateMessageModal
                  isOpen={showPrivateMessageModal}
                  onClose={() => setShowPrivateMessageModal(false)}
                  onSubmit={handleSubmit}
                  userId={comment.user[0]._id}
                />{' '}
              </div>
            )}
          </div>
        </div>
        {comment.url && (
          <div className='subcat-url'>
            {comment.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
              <div>
                <img
                  src={comment.url}
                  alt='User comment'
                  className='comment-img'
                  style={{
                    height: '300',
                    width: '300',
                    objectFit: 'contain',
                  }}
                />
              </div>
            ) : (
              <div>
                <iframe
                  src={comment.url.replace('watch?v=', 'embed/')}
                  title='User comment video'
                  height='315'
                  width='560'
                ></iframe>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ));

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='forum-page'>
      <Toolbar />

      <div className='background-image-forum'>
        <div>
          {/* User photo & username */}
          <div className='forum-cat-list-subcat'>
            <div className='subcat-title-description'>
              {subcategory && (
                <div className='subcat-owner'>
                  <div className='subcat-owner-section'>
                    <div className='profile-img-circular'>
                      <img src={subcategory.user.imgURL} alt='Profile image' />
                    </div>

                    <div>
                      <p>{subcategory.user.username}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      className='btn'
                      onClick={() => {
                        setShowPrivateMessageModal(true);
                      }}
                    >
                      Send message
                    </button>
                    {showPrivateMessageModal && (
                      <div>
                        <PrivateMessageModal
                          isOpen={showPrivateMessageModal}
                          onClose={() => setShowPrivateMessageModal(false)}
                          onSubmit={handleSubmit}
                          userId={subcategory.user._id}
                        />{' '}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Topic & Description */}
              <div className=''>
                {subcategory && (
                  <div>
                    <h1>{subcategory.title}</h1>
                    <p>{subcategory.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              {/* Discussion: Comments from other users */}
              {currentCommentDisplay && (
                <div className='comment-section overflow-auto'>
                  {currentCommentDisplay}
                </div>
              )}
            </div>

            <div className='forum-pagination-button'>
              {/* Pagination */}
              <div className='comment-section-pagination'>
                <Pagination>
                  <Pagination.Prev
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        prevPage > 1 ? prevPage - 1 : prevPage
                      )
                    }
                  />
                  {Array.from(
                    {
                      length: Math.ceil(comments.length / commentsPerPage),
                    },
                    (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => paginate(index + 1)}
                        className='active-btn'
                      >
                        {index + 1}
                      </Pagination.Item>
                    )
                  )}
                  <Pagination.Next
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        prevPage < commentsPerPage ? prevPage + 1 : prevPage
                      )
                    }
                  />
                </Pagination>
              </div>
            </div>

            <div>
              {/* Comment message value & button */}
              <form onSubmit={handleCommentcreation} className='comment-form'>
                <input
                  className='comment-input-text'
                  type='text'
                  name='text'
                  placeholder='Write your comment here:...'
                  required
                />

                <input
                  className='comment-input-url'
                  type='text'
                  name='url'
                  placeholder='Insert your URL link here:'
                />

                {error && <div className='error'>{error}</div>}
                <button type='submit' className='primary-btn'>
                  Submit comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;
