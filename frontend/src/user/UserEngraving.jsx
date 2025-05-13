import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";
import { generatePdfAndSendMail } from "../utils/pdfHelper.jsx";
import axios from "axios";
import { getAttributeIcon } from '../utils/DescriptionMapping.jsx'
import { Select, MenuItem, InputBase, styled, Drawer } from '@mui/material';
import { useParams } from "react-router-dom";
import TopHeader from "../common/TopHeader";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { BiCategoryAlt, BiSolidContact } from "react-icons/bi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { RiRefreshFill } from "react-icons/ri";
import { MdEmail, MdPreview } from "react-icons/md";
import {
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import Loader from "../common/Loader.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import EngravingStageForUser from "../components/engraving/EngravingStageForUser.jsx";
const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: '#D9D9D94F',
        color: 'white',
        padding: '10px 26px 10px 12px',
    },
}));
import myImage from "../assets/kama-logo.png";
import { useSelector } from 'react-redux';
import kamaLogoWhite from '../assets/kama-logo-white.png';

const UserEngraving = () => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [engravingLines, setEngravingLines] = useState([]);
    const [countries, setCountries] = useState([]);
    const [message, setMessage] = useState(null);
    const [inputValues, setInputValues] = useState({});
    const [error, setError] = useState(null);
    const [showLoader, setShowLoader] = useState(true);
    const [texts, setTexts] = useState({});
    const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
    const [engravingData, setEngravingData] = useState({});
    const stageRef = useRef(null);
    const [modifiedImages, setModifiedImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        message: ''
    });

    const { email } = useSelector((state) => state.auth);

    
        const fetchData = useCallback (async () => {
            try {
                setShowLoader(true);
                const detailsResponse = await axios.get(
                    `http://localhost:5000/api/get-details?jewelry_upload_id=${id}`
                );
                const detailsData = detailsResponse?.data;

                const imagesWithUrls = await Promise.all(
                    detailsData.map(async (item) => {
                        const fileResponse = await axios.get(
                            `http://localhost:5000/api/get-file/${item.file_path}`,
                            { responseType: "blob" }
                        );
                        const blob = new Blob([fileResponse.data]);
                        return {
                            ...item,
                            imageUrl: URL.createObjectURL(blob),
                            engraving_details: item.engraving_details[0] || null,
                        };
                    })
                );

                setImages(imagesWithUrls);
                if (imagesWithUrls.length > 0) {
                    console.log("imagesWithUrls", imagesWithUrls);
                    // const initialTexts = {};
                    const initialEngravingData = {};

                    imagesWithUrls[0].engraving_details?.engraving_lines.forEach((line) => {
                        // initialTexts[line.id] = line.text;
                        initialEngravingData[line.id] = {
                            text: "",
                            path: line.path_coordinates || "",
                            fontSize: line.font_size || 24,
                            color: line.font_color || "#000",
                            positionX: line.position_x || 0,
                            positionY: line.position_y || 0,
                            productDetails: line.product_details,
                        };
                    });
                    setSelectedImage(imagesWithUrls[0]);
                    setEngravingLines(imagesWithUrls[0].engraving_details?.engraving_lines || []);
                    setTexts({});
                    setEngravingData(initialEngravingData);
                    setModifiedImages(imagesWithUrls.map((img) => img.imageUrl));
                    // const engravingMap = {};
                    // imagesWithUrls[0].engraving_details?.engraving_lines.forEach(
                    //     (line) => {
                    //         engravingMap[line.id] = {
                    //             text: line.text,
                    //             path: line.path_coordinates || "",
                    //             fontSize: line.font_size || 24,
                    //             color: line.font_color || "#000",
                    //             positionX: line.position_x || 0,
                    //             positionY: line.position_y || 0,
                    //             productDetails: line.product_details,
                    //         };
                    //     }
                    // );
                    // setEngravingData(engravingMap);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setTimeout(() => setShowLoader(false), 3000);
            }
        },[id]);

        // fetchData();
        useEffect(() => {
            fetchData();
        }, [fetchData]);
   


    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/codes');
                const data = response?.data;
                console.log(response)
                const formattedCountries = data.data
                    .map(country => ({
                        name: country.name,
                        code: country.dial_code.split(',')[0].trim(),
                        iso2: country.code
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                setCountries(formattedCountries);
                setFormData(prev => ({
                    ...prev,
                    countryCode: formattedCountries[0]?.code || '+1'
                }));

            } catch (err) {
                console.error(err);
            }
        };

        fetchCountries();
    }, []);

    const debouncedCapturePreview = debounce(() => {
        capturePreview();
    }, 500);

    useEffect(() => {
        setTimeout(() => setShowLoader(false), 3000);
    }, []);

    const handleImageSelect = useCallback((image) => {
        setSelectedImage(image);
        setEngravingLines(image.engraving_details?.engraving_lines || []);
        // const initialValues = {};
        // const initialTexts = {};
        const initialEngravingData = {};
        (image.engraving_details?.engraving_lines || []).forEach((line) => {
            // initialValues[line.line_number] = line.text;
            // initialTexts[line.id] = line.text;
            initialEngravingData[line.id] = {
                text: "",
                path: line.path_coordinates || "",
                fontSize: line.font_size || 24,
                color: line.font_color || "#000",
                positionX: line.position_x || 0,
                positionY: line.position_y || 0,
                productDetails: line.product_details,
            };
        });
        setInputValues(initialValues);
        setTexts({});
        setEngravingData(initialEngravingData);
        const index = images.findIndex((img) => img.id === image.id);
        setSelectedPreviewIndex(index);
    },[images]);
    const handleCloseSnackbar = () => {
        setMessage(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: `${formData.countryCode} ${formData.phone}`,
                message: formData.message,
            };
            console.log("Payload", payload);
            const response = await axios.post(`${API_BASE_URL}/contact-us`, payload);
            console.log(response.data);
            setMessage(response.data.message);

            setFormData({
                name: "",
                email: "",
                phone: "",
                countryCode: "+1",
                message: "",
            });
            setIsOpen(false);
        } catch (error) {
            let errorMessage = "An error occurred while submitting the form";

            if (error.response) {
                console.log(error.response);
                errorMessage = error.response.data.detail || errorMessage;
            } else if (error.request) {
                errorMessage = "No response from server";
            }

            // enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedImage) {
            const timer = setTimeout(() => {
                capturePreview();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedImage]);


    useEffect(() => {
        if (selectedImage) {
            setEngravingLines(selectedImage.engraving_details?.engraving_lines || []);
            const newEngravingData = {};
            (selectedImage.engraving_details?.engraving_lines || []).forEach((line) => {
                newEngravingData[line.id] = {
                    text: line.text,
                    path: line.path_coordinates || "",
                    fontSize: line.font_size || 24,
                    color: line.font_color || "#000",
                    positionX: line.position_x || 0,
                    positionY: line.position_y || 0,
                    productDetails: line.product_details,
                };
            });
            setEngravingData(newEngravingData);
            const initialValues = {};
            (selectedImage.engraving_details?.engraving_lines || []).forEach((line) => {
                initialValues[line.line_number] = line.text;
            });
            setInputValues(initialValues);
        }
    }, [selectedImage]);


    useEffect(() => {
        if (images.length > 0) {
            setModifiedImages(images.map((img) => img.imageUrl));
        }
    }, [images]);




    useEffect(() => {
        if (selectedImage) {
            const index = images.findIndex((img) => img.id === selectedImage.id);
            setSelectedPreviewIndex(index);
        }
    }, [selectedImage]);

    const capturePreview = useCallback( () => {
        if (stageRef.current) {
            const dataUrl = stageRef.current.toDataURL();
            const updatedImages = [...modifiedImages];
            updatedImages[selectedPreviewIndex] = dataUrl;
            setModifiedImages(updatedImages);
            setPreviewImage(dataUrl);
        }
    },[modifiedImages,selectedPreviewIndex]);

    const handleRefresh = useCallback(() => {
        setShowLoader(true);
        fetchData();
    }, [fetchData]);



    const handleContactChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleTextChange = (lineId, value) => {
        setTexts((prev) => ({
            ...prev,
            [lineId]: value,
        }));
        debouncedCapturePreview();
    };

    return (
        <>
            {showLoader && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062538]/[0.34] backdrop-blur-[5px]">
                    <Loader />
                </div>
            )}

            <div>
                <TopHeader />
                <Snackbar
                    open={!!message || !!error}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={error ? 'error' : 'success'}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {error || message}
                    </Alert>
                </Snackbar>
                <div className="w-full md:h-[6vh] lg:h-[5vh] xl:h-[7vh] 2xl:h-[9vh] bg-[#1C4E6D] px-2 md:px-8">
                    <nav className="flex flex-wrap items-center justify-between h-full">
                        <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 lg:pr-19 xl:pr-22 md:py-3 px-3 md:pr-6 2xl:pr-41 2xl:pl-6 rounded-md sm:mb-0 cursor-pointer "
                            onClick={() => {
                                if (window.innerWidth < 1281) {
                                    setIsDrawerOpen(true);
                                }
                            }
                            }
                        >
                            <BiCategoryAlt className="text-white text-xl md:text-3xl" />
                            <span className="text-white text-sm md:text-xl font-semibold">
                                Features
                            </span>
                        </div>
                        <div className="flex items-center gap-2 h-full ml-auto">
                            <div
                                className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer "
                                onClick={() => setIsOpen(true)}
                            >
                                <MdPreview className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">
                                    Preview
                                </span>
                            </div>

                            <Drawer
                                anchor="left"
                                open={isDrawerOpen}
                                onClose={() => setIsDrawerOpen(false)}
                                sx={{
                                    "& .MuiDrawer-paper": {
                                        width: "50vw",
                                        backgroundColor: "#062538",
                                        color: "white",
                                        padding: "20px",
                                    },
                                }}
                            >
                                <div className="w-full flex flex-col gap-4">
                                    <div onClick={() => setIsDrawerOpen(false)} className='flex justify-end text-4xl'>x</div>
                                    <div className="flex items-center gap-4 mb-4 p-2 mt-4">
                                        <img src={kamaLogoWhite} alt="Logo" className="object-cover" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-4">Product Details</h1>


                                    <div className="space-y-2">
                                        {Array.from(new Set(
                                            selectedImage?.engraving_details?.engraving_lines?.flatMap(
                                                line => JSON.parse(line.product_details || "[]").map(pd => pd.property)
                                            ) || []
                                        )).map((property, index) => {
                                            const values = selectedImage.engraving_details.engraving_lines
                                                .flatMap(line =>
                                                    JSON.parse(line.product_details || "[]")
                                                        .filter(pd => pd.property === property)
                                                        .map(pd => pd.value)
                                                );

                                            return (
                                                <label
                                                    key={index}
                                                    htmlFor={`property-${property}`}
                                                    className={`flex items-center justify-between gap-4 px-6 py-2 hover:bg-gray-700 cursor-pointer bg-gray-800 rounded`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {getAttributeIcon(property)}
                                                        <span className="text-white">{property}</span>
                                                    </div>
                                                    <span className="text-white font-semibold">{[...new Set(values)].join(', ')}</span>
                                                </label>
                                            );
                                        })}
                                    </div>

                                </div>
                            </Drawer>

                            {isOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-200 bg-opacity-30">
                                    <div className="fixed inset-0 backdrop-blur-[2px] bg-white/30 flex justify-center items-center z-50 p-4">
                                        <div className="bg-gradient-to-br from-[#1C4E6D] to-[#062538] p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl 2xl:h-[80%] flex flex-col relative">
                                            <button
                                                className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-lg font-bold hover:text-gray-300 z-10 cursor-pointer"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                ✖
                                            </button>

                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-4 mt-2 md:mt-4 gap-4">
                                                <div className="text-white">
                                                    <h2 className="font-exo2 font-normal text-2xl md:text-[40px]">
                                                        Preview...
                                                    </h2>
                                                    <p className="font-exo2 font-normal text-lg md:text-[24px] text-gray-300 mt-2 md:mt-4">
                                                        How does it look? Isn't it pretty?...
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => generatePdfAndSendMail(myImage, selectedImage, modifiedImages, setShowLoader, setMessage, setError, email, "userflow")}
                                                    className="group flex items-center gap-2 bg-white text-[#062538] px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md hover:bg-[#062538] hover:text-white hover:border hover:border-white text-sm md:text-base cursor-pointer">
                                                    <MdEmail
                                                        size={16}
                                                        className="md:size-[20px] text-[#062538] group-hover:text-white"
                                                    />
                                                    <span className="group-hover:text-white">
                                                        Send Via Email
                                                    </span>
                                                </button>
                                            </div>

                                            <div className="flex flex-col 2xl:h-[30%] md:flex-row flex-1 w-full gap-4 md:gap-6">
                                                <div className="w-full md:w-3/5 2xl:h-[full] relative bg-white rounded-lg flex flex-col items-center justify-center p-2 md:p-4">
                                                    {modifiedImages.length > 0 && (
                                                        <>
                                                            <img
                                                                src={
                                                                    previewImage ||
                                                                    modifiedImages[selectedPreviewIndex]
                                                                }
                                                                alt="Preview"
                                                                className="w-full md:h-full 2xl:h-[90%] object-contain rounded-lg"
                                                            />
                                                        </>
                                                    )}
                                                    <div className="flex gap-4 mt-2 md:mt-4">

                                                        <button
                                                            className="bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-900 cursor-pointer hover:border"
                                                            onClick={() => {
                                                                const newIndex =
                                                                    (selectedPreviewIndex - 1 + images.length) %
                                                                    images.length;
                                                                setSelectedPreviewIndex(newIndex);
                                                                setSelectedImage(images[newIndex]);
                                                                setPreviewImage(modifiedImages[newIndex]);
                                                            }}
                                                        >
                                                            <FaChevronLeft size={20} />
                                                        </button>


                                                        <button
                                                            className="bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-900 cursor-pointer"
                                                            onClick={() => {
                                                                const newIndex =
                                                                    (selectedPreviewIndex + 1) % images.length;
                                                                setSelectedPreviewIndex(newIndex);
                                                                setSelectedImage(images[newIndex]);
                                                                setPreviewImage(modifiedImages[newIndex]);
                                                            }}
                                                        >
                                                            <FaChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>


                                                <div className="w-full md:w-2/5 bg-white p-3 md:p-5 rounded-lg">
                                                    {Array.from(new Set(
                                                        selectedImage?.engraving_details?.engraving_lines?.flatMap(
                                                            line => JSON.parse(line.product_details || "[]").map(pd => pd.property)
                                                        ) || []
                                                    )).map((property, index) => {
                                                        const values = selectedImage.engraving_details.engraving_lines
                                                            .flatMap(line => JSON.parse(line.product_details || "[]")
                                                                .filter(pd => pd.property === property)
                                                                .map(pd => pd.value) || []
                                                            );


                                                        return (
                                                            <div key={property} className="flex flex-row">
                                                                <div className="flex items-center gap-2 text-gray-700">
                                                                    {/* <Icon className={`${color} text-lg`} /> */}
                                                                    {getAttributeIcon(property)}
                                                                    <span>{property}:</span>
                                                                </div>
                                                                <span className="font-semibold pl-2">
                                                                    {[...new Set(values)].join(', ')}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div
                            onClick={handleRefresh}
                                // onClick={() => {
                                //     setSelectedImage(images[0]);
                                //     setEngravingLines(images[0].engraving_details?.engraving_lines || []);
                                //     setPreviewImage(images[0].imageUrl);
                                //     setSelectedPreviewIndex(0);
                                //     setInputValues({});
                                //     setTexts({});
                                //     setEngravingData({});
                                //     setModifiedImages(images.map((img) => img.imageUrl));
                                //     setShowLoader(true);
                                //     setTimeout(() => setShowLoader(false), 3000);
                                // }}
                                className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                                <RiRefreshFill className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">
                                    Refresh
                                </span>
                            </div>
                            <div
                                className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer "
                                onClick={() => setIsContactOpen(true)}
                            >
                                <BiSolidContact className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">
                                    Contact Us
                                </span>
                            </div>
                        </div>

                        {isContactOpen && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-200 bg-opacity-30">
                                <div className="fixed inset-0 backdrop-blur-[2px] bg-white/30 flex justify-center items-center z-50 p-4">
                                    <div className="bg-gradient-to-br from-[#1C4E6D] to-[#062538] p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl 2xl:h-[77%] flex flex-col relative">
                                        <button
                                            className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-lg font-bold hover:text-gray-300 z-10 cursor-pointer"
                                            onClick={() => setIsContactOpen(false)}
                                        >
                                            ✖
                                        </button>
                                        <div>
                                            <h2 className="text-white text-4xl font-bold mb-4">
                                                Contact Us{" "}
                                            </h2>
                                            <div>
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="space-y-10 p-4 bg-[#D9D9D94F] rounded-lg mt-4 px-15.5"
                                                >
                                                    <input
                                                        type="text"

                                                        name="name"
                                                        placeholder="Full Name"
                                                        className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                                        value={formData.name}
                                                        onChange={handleContactChange}
                                                        required
                                                    />

                                                    <input
                                                        type="email"
                                                        name="email"
                                                        placeholder="Email Address"
                                                        className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                                        value={formData.email}
                                                        onChange={handleContactChange}
                                                        required
                                                    />
                                                    <div className="w-[60%] flex gap-2">
                                                        <div className="flex items-center justify-center relative min-w-[80px] w-[40]">
                                                            <Select
                                                                value={formData.countryCode}
                                                                onChange={handleContactChange}
                                                                name="countryCode"
                                                                // input={<CustomInput />}
                                                                className="w-full"
                                                                renderValue={(value) => {
                                                                    const selectedCountry = countries.find(c => c.dialCode === value);
                                                                    return (
                                                                        <div className="flex items-center gap-2">
                                                                            {/* {selectedCountry && ( */}
                                                                            <img
                                                                                src="https://flagsapi.com/AF/flat/64.png"
                                                                                alt="flag"
                                                                                className="h-4 w-6 object-cover"
                                                                            />
                                                                            {/* )} */}
                                                                            <span>{value}</span>
                                                                        </div>
                                                                    );
                                                                }}
                                                                IconComponent={() => (
                                                                    <svg
                                                                        className="w-4 h-4 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 9l-7 7-7-7"
                                                                        />
                                                                    </svg>
                                                                )}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        sx: {
                                                                            backgroundColor: "#1C4E6D !important",
                                                                            "& .MuiMenuItem-root": {
                                                                                backgroundColor: "#1C4E6D !important",
                                                                                color: "white !important",
                                                                                "&:hover": {
                                                                                    backgroundColor: "#4B5563 !important",
                                                                                    color: "black !important",
                                                                                },
                                                                                "&.Mui-selected": {
                                                                                    backgroundColor: "#4B5563 !important",
                                                                                    color: "black !important",
                                                                                },
                                                                                "&.Mui-selected:hover": {
                                                                                    backgroundColor: "#4B5563 !important",
                                                                                    color: "black !important",
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                {countries.map((country) => (
                                                                    <MenuItem
                                                                        key={country.dialCode}
                                                                        value={country.dialCode}
                                                                        sx={{
                                                                            backgroundColor: "#1C4E6D",
                                                                            color: "white",
                                                                            "&:hover": {
                                                                                backgroundColor: "#4B5563",
                                                                                color: "black",
                                                                            },
                                                                            "&.Mui-selected": {
                                                                                backgroundColor: "#4B5563",
                                                                                color: "black",
                                                                            },
                                                                        }}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <img
                                                                                src="https://flagsapi.com/AF/flat/64.png"
                                                                                alt="flag"
                                                                                className="h-4 w-6 object-cover"
                                                                            />
                                                                            <span>{country.name} ({country.dialCode})</span>
                                                                        </div>
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            placeholder="Phone Number"
                                                            className="flex-1 bg-transparent text-white outline-none border-b border-gray-300 py-2"
                                                            value={formData.phone}
                                                            onChange={handleContactChange}
                                                            required
                                                        />
                                                    </div>


                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="message"
                                                            placeholder="Message"
                                                            className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                                            value={formData.message}
                                                            onChange={handleContactChange}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="flex gap-4 justify-end pt-4">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setFormData({
                                                                    name: "",
                                                                    email: "",
                                                                    phone: "",
                                                                    countryCode: "+1",
                                                                    message: "",
                                                                })
                                                            }
                                                            className="w-1/4 bg-[#fff] text-[#062538] cursor-pointer hover:text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            className="w-1/4 bg-[#062538] cursor-pointer text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                                                        // disabled={loading}
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </nav>
                    <div className="flex gap-4 py-4 pt-4 md:h-[calc(100vh-12vh)] lg:h-[calc(100vh-10vh)] xl:h-[calc(100vh-14vh)] 2xl:h-[calc(100vh-18vh)]">
                        <div className="border w-[20vw] overflow-y-auto ml-2 rounded-md bg-white shadow-md p-2 2xl:block md:hidden">
                            <div className="w-full h-full p-8">
                                <h3 className="text-lg font-bold mb-4">Product Details</h3>
                                <div className="space-y-4">
                                    {console.log("selectedImage?.engraving_details?", selectedImage?.engraving_details)}
                                    {Array.from(new Set(
                                        selectedImage?.engraving_details?.engraving_lines?.flatMap(
                                            line => JSON.parse(line.product_details || "[]").map(pd => pd.property)
                                        ) || []
                                    )).map((property, index) => {
                                        const values = selectedImage.engraving_details.engraving_lines
                                            .flatMap(line => JSON.parse(line.product_details || "[]")
                                                .filter(pd => pd.property === property)
                                                .map(pd => pd.value) || []
                                            );

                                        // const icons = [
                                        //     { Component: GiDiamondRing, color: 'text-blue-600' },
                                        //     { Component: FaGem, color: 'text-purple-600' },
                                        //     { Component: FaWeightHanging, color: 'text-yellow-600' },
                                        //     { Component: FaCubes, color: 'text-green-600' },
                                        //     { Component: FaDollarSign, color: 'text-gray-700' },
                                        // ];

                                        // const { Component: Icon, color } = icons[index % icons.length];

                                        return (
                                            <div key={property} className="flex flex-row">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    {getAttributeIcon(property)}
                                                    <span>{property}:</span>
                                                </div>
                                                <span className="font-semibold pl-2">
                                                    {[...new Set(values)].join(', ')}
                                                </span>
                                            </div>
                                        );
                                    })}

                                </div>
                            </div>
                            {/* {categoryTypes.map((category, index) => (
                                <div key={index} className="flex items-center justify-between gap-4 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        {category.icon1}
                                        <p>{category.name}</p>
                                    </div>
                                    <IoIosArrowForward />
                                </div>
                            ))} */}
                        </div>
                        <div className="flex flex-col 2xl:w-[80vw] md:w-[100vw] h-full bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] overflow-y-auto rounded-2xl shadow-md px-8 py-4 gap-4">
                            <div className="flex flex-col lg:flex-row gap-4 h-auto 2xl:h-[70%] lg:h-full items-center justify-self-start">
                                <div className="w-full h-full md:w-full lg:w-[35%] flex flex-col items-start justify-start relative">
                                    <p className="text-4xl text-white py-4">
                                        Available Views of the Jewellery
                                    </p>

                                    <div className="relative flex flex-col items-start justify-start">
                                        {/* Image Grid */}
                                        <div className="w-full lg:w-[30vw] lg:h-[40vh] xl:w-[25vw] 2xl:w-[20vw] grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2   gap-2 mx-2 lg:ml-10 lg:mr-10" style={{ margin: "0 auto" }}>
                                            {images.slice(0, 4).map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`bg-white w-full h-full p-2 rounded-lg shadow-lg flex items-center justify-center cursor-pointer 
                    ${selectedImage?.id === image.id ? "border-2 border-blue-500" : ""}`}
                                                    onClick={() => handleImageSelect(image)}
                                                >
                                                    <img
                                                        src={image.imageUrl}
                                                        alt={`View ${index + 1}`}
                                                        className="w-full h-full object-contain rounded-md"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Arrows Centered Below the Grid */}
                                        <div className="flex items-center justify-center mt-4 w-full">
                                            <IoIosArrowBack className="text-white cursor-pointer mx-4" size={32} />
                                            <IoIosArrowForward className="text-white cursor-pointer mx-4" size={32} />
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full lg:w-[65%] h-[300px] md:h-[400px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center lg:ml-6 p-2 md:p-4 overflow-hidden relative xl:mt-10">
                                    {selectedImage && (
                                        <EngravingStageForUser
                                            key={`${selectedImage?.id || 'default'}-${Object.keys(texts).length}`}
                                            ref={stageRef}
                                            selectedImage={selectedImage.imageUrl}
                                            engravingLines={engravingLines}
                                            engravingData={engravingData}
                                            konvaState={{
                                                scale: 1,
                                                rotation: 0,
                                                paths: engravingLines.reduce((acc, line) => {
                                                    acc[line.id] = line.path_coordinates || "";
                                                    return acc;
                                                }, {}),
                                                positions: engravingLines.reduce((acc, line) => {
                                                    acc[line.id] = {
                                                        x: line.position_x || 0,
                                                        y: line.position_y || 0,
                                                    };
                                                    return acc;
                                                }, {}),
                                                showPath: true,
                                            }}
                                            texts={texts}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="w-full p-2 rounded-2xl flex flex-col justify-between xl:mt-12">
                                <h2 className="text-lg font-semibold text-white mb-2">
                                    Engraving Id: {id}
                                </h2>
                                <div className="w-full flex flex-col gap-3">
                                    <div className="w-full flex flex-col gap-3">
                                        {engravingLines
                                            .slice()
                                            .sort((a, b) => a.line_number - b.line_number)
                                            .map((line) => {
                                                const lineId = line.id;
                                                const maxChars = line.no_of_characters;

                                                return (
                                                    <div
                                                        key={lineId}
                                                        className="w-full flex items-center gap-3"
                                                    >
                                                        <label className="text-white text-[16px] font-medium w-16">
                                                            Line {line.line_number}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={`Enter up to ${maxChars} characters`}
                                                            value={texts[lineId] || ""}
                                                            onChange={(e) => {
                                                                // Enforce character limit
                                                                const input = e.target.value.slice(0, maxChars);
                                                                handleTextChange(lineId, input);
                                                            }}
                                                            className="flex-1 min-w-0 p-2 rounded-lg bg-white border border-gray-400 text-black focus:border-blue-500 outline-none"
                                                        />
                                                        <span className="text-white text-[16px] w-10 text-right">
                                                            {texts[lineId]?.length || 0}/{maxChars}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default UserEngraving;
