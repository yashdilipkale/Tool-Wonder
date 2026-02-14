import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export const addFavorite = async (tool: any) => {
  const user = auth.currentUser;
  console.log("addFavorite - Current user:", user);

  if (!user) {
    alert("Please login to add favorites");
    return;
  }

  try {
    console.log("addFavorite - Adding favorite for userId:", user.uid, "tool:", tool);
    await addDoc(collection(db, "favorites"), {
      userId: user.uid,
      toolId: tool.id,
      toolName: tool.name,
      toolPath: `/tool/${tool.id}`,
      createdAt: serverTimestamp()
    });

    alert("Added to favorites!");
  } catch (error) {
    console.error("addFavorite - Error:", error);
    alert("Error adding to favorites");
  }
};

export const getFavorites = async () => {
  const user = auth.currentUser;
  console.log("getFavorites - Current user:", user);

  if (!user) {
    console.log("getFavorites - No user logged in");
    return [];
  }

  try {
    console.log("getFavorites - Querying for userId:", user.uid);
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);
    console.log("getFavorites - Snapshot size:", snapshot.size);
    return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("getFavorites - Error:", error);
    return [];
  }
};

export const removeFavorite = async (id: string) => {
  try {
    await deleteDoc(doc(db, "favorites", id));
    alert("Removed from favorites!");
  } catch (error) {
    console.error(error);
    alert("Error removing from favorites");
  }
};
