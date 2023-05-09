import { useDispatch } from "react-redux";
import { onCloseModal } from "../redux/systemSlice";

const Modal = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <div className="absolute z-10 h-screen w-screen bg-black/50 top-0 left-0 flex justify-center items-center">
      <div className="bg-white overflow-hidden rounded-md w-1/3">
        <div className="bg-red-500 text-white uppercase font-semibold flex justify-between items-center ">
          <h3 className="px-4">cảnh báo</h3>
          <button
            className="p-1 hover:bg-slate-300"
            onClick={() => dispatch(onCloseModal())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
