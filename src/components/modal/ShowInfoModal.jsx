import Swal from 'sweetalert2';

export function showInfoSwal({
  title = '해당기능은 준비중입니다!',
  icon = 'info',
  confirmButtonText = '확인',
  confirmButtonColor = '#222',
  willOpen,
  willClose,
  ...rest
} = {}) {
  let prevRootStyle = '';
  Swal.fire({
    icon,
    title,
    scrollbarPadding: false,
    confirmButtonColor,
    confirmButtonText,
    willOpen: () => {
      document.body.classList.add('swal-blur');
      const root = document.getElementById('root');
      if (root) {
        prevRootStyle = root.style.filter;
        root.style.filter = 'blur(4px)';
        root.style.pointerEvents = 'none';
        root.style.userSelect = 'none';
        root.style.transition = 'filter 0.1s';
      }
      if (willOpen) willOpen();
    },
    willClose: () => {
      document.body.classList.remove('swal-blur');
      const root = document.getElementById('root');
      if (root) {
        root.style.filter = prevRootStyle;
        root.style.pointerEvents = '';
        root.style.userSelect = '';
      }
      if (willClose) willClose();
    },
    ...rest,
  });
}
