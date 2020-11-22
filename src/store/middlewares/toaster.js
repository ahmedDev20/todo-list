import { toast } from 'react-toastify';

const toaster = ({ dispatch }) => next => async action => {
  if (action.type !== 'toaster/error') return next(action);

  next(action);

  toast.error(action.payload.message || action.payload, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: false,
    pauseOnHover: false,
    progress: undefined,
  });
};

export default toaster;
