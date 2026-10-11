/* eslint-disable @typescript-eslint/no-explicit-any */
// Tắt rule của ESLint không cho dùng any
declare module "just-validate" {
  //Nói với TypeScript rằng: Tin tôi đi, tồn tại một module tên là just-validate.

  const JustValidate: any;
  //Khai báo biến default export của module này có kiểu any.
  // Nghĩa là: Bạn có thể gọi nó như bình thường
  // Nhưng TypeScript sẽ không kiểm tra kiểu dữ liệu
  // Mọi thứ đều được phép (mất type safety)

  export default JustValidate;
  // Cho phép bạn import như bình thường:
}
