'use client';
import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
Link;
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function LoginFeature() {
  const router = useRouter();
  const [isModal, setIsModal] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Toggles the modal true to false
  const toggleModal = () => {
    setIsModal(!isModal);
    setIsSignUp(false);
  };

  const toggleSignUpModal = (value: boolean, value2: boolean) => {
    setIsModal(value2);
    setIsSignUp(value);
  };

  const navigateTo = (url: string) => {
    router.push(url);
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
    localStorage.removeItem('username');
    setHasToken(false);
    router.push('/');
  };

  // when page loads, we need to check if the token exist and if its still active
  useEffect(() => {
    checkToken();
  }, []);

  return (
    <>
      {hasToken === false ? (
        <div className="flex flex-row justify-center align-middle gap-5">
          <button
            onClick={() => toggleModal()}
            type="button"
            className="text-white text-lg bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg p-2 text-center inline-flex items-center justify-between  ">
            <svg
              className=" w-[40px] h-[20px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="WHITE"
              viewBox="0 0 32 32"
              version="1.1">
              <path d="M23.313 26.102l-6.296-3.488c2.34-1.841 2.976-5.459 2.976-7.488v-4.223c0-2.796-3.715-5.91-7.447-5.91-3.73 0-7.544 3.114-7.544 5.91v4.223c0 1.845 0.78 5.576 3.144 7.472l-6.458 3.503s-1.688 0.752-1.688 1.689v2.534c0 0.933 0.757 1.689 1.688 1.689h21.625c0.931 0 1.688-0.757 1.688-1.689v-2.534c0-0.994-1.689-1.689-1.689-1.689zM23.001 30.015h-21.001v-1.788c0.143-0.105 0.344-0.226 0.502-0.298 0.047-0.021 0.094-0.044 0.139-0.070l6.459-3.503c0.589-0.32 0.979-0.912 1.039-1.579s-0.219-1.32-0.741-1.739c-1.677-1.345-2.396-4.322-2.396-5.911v-4.223c0-1.437 2.708-3.91 5.544-3.91 2.889 0 5.447 2.44 5.447 3.91v4.223c0 1.566-0.486 4.557-2.212 5.915-0.528 0.416-0.813 1.070-0.757 1.739s0.446 1.267 1.035 1.589l6.296 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.809zM30.312 21.123l-6.39-3.488c2.34-1.841 3.070-5.459 3.070-7.488v-4.223c0-2.796-3.808-5.941-7.54-5.941-2.425 0-4.904 1.319-6.347 3.007 0.823 0.051 1.73 0.052 2.514 0.302 1.054-0.821 2.386-1.308 3.833-1.308 2.889 0 5.54 2.47 5.54 3.941v4.223c0 1.566-0.58 4.557-2.305 5.915-0.529 0.416-0.813 1.070-0.757 1.739 0.056 0.67 0.445 1.267 1.035 1.589l6.39 3.488c0.055 0.030 0.126 0.063 0.184 0.089 0.148 0.063 0.329 0.167 0.462 0.259v1.779h-4.037c0.61 0.46 0.794 1.118 1.031 2h3.319c0.931 0 1.688-0.757 1.688-1.689v-2.503c-0.001-0.995-1.689-1.691-1.689-1.691z" />
            </svg>
            Login
          </button>
          <button
            onClick={() => toggleSignUpModal(true, true)}
            type="button"
            className="text-white text-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg p-2 text-center inline-flex items-center justify-between  ">
            <svg
              className="w-[40px] h-[20px]"
              fill="WHITE"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              height="800px"
              width="800px"
              version="1.1"
              id="_x32_"
              viewBox="0 0 512 512"
              xmlSpace="preserve">
              <g>
                <polygon
                  className="st0"
                  points="374.107,448.835 34.01,448.835 34.01,194.102 164.947,194.102 164.947,63.165 374.107,63.165    374.107,96.698 408.117,64.049 408.117,29.155 164.947,29.155 34.01,160.092 0,194.102 0,482.845 408.117,482.845 408.117,282.596    374.107,318.034  "
                />
                <path
                  className="st0"
                  d="M508.609,118.774l-51.325-51.325c-4.521-4.522-11.852-4.522-16.372,0L224.216,275.561   c-1.344,1.344-2.336,2.998-2.889,4.815l-26.21,86.117c-2.697,8.861,5.586,17.144,14.447,14.447l88.886-27.052l210.159-218.741   C513.13,130.626,513.13,123.295,508.609,118.774z M243.986,349.323l-16.877-18.447l11.698-38.447l29.139,15.678l15.682,29.145   L243.986,349.323z M476.036,110.577L291.414,296.372l-11.728-11.728l185.804-184.631l10.547,10.546   C476.036,110.567,476.036,110.571,476.036,110.577z"
                />
              </g>
            </svg>
            Sign Up
          </button>

          {isModal ? (
            <LoginModal
              setHasToken={setHasToken}
              toggleModal={toggleModal}
              handleSetHasToken={handleSetHasToken}
              isSignUp={isSignUp}
              toggleSignUpModal={toggleSignUpModal}
            />
          ) : null}
        </div>
      ) : (
        <>
          <button
            className="text-white text-lg bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center justify-between mr-2 mb-2 h-[52px]"
            onClick={() => navigateTo('/Homepage')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="24px"
              height="24px"
              viewBox="0 0 20 20"
              version="1.1"
              className="text-white mr-3">
              <title>profile_image_round [#1326]</title>
              <desc>Created with Sketch.</desc>
              <defs></defs>
              <g
                id="Page-1"
                stroke="none"
                strokeWidth="1"
                fill="none"
                fillRule="evenodd">
                <g
                  id="Dribbble-Light-Preview"
                  transform="translate(-380.000000, -2199.000000)"
                  fill="#FFFFFF">
                  <g id="icons" transform="translate(56.000000, 160.000000)">
                    <path
                      d="M342,2055.615 C342,2055.722 341.97,2055.821 341.939,2055.918 C341.723,2052.974 339.918,2050.482 337.375,2049.283 C338.368,2048.369 339,2047.071 339,2045.615 C339,2043.534 337.728,2041.753 335.92,2041 L341,2041 C341.552,2041 342,2041.063 342,2041.615 L342,2055.615 Z M339.963,2057 L327.975,2057 C327.974,2057 327.969,2056.741 327.969,2056.701 C327.969,2053.605 330.326,2050.96 333.339,2050.645 C334,2050.733 334.255,2050.622 334.623,2050.576 C337.625,2050.902 339.969,2053.623 339.969,2056.71 C339.969,2056.75 339.964,2057 339.963,2057 L339.963,2057 Z M326,2055.615 L326,2041.615 C326,2041.063 326.448,2041 327,2041 L332.08,2041 C330.272,2041.753 329,2043.534 329,2045.615 C329,2047.06 329.622,2048.351 330.602,2049.264 C328.107,2050.422 326.307,2052.82 326.012,2055.675 C326.011,2055.654 326,2055.636 326,2055.615 L326,2055.615 Z M337,2045.615 C337,2047.055 335.979,2048.26 334.623,2048.548 C334.033,2048.5 333.868,2048.508 333.368,2048.545 C332.017,2048.254 331,2047.052 331,2045.615 C331,2043.961 332.346,2042.615 334,2042.615 C335.654,2042.615 337,2043.961 337,2045.615 L337,2045.615 Z M342,2039 L326,2039 C324.895,2039 324,2039.895 324,2041 L324,2057 C324,2058.104 324.895,2059 326,2059 L342,2059 C343.105,2059 344,2058.104 344,2057 L344,2041 C344,2039.895 343.105,2039 342,2039 L342,2039 Z"
                      id="profile_image_round-[#1326]"
                    />
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
        </>
      )}
    </>
  );
}
