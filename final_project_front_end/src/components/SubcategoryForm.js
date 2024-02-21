import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../plugins/http';

function SubcategoryForm() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { categoryTitle } = useParams();

  const handleSubcategoryCreation = async (event) => {
    event.preventDefault();

    const subcategoryTitle = event.target.elements.Title.value;
    const subcategoryDescription = event.target.elements.Description.value;

    try {
      const response = await http.post(`createSubcategory/${categoryTitle}`, {
        subcategoryTitle,
        subcategoryDescription,
      });
      console.log(response);
      if (response.success) {
        navigate('/forum/');
      } else {
        setError(response.message);
        setSuccess(false);
      }
    } catch (error) {
      setError(
        'An error occured during Subcategory submission. Please try again.'
      );
      setSuccess(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubcategoryCreation} className='registration-form'>
        <div className='background-image' />
        <h2>Create new Subcategory</h2>
        <input
          type='text'
          name='Title'
          placeholder='Subcategory title'
          required
        />
        <input
          type='text'
          name='Description'
          placeholder='Subcategory description'
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

export default SubcategoryForm;
