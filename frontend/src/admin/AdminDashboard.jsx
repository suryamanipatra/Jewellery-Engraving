import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import kamaLogo from "../assets/kama-logo.png";
import { FaTimes } from "react-icons/fa";
import Header from "../common/Header";
import Card from "../components/Card";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography
} from '@mui/material';
import { FileUploadContext } from "../context/FileUploadContext";

const AdminDashboard = () => {
  const { engravings } = useContext(FileUploadContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    "Childrens",
    "Metal Earrings",
    "Color Bracelet",
    "Color Earring",
    "Color Necklace",
    "Color Ring",
    "Couple",
    "Diamond",
    "Family",
    "Love Belove",
    "Metal Necklace",
    "Metal Ring",
    "Initials",
    "Pearl",
  ];

  const products = [
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
    { name: "Pendant", type: "GenZ Silver Necklace" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const gridColumns = isSidebarOpen ? "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header
        kamaLogo={kamaLogo}
        userName="Arya"
        setSideBarOpen={toggleSidebar}
        setIsPopupOpen={() => { }}
        isPopupOpen={false}
        handleClose={() => { }}
        imageURLs={[]}
        capturePreview={() => { }}
        previewImage={null}
      />
      <div className="flex flex-1"> 
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: isSidebarOpen ? 280 : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: isSidebarOpen ? 280 : 0,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100%',
              backgroundColor: 'white',
              transition: 'width 0.3s',
              overflowX: 'hidden',
            },
          }}
          open={isSidebarOpen}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
            <FaTimes onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
          </div>

          <List>
            {categories.map((category, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton sx={{
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    mx: 1,
                  }
                }}>
                  <ListItemText
                    primary={category}
                    sx={{
                      '& .MuiListItemText-primary': {
                        color: '#374151',
                        fontSize: '0.875rem',
                      }
                    }}
                  />
                  <Typography color="text.secondary">›</Typography>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-200">
          <div className={`grid grid-cols-1 ${gridColumns} gap-4 p-4`}>
            {engravings.map((engraving) => (
              <Card
                key={engraving.id}
                imageUrl={engraving.imageUrl}
                name={engraving.name}
                onEngrave={() => navigate('/admin/engraving', {
                  state: { engraving }
                })}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;