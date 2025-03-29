import { FaRing, FaCircleNotch , FaGem } from "react-icons/fa";
import { GiHeartEarrings, GiHeartNecklace } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const categoryIcons = { 
  ring: <FaRing />, 
  earring: <GiHeartEarrings />, 
  bracelet: <FaCircleNotch />, 
  necklace: <GiHeartNecklace />, 
  diamond: <FaGem />,
  default: <AiOutlineQuestionCircle />,
};

export const getCategoryIcon = (category) => {
    const key = Object.keys(categoryIcons).find((key) => new RegExp(`\\b${key}\\b`, "i").test(category));
    return categoryIcons[key] || categoryIcons.default;
};
  
