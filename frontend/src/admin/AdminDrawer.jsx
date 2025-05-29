import Drawer from "@mui/material/Drawer";
// import { ImCross } from "react-icons/im";
import Sidebar from "../components/Sidebar";
// import kamaLogoWhite from "../assets/kama-logo-white.png";

const AdminDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
  // Props forwarded to Sidebar
  engravingLines,
  engravingData,
  selectedLine,
  handleInputChange,
  setSelectedLine,
  isProductTypeOpen,
  setIsProductTypeOpen,
  selectedJewelleryType,
  setSelectedJewelleryType,
  setProductDetails,
  handleAddEngravingLine,
  isRefreshClicked,
  setIsRefreshClicked,
  setIsLoading,
  activeTab,
}) => {
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      ModalProps={{
        keepMounted: true, 
      }}
      className="sm:block"
      sx={{
        "& .MuiDrawer-paper": {
          width: "60vw",
          backgroundColor: "#062538",
          color: "white",
          padding: "20px",
        },
      }}
    >
      <div className="w-auto flex flex-col gap-4 overflow-y-auto max-h-screen">
      

        <Sidebar
          engravingLines={engravingLines}
          engravingData={engravingData}
          selectedLine={selectedLine}
          handleInputChange={handleInputChange}
          setSelectedLine={setSelectedLine}
          sidebarOpen={true} // Always open inside drawer
          setSideBarOpen={setIsDrawerOpen}
          isProductTypeOpen={isProductTypeOpen}
          setIsProductTypeOpen={setIsProductTypeOpen}
          setSelectedJewelleryType={setSelectedJewelleryType}
          selectedJewelleryType={selectedJewelleryType}
          setProductDetails={setProductDetails}
          handleAddEngravingLine={handleAddEngravingLine}
          isRefreshClicked={isRefreshClicked}
          setIsRefreshClicked={setIsRefreshClicked}
          setIsLoading={setIsLoading}
          activeTab={activeTab}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </Drawer>
  );
};

export default AdminDrawer;
