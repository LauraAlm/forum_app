import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../plugins/http';

function CategoryForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleCategoryCreation = async (event) => {
    event.preventDefault();

    const categoryTitle = event.target.elements.category.value;

    try {
      const response = await http.post('createCategory', { categoryTitle });

      if (response.success) {
        navigate('/forum');
      } else {
        setError(
          response.message + ' Only administrators can create new categories.'
        );
        setSuccess(false);
      }
    } catch (error) {
      setError(
        'An error occured during category submission. Please try again.'
      );
      setSuccess(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleCategoryCreation} className='registration-form'>
        <div className='background-image' />
        <h2>Create new category</h2>
        <input
          type='text'
          name='category'
          placeholder='Category title'
          required
        />

        {error && <div className='error'>{error}</div>}

        <button type='submit' className='primary-btn'>
          Continue
        </button>
      </form>
    </div>
  );
}

export default CategoryForm;
