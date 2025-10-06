import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const models = [
  "careers",
  "careerInfos",
  "courses",
  "learningPaths",
  "quizResults",
  "skillLearningPaths",
  "skills",
  "users",
];

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeModel, setActiveModel] = useState("careers");
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<any>({});

  if (!isAuthenticated || user?.email !== "admin@gmail.com") {
    return <div className="p-6 text-red-500">Access denied. Admins only.</div>;
  }

  const fetchItems = async () => {
    try {
      const res = await axios.get(`https://careerai-885x.onrender.com/admin/${activeModel}`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeModel]);

  const addItem = async () => {
    try {
      await axios.post(`https://careerai-885x.onrender.com/admin/${activeModel}`, newItem);
      setNewItem({});
      fetchItems();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const updateItem = async (id: string, updated: any) => {
    try {
      await axios.put(
        `https://careerai-885x.onrender.com/admin/${activeModel}/${id}`,
        updated
      );
      fetchItems();
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`https://careerai-885x.onrender.com/admin/${activeModel}/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-3 mb-4 flex-wrap">
        {models.map((m) => (
          <button
            key={m}
            onClick={() => setActiveModel(m)}
            className={`px-3 py-1 rounded ${
              activeModel === m ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <textarea
          placeholder={`New ${activeModel} (JSON)`}
          value={JSON.stringify(newItem)}
          onChange={(e) => {
            try {
              setNewItem(JSON.parse(e.target.value));
            } catch {
              setNewItem({});
            }
          }}
          className="border p-2 w-full h-24"
        />
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
        >
          Add
        </button>
      </div>

      {/* List of items */}
      <div>
        {items.map((item) => (
          <div
            key={item._id}
            className="border p-3 rounded mb-2 flex justify-between items-center"
          >
            <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateItem(item._id, { ...item, updatedAt: new Date() })
                }
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Update
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

