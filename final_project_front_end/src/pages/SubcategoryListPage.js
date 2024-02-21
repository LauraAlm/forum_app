import React, { useState, useEffect } from 'react';
import Toolbar from '../components/Toolbar';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';

import http from '../plugins/http';

const SubcategoryListPage = () => {
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [subcategoriesPerPage] = useState(4);

  const { categoryTitle } = useParams();

  const getSubcategories = () => {
    http
      .getWithToken(`getCategorywithSubcategories/${categoryTitle}`)
      .then((data) => {
        setSubcategories(data.data.subcategories);
      })
      .catch((error) => {
        console.log('Error while fetching data', error);
      });
  };

  useEffect(() => {
    getSubcategories();
  }, []);

  const indexOfLastSubcategory = currentPage * subcategoriesPerPage;
  const indexOfFirstSubcategory = indexOfLastSubcategory - subcategoriesPerPage;
  const currentSubcategories = subcategories.slice(
    indexOfFirstSubcategory,
    indexOfLastSubcategory
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='forum-page'>
      <Toolbar />

      <div className='background-image-forum'>
        <div className='forum-cat-list'>
          {currentSubcategories && (
            <div>
              {currentSubcategories.map((subcategory, index) => (
                <div className='subcategory-link' key={index}>
                  <Link to={`/forum/${categoryTitle}/${subcategory._id}`}>
                    <h3>{subcategory.title}</h3>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className='forum-pagination-button'>
            <div></div>
            <div>
              {' '}
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
                    length: Math.ceil(
                      subcategories.length / subcategoriesPerPage
                    ),
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
                      prevPage <
                      Math.ceil(subcategories.length / subcategoriesPerPage)
                        ? prevPage + 1
                        : prevPage
                    )
                  }
                />
              </Pagination>
            </div>

            <div className='forum-create-button'>
              <button
                className='primary-btn'
                onClick={() => navigate(`/createSubcategory/${categoryTitle}`)}
              >
                Create Subcategory
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryListPage;
