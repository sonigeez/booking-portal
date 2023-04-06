import React, { useRef, useState } from "react";
import "./index.css";

export default function FormComponent(props) {
  const [collegeid, setcollegeid] = useState("");
  const sportRef = useRef(null);
  const timeRef = useRef(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function onClickHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    console.log(collegeid);
    console.log(sportRef.current.value);
    console.log(timeRef.current.value);
  
    try {
      const response = await fetch("http://localhost:4000/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: collegeid,
          courtType: sportRef.current.value,
          timeSlot: timeRef.current.value,
        }),
      });
  
      if (response.status === 200) {
        showSnackbar();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error booking");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  

  function showSnackbar() {
    setIsLoading(false);

    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  }

  return (
    <>
      {errorMessage && (
        <div className="fixed bottom-0 left-0 mb-8 ml-8 bg-red-500 text-white py-2 px-4 rounded">
          {errorMessage}
        </div>
      )}
      {snackbarVisible && (
        <div className="fixed bottom-0 right-0 mb-8 mr-8 bg-green-500 text-white py-2 px-4 rounded">
          Booking Confirmed!
        </div>
      )}
    
        <div className="bg-white bg-opacity-50 backdrop-blur-lg drop-shadow-lg rounded-lg p-8 space-y-4">
          <h1 className="text-3xl font-bold text-center">Booking Portal</h1>
          <form>
            <div>
              <label
                htmlFor="collegeid"
                className="block text-gray-700 font-bold mb-2"
              >
                collegeid
              </label>
              <input
                id="collegeid"
                name="collegeid"
                type="text"
                className="border border-gray-400 rounded px-4 py-2 w-full"
                value={collegeid}
                onChange={(e) => setcollegeid(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="sports"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Sports
                </label>
                <select
                  ref={sportRef}
                  id="sports"
                  name="sports"
                  className="border border-gray-400 rounded px-4 py-2 w-full"
                >
                  <option value="">--Select--</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="cricket">Cricket</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="time"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Time
                </label>
                <select
                  ref={timeRef}
                  id="time"
                  name="time"
                  className="border border-gray-400 rounded px-4 py-2 w-full"
                >
                  <option value="">Select</option>
                  <option value="7:30am-8:30am">7:30am-8:30am</option>
                  <option value="8:30am-9:30am">8:30am-9:30am</option>
                  <option value="7:30pm-8:30pm">7:30pm-8:30pm</option>
                  <option value="8:30pm-9:30pm">8:30pm-9:30pm</option>
                </select>
              </div>
            </div>
            <div className="text-center m-6">
              <button
                type="submit"
                className="text-white mx-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 my-2"
                onClick={onClickHandler}
              >
                {isLoading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
              <button
            type="reset"
            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={() => {
              setcollegeid("");
              sportRef.current.value = "";
              timeRef.current.value = "";
            }}
          >
            Reset
          </button>
            </div>
          </form>
        </div>
    </>
  );
}
