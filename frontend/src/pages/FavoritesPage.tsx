import React, { useEffect, useState } from "react";
import { getFavorites as fetchFavorites, removeFavorite } from "../firebase/favorites";
import { Link } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface FavoriteItem {
  id: string;
  toolId: string;
  toolName: string;
  toolPath: string;
  userId: string;
  createdAt: any;
}

const FavoritesPage: React.FC = () => {
  const { theme } = useTheme();
  const [tools, setTools] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async (uid: string) => {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    setTools(data as FavoriteItem[]);
    setLoading(false);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User logged in:", user.uid);
        loadFavorites(user.uid);
      } else {
        console.log("No user logged in");
        setTools([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const remove = async (id: string) => {
    await removeFavorite(id);
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      loadFavorites(user.uid);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Favorite Tools</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center py-10">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Favorite Tools</h1>

      {tools.length === 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-center py-10">
          No favorites yet. Login and add some tools to your favorites!
        </p>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {tools.map(t => (
          <div key={t.id} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 shadow bg-white dark:bg-slate-700">
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">{t.toolName}</h3>

            <div className="flex justify-between">
              <Link to={t.toolPath} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                Open
              </Link>

              <button
                onClick={() => remove(t.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
