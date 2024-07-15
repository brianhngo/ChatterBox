'use client';
import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import ProfileModal from './ProfileModal';
import axios from 'axios';

export default function LoginFeature() {
  const [isModal, setIsModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isProfileModal, setIsProfileModal] = useState(false);

  const toggleProfileModal = () => {
    setIsProfileModal(!isProfileModal);
  };

  // Toggles the modal true to false
  const toggleModal = () => {
    setIsModal(!isModal);
  };

  // this prevents modal being active and the user being able to scroll
  useEffect(() => {
    if (isModal) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
  }, [isModal]);

  const checkToken = async () => {
    let token = localStorage.getItem('token');
    if (token) {
      const { data } = await axios.put(
        'http://localhost:3001/api/profile/authenticate',
        {
          token: token,
        }
      );

      if (data) {
        // if token exist set token state true
        setHasToken(true);
      } else {
        return;
      }
    }
  };

  const handleSetHasToken = (state: boolean) => {
    setHasToken(state);
  };

  const logout = async (event: any) => {
    event.preventDefault();
    localStorage.removeItem('token');
    setHasToken(false);
  };

  // when page loads, we need to check if the token exist and if its still active
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      {hasToken === false ? (
        <div className="flex flex-row justify-center align-middle">
          <button
            onClick={toggleModal}
            type="button"
            className="text-white text-lg bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 h-[52px]">
            <svg
              className="mr-2  w-[40px] h-[20px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="WHITE"
              viewBox="0 0 32 32"
              version="1.1">
              <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z" />
            </svg>
            Login
          </button>

          {isModal ? (
            <LoginModal
              setHasToken={setHasToken}
              toggleModal={toggleModal}
              handleSetHasToken={handleSetHasToken}
            />
          ) : null}
        </div>
      ) : (
        <>
          <button
            onClick={toggleProfileModal}
            type="button"
            className="text-white text-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 h-[52px]">
            <svg
              className="mr-1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              fill="white"
              width="18px"
              height="18px"
              viewBox="0 0 20 20"
              version="1.1">
              <title>profile_round [#1346]</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="white"
                fillRule="evenodd">
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-380.000000, -2119.000000)"
                  fill="white">
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M338.083123,1964.99998 C338.083123,1962.79398 336.251842,1960.99998 334,1960.99998 C331.748158,1960.99998 329.916877,1962.79398 329.916877,1964.99998 C329.916877,1967.20599 331.748158,1968.99999 334,1968.99999 C336.251842,1968.99999 338.083123,1967.20599 338.083123,1964.99998 M341.945758,1979 L340.124685,1979 C339.561214,1979 339.103904,1978.552 339.103904,1978 C339.103904,1977.448 339.561214,1977 340.124685,1977 L340.5626,1977 C341.26898,1977 341.790599,1976.303 341.523154,1975.662 C340.286989,1972.69799 337.383888,1970.99999 334,1970.99999 C330.616112,1970.99999 327.713011,1972.69799 326.476846,1975.662 C326.209401,1976.303 326.73102,1977 327.4374,1977 L327.875315,1977 C328.438786,1977 328.896096,1977.448 328.896096,1978 C328.896096,1978.552 328.438786,1979 327.875315,1979 L326.054242,1979 C324.778266,1979 323.773818,1977.857 324.044325,1976.636 C324.787453,1973.27699 327.107688,1970.79799 330.163906,1969.67299 C328.769519,1968.57399 327.875315,1966.88999 327.875315,1964.99998 C327.875315,1961.44898 331.023403,1958.61898 334.733941,1959.04198 C337.422678,1959.34798 339.650022,1961.44698 340.05323,1964.06998 C340.400296,1966.33099 339.456073,1968.39599 337.836094,1969.67299 C340.892312,1970.79799 343.212547,1973.27699 343.955675,1976.636 C344.226182,1977.857 343.221734,1979 341.945758,1979 M337.062342,1978 C337.062342,1978.552 336.605033,1979 336.041562,1979 L331.958438,1979 C331.394967,1979 330.937658,1978.552 330.937658,1978 C330.937658,1977.448 331.394967,1977 331.958438,1977 L336.041562,1977 C336.605033,1977 337.062342,1977.448 337.062342,1978"
                      id="profile_round-[#1346]"></path>
                  </g>
                </g>
              </g>
            </svg>
            Profile
          </button>
          <button
            onClick={(event) => logout(event)}
            type="button"
            className="text-white text-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 h-[52px]">
            Logout
          </button>
          {isProfileModal ? (
            <ProfileModal toggleProfileModal={toggleProfileModal} />
          ) : null}
        </>
      )}
    </>
  );
}
