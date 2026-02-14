import React, { useState, useEffect } from "react";
import { addFavorite, removeFavorite, isFavorite, ToolItem } from "../utils/favorites";
import { Heart } from "lucide-react";
import { useTheme } from "../ThemeContext";

interface Props {
  tool: ToolItem;
}

const FavoriteButton: React.FC<Props> = ({ tool }) => {
  const { theme } = useTheme();
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(tool.id));
  }, [tool.id]);

  const toggle = () => {
    if (fav) {
      removeFavorite(tool.id);
      setFav(false);
    } else {
      addFavorite(tool);
      setFav(true);
    }
  };

  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <Heart 
        color={fav ? "red" : "gray"} 
        fill={fav ? "red" : "none"} 
        className="w-5 h-5"
      />
    </button>
  );
};

export default FavoriteButton;
