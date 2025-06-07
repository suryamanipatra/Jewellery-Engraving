import Drawer from "@mui/material/Drawer";
import Sidebar from "../components/Sidebar";

const AdminDrawer = ({
  isDrawerOpen,
  setIsDrawerOpen,
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
  isDrawerContext = true 
}) => {
  return (
    <Drawer
      anchor="left"
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      ModalProps={{
        keepMounted: true,
      }}
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
          sidebarOpen={true}
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
          isDrawerContext={isDrawerContext} 
        />
      </div>
    </Drawer>
  );
};

export default AdminDrawer;