import { FaBalanceScale, FaTint, FaWeightHanging, FaGem, FaDollarSign, FaRupeeSign } from "react-icons/fa";
import { GiGoldBar, GiStonePile } from "react-icons/gi";
import { AiOutlineQuestionCircle } from "react-icons/ai";

const attributeIcons = {
  diamond_quality: <FaGem />, 
  diamond_color: <FaTint />, 
  // gold_weight: <FaWeightHanging />, 
  gross_weight: <FaWeightHanging />, 
  diamond_count: <GiStonePile />, 
  // stone_count: <GiStonePile />, 
  // amount: <FaDollarSign />, 
  amount: <FaRupeeSign />  , 
  gold_color: <GiGoldBar />, 
  // gold_carat: <FaBalanceScale />, 
  metal_kt: <FaBalanceScale />, 
  default: <AiOutlineQuestionCircle />,
};

export const getAttributeIcon = (attribute) => {
    const key = Object.keys(attributeIcons).find((key) => new RegExp(`\\b${key}\\b`, "i").test(attribute));
    return attributeIcons[key] || attributeIcons.default;
};
