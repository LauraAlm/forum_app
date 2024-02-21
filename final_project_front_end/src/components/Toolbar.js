import React from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../store/myStore';
import { useEffect } from 'react';
import http from '../plugins/http';

import Logo from '../components/Logo.png';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Toolbar() {
  const { user, setUser } = useStore((state) => state);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const autoLogin = localStorage.getItem('autoLogin');

  useEffect(() => {
    if (token && !user?.email) {
      http
        .getWithToken('getCurrentUser')
        .then((response) => {
          setUser({
            email: response.data.currentUser.email,
            username: response.data.currentUser.username,
          });
        })
        .catch((error) => {});
    }
  }, []);

  function userExist() {
    if (token) {
      navigate('/forum');
    } else {
      navigate('/auth');
    }
  }

  function logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('autoLogin');
    setUser(null);
    navigate('/auth');
  }

  return (
    <div className='nav-container'>
      <Navbar bg='light' expand='lg' className='d-flex justify-content-between'>
        <Navbar.Brand>
          <img className='toolbar-logo' src={Logo} alt='' onClick={userExist} />
        </Navbar.Brand>

        {token && user && (
          <p className='d-sm-block d-md-block d-lg-none'>
            Hi, {user.username}!
          </p>
        )}
        {token && (
          <div>
            <Navbar.Toggle aria-controls='basic-navbar-nav ' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='mr-auto nav-underline ml-3'>
                <Nav.Link href='/forum'>Forum</Nav.Link>
                <Nav.Link href='/chat'>Messages</Nav.Link>
                <Nav.Link href='/profile'>Profile</Nav.Link>
                <Nav.Link
                  className='d-sm-block d-md-block d-lg-none'
                  onClick={logOut}
                >
                  Log out
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        )}
        {token && (
          <div className='nav-greeting-logout'>
            {user && <p className='d-none d-lg-block'>Hi, {user.username}!</p>}
            <button
              className='d-none d-lg-block primary-btn'
              style={{ background: 'rgb(148, 148, 184)', border: 'none' }}
              onClick={logOut}
            >
              Log out
            </button>
          </div>
        )}
      </Navbar>
    </div>
  );
}

export default Toolbar;
