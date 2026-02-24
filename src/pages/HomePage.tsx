import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Home</h1>
      <p className="mt-2">Logged in as: {user?.email}</p>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
