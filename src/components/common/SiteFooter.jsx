import { Link } from 'react-router-dom';

const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center">
              <img src="/logo.png" alt="Smart Meet" className="h-12 w-auto object-contain" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-600">
              Kết nối mọi người bằng nền tảng hợp tác video mượt mà, an toàn và gần với con người.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Sản phẩm</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/features" className="hover:text-white transition-colors">Tính năng</Link></li>
              <li><Link to="/features" className="hover:text-white transition-colors">Bảo mật</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Tích hợp</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Tải xuống</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Giải pháp</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/solutions#education" className="hover:text-white transition-colors">Giáo dục</Link></li>
              <li><Link to="/solutions#enterprise" className="hover:text-white transition-colors">Doanh nghiệp</Link></li>
              <li><Link to="/solutions#healthcare" className="hover:text-white transition-colors">Y tế</Link></li>
              <li><Link to="/solutions#remote" className="hover:text-white transition-colors">Nhóm từ xa</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Công ty</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li><Link to="/resources" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Nhật ký</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Liên hệ</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Smart Meet Inc. Đã đăng ký bản quyền.</p>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link to="/resources" className="hover:text-white transition-colors">Cài đặt cookie</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
