const SuccessModal = ({ send, setSend, message }) => {
  if (send)
    return (
      <div
        className="absolute z-[9999999] flex h-screen w-screen items-center justify-center bg-gray-700  bg-opacity-25"
        onClick={() => {
          setSend(false);
          // if (addCustomer) {
          //   dispatch(toggleModal());
          // } else if (deleteFile) {
          //   dispatch(closeModal());
          // }
        }}
      >
        <div className=" w-60 rounded-3xl bg-white px-5 py-8 text-center">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check "
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
          <h4 className="font-mtnwork text-xl font-medium">
            {message} successfully
          </h4>
        </div>
      </div>
    );
};

export default SuccessModal;
