export interface ToolItem {
  id: string;
  name: string;
  path: string;
}

const KEY = "favorite_tools";

export const getFavorites = (): ToolItem[] => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const addFavorite = (tool: ToolItem) => {
  const favs = getFavorites();
  if (!favs.find(t => t.id === tool.id)) {
    localStorage.setItem(KEY, JSON.stringify([...favs, tool]));
  }
};

export const removeFavorite = (id: string) => {
  const favs = getFavorites().filter(t => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(favs));
};

export const isFavorite = (id: string) => {
  return getFavorites().some(t => t.id === id);
};