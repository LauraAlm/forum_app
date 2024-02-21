import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

import http from '../plugins/http';

const Forum = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(5);

  const getCategories = () => {
    http
      .getWithToken('getCategories')
      .then((data) => {
        setCategories(data.data);
      })
      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='forum-page'>
      <Toolbar />
      <div className='background-image-forum'>
        <div className='forum-cat-list'>
          {currentCategories && (
            <div>
              {currentCategories.map((category, index) => (
                <div className='category-link' key={index}>
                  <Link to={`/forum/${category.title}`}>
                    <h2>{category.title}</h2>
                    <h5>Topic amount: {category.subcategories.length}</h5>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className='forum-pagination-button'>
            <div></div>
            <div>
              <Pagination>
                <Pagination.Prev
                  onClick={() =>
                    setCurrentPage((prevPage) =>
                      prevPage > 1 ? prevPage - 1 : prevPage
                    )
                  }
                />
                {Array.from(
                  { length: Math.ceil(categories.length / categoriesPerPage) },
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
                      prevPage <
                      Math.ceil(categories.length / categoriesPerPage)
                        ? prevPage + 1
                        : prevPage
                    )
                  }
                />
              </Pagination>
            </div>
            <div className='forum-create-button'>
              {' '}
              <button
                className='primary-btn'
                onClick={() => navigate('/createCategory')}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
