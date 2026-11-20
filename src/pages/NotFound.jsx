import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <h1 className="text-8xl font-extrabold text-blue-600">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-slate-500 mt-3">The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary inline-block mt-7">
        Back to Home
      </Link>
    </div>
  );
}