import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.filter((user) => user.role !== "admin"));
    } catch {
      alert("Users loading failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch {
      alert("User deletion failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-7">Manage Users</h1>

      <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-500"
                  >
                    <FiTrash2 size={19} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}