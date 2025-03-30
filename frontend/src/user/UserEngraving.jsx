import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TopHeader from '../common/TopHeader';
import { BiCategoryAlt, BiSolidContact } from "react-icons/bi";
import { FaChildren } from 'react-icons/fa6';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import kamaLogo from "../assets/with-ring.jpg";
import { MdEmail } from 'react-icons/md';
import { FaChevronLeft, FaChevronRight, FaCubes, FaDollarSign, FaGem, FaWeightHanging } from 'react-icons/fa';
import { GiDiamondRing } from 'react-icons/gi';
import Loader from "../common/Loader.jsx";

const UserEngraving = () => {
    const { id } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState([]); 
    const [selectedImage, setSelectedImage] = useState(null);
    const [engravingLines, setEngravingLines] = useState([]);
    const [inputValues, setInputValues] = useState({});
    const [productDetails, setProductDetails] = useState({});
    const [showLoader, setShowLoader] = useState(true);
    const categoryTypes = Array(13).fill({ name: "Category 1", icon1: <FaChildren /> });


useEffect(() => {
    const fetchData = async () => {
        try {
            setShowLoader(true);
            const detailsResponse = await axios.get(`http://localhost:5000/api/get-details?jewelry_upload_id=${id}`);
            const detailsData = detailsResponse?.data;
            const imagesWithUrls = await Promise.all(detailsData.map(async (item) => {
                const fileResponse = await axios.get(`http://localhost:5000/api/get-file/${item.file_path}`, { responseType: 'blob' });
                const blob = new Blob([fileResponse.data]);
                return {
                    ...item,
                    imageUrl: URL.createObjectURL(blob),
                    engraving_details: item.engraving_details[0] || null
                };
            }));

            setImages(imagesWithUrls);
            if (imagesWithUrls.length > 0) {
                setSelectedImage(imagesWithUrls[0]);
                setEngravingLines(imagesWithUrls[0].engraving_details?.engraving_lines || []);
            }
            if (detailsData[0]?.product) {
                setProductDetails(detailsData[0].product);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setTimeout(() => setShowLoader(false), 3000);
        }
    };

    fetchData();
}, [id]);


    useEffect(() => {
        setTimeout(() => setShowLoader(false), 3000);
    }, [])


    const handleImageSelect = (image) => {
        setSelectedImage(image);
        setEngravingLines(image.engraving_details?.engraving_lines || []);
        const initialValues = {};
        (image.engraving_details?.engraving_lines || []).forEach(line => {
            initialValues[line.line_number] = line.text;
        });
        setInputValues(initialValues);
    };


    const handleInputChange = (lineNumber, value) => {
        setInputValues(prev => ({
            ...prev,
            [lineNumber]: value
        }));
    };

    return (

        <>
            {showLoader &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062538]/[0.34] backdrop-blur-[5px]">
                    <Loader />
                </div>

            }

            <div>
                <TopHeader />
                <div className="w-full md:h-[6vh] lg:h-[5vh] xl:h-[7vh] 2xl:h-[9vh] bg-[#1C4E6D] px-2 md:px-8">
                    <nav className="flex flex-wrap items-center justify-between h-full">
                        <div className="h-full flex justify-start gap-1 md:gap-2 bg-[#062538] lg:py-4 lg:pr-19 xl:pr-22 md:py-3 px-3 md:pr-6 2xl:pr-41 2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                            <BiCategoryAlt className="text-white text-xl md:text-3xl" />
                            <span className="text-white text-sm md:text-xl font-semibold">Features</span>
                        </div>
                        <div className="flex items-center gap-2 h-full ml-auto">
                            <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer "
                                onClick={() => setIsOpen(true)}
                            >
                                <BiSolidContact className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">Preview</span>
                            </div>
                            {isOpen && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white-200 bg-opacity-30">
                                    <div className="fixed inset-0 backdrop-blur-[2px] bg-white/30 flex justify-center items-center z-50 p-4">
                                        <div
                                            className="bg-gradient-to-br from-[#1C4E6D] to-[#062538] p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl 2xl:h-[80%] flex flex-col relative"

                                        >
                                            <button
                                                className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-lg font-bold hover:text-gray-300 z-10 cursor-pointer"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                ✖
                                            </button>

                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-4 mt-2 md:mt-4 gap-4">
                                                <div className="text-white">
                                                    <h2 className="font-exo2 font-normal text-2xl md:text-[40px]">Preview...</h2>
                                                    <p className="font-exo2 font-normal text-lg md:text-[24px] text-gray-300 mt-2 md:mt-4">
                                                        How does it look? Isn't it pretty?...
                                                    </p>
                                                </div>
                                                <button className="group flex items-center gap-2 bg-white text-[#062538] px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md hover:bg-[#062538] hover:text-white hover:border text-sm md:text-base cursor-pointer">
                                                    <MdEmail size={16} className="md:size-[20px] text-[#062538] group-hover:text-white" />
                                                    <span className="group-hover:text-white">Send Via Email</span>
                                                </button>

                                            </div>

                                            <div className="flex flex-col 2xl:h-[30%] md:flex-row flex-1 w-full gap-4 md:gap-6">
                                                <div className="w-full md:w-3/5 2xl:h-[full]  relative bg-white rounded-lg flex flex-col items-center justify-center p-2 md:p-4">

                                                    <img
                                                        src={kamaLogo}
                                                        alt="Preview"
                                                        className="w-full md:h-full 2xl:h-[90%] object-contain rounded-lg"
                                                    />
                                                    <div className="flex gap-4 mt-2 md:mt-4">
                                                        <button className="bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-900 cursor-pointer hover:border">
                                                            <FaChevronLeft size={20} />
                                                        </button>
                                                        <button className="bg-gray-700 text-white p-2 md:p-3 rounded-full shadow-md hover:bg-gray-900 cursor-pointer">
                                                            <FaChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Product Details */}
                                                <div className="w-full md:w-2/5  bg-white p-3 md:p-5 rounded-lg">
                                                    <h3 className="text-base md:text-lg font-bold mb-2 md:mb-4">Product Name</h3>
                                                    <div className="text-[#062538] 2xl:h-[90%] space-y-2 md:space-y-3 text-sm md:text-base overflow-y-auto">
                                                        <div className="">
                                                            <span className="flex items-center gap-1 md:gap-2">
                                                                <GiDiamondRing className="text-blue-600 md:size-[20px] whitespace-nowrap" size={16} />
                                                                Diamond Color:
                                                            </span>
                                                            <span className="font-bold whitespace-nowrap px-7">Diamond Color</span>
                                                        </div>
                                                        <div className="">
                                                            <span className="flex items-center gap-1 md:gap-2">
                                                                <FaGem className="text-purple-600 md:size-[20px]" size={16} />
                                                                Diamond Quality:
                                                            </span>
                                                            <span className="font-bold whitespace-nowrap px-7">Diamond Quantity</span>
                                                        </div>
                                                        <div className="">
                                                            <span className="flex items-center gap-1 md:gap-2">
                                                                <FaWeightHanging className="text-yellow-600 md:size-[20px]" size={16} />
                                                                Gold Wt.:
                                                            </span>
                                                            <span className="font-bold whitespace-nowrap px-7">productDetails gm</span>
                                                        </div>
                                                        <div className="">
                                                            <span className="flex items-center gap-1 md:gap-2">
                                                                <FaCubes className="text-green-600 md:size-[20px]" size={16} />
                                                                Stones:
                                                            </span>
                                                            <span className="font-bold whitespace-nowrap px-7">Stone</span>
                                                        </div>
                                                        <div className=" text-base md:text-lg font-semibold">
                                                            <span className="flex items-center gap-1 md:gap-2">
                                                                <FaDollarSign className="text-gray-700 md:size-[20px] " size={16} />
                                                                Amount:
                                                            </span>
                                                            <span className="font-bold whitespace-nowrap px-7">Amount $</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}




                            <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                                <BiSolidContact className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">Refresh</span>
                            </div>
                            <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                                <BiSolidContact className="text-white text-xl md:text-3xl" />
                                <span className="text-white text-sm md:text-xl font-semibold">Contact Us</span>
                            </div>
                        </div>


                    </nav>
                    <div className="flex gap-4 py-4 pt-4 md:h-[calc(100vh-12vh)] lg:h-[calc(100vh-10vh)] xl:h-[calc(100vh-14vh)] 2xl:h-[calc(100vh-18vh)]">

                        <div className="border w-[20vw] overflow-y-auto ml-2 rounded-md bg-white shadow-md p-2 2xl:block md:hidden">
                            {categoryTypes.map((category, index) => (
                                <div key={index} className="flex items-center justify-between gap-4 px-6 py-2 hover:bg-gray-100 cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        {category.icon1}
                                        <p>{category.name}</p>
                                    </div>
                                    <IoIosArrowForward />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col 2xl:w-[80vw] md:w-[100vw] h-full bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] overflow-y-auto rounded-2xl shadow-md p-4 gap-4">
                            <div className="flex flex-col xl:flex-row  gap-4 h-auto 2xl:h-[70%] lg:h-full items-center justify-center">
                                <div className="w-full md:w-full lg:w-full lg:w-2/5 flex flex-col items-center relative">
                                    <p className="text-2xl text-gray-300 ml-10 py-4">Available Views of the Jewellery</p>
                                    <div className="relative flex items-center justify-center lg:justify-start">
                                        <IoIosArrowBack className='text-white' size={32} />
                                        <div className="grid md:grid-cols-4 2xl:grid-cols-2 gap-2 mx-2 ml-10 mr-10">
                                            {images.map((image, index) => (
                                                <div
                                                    key={index}
                                                    className={`bg-white p-2 w-24 md:w-28 lg:w-32 rounded-lg shadow-lg aspect-square flex items-center justify-center cursor-pointer ${selectedImage?.id === image.id ? 'border-2 border-blue-500' : ''
                                                        }`}
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
                                        <IoIosArrowForward className='text-white' size={32} />
                                    </div>
                                </div>
                                <div className="w-full  md:h-[40vh] lg:h-[60vh] 2xl:h-full flex items-center justify-center bg-white rounded-2xl shadow-md relative">
                                    {selectedImage && (
                                        <svg
                                            viewBox={`0 0 ${selectedImage.image_width} ${selectedImage.image_height}`}
                                            className="w-full h-full"
                                        >
                                            <image
                                                xlinkHref={selectedImage.imageUrl}
                                                width="100%"
                                                height="100%"
                                            />
                                            {engravingLines.map((line) => (
                                                line.path_coordinates ? (
                                                    <text key={line.id}>
                                                        <path id={`path-${line.id}`} d={line.path_coordinates} fill="none" />
                                                        <textPath href={`#path-${line.id}`}
                                                            fontSize={line.font_size}
                                                            fill={line.font_color}
                                                            fontFamily={line.font_type}>
                                                            {inputValues[line.line_number] || ''}
                                                        </textPath>
                                                    </text>
                                                ) : (
                                                    <text
                                                        key={line.id}
                                                        x={line.position_x}
                                                        y={line.position_y}
                                                        fontSize={line.font_size}
                                                        fill={line.font_color}
                                                        fontFamily={line.font_type}
                                                    >
                                                        {inputValues[line.line_number] || ''}
                                                    </text>
                                                )
                                            ))}
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="w-full p-2 rounded-2xl flex flex-col justify-between">
                                <h2 className="text-lg font-semibold text-white mb-2">Engraving Id: {id}</h2>
                                <div className="w-full flex flex-col gap-3">
                                    {selectedImage?.engraving_details &&
                                        Array.from({ length: selectedImage.engraving_details.total_lines }).map((_, index) => {
                                            const lineNumber = index + 1;
                                            const lineData = engravingLines.find(l => l.line_number === lineNumber);

                                            return (
                                                <div key={index} className="w-full flex items-center gap-3">
                                                    <label className="text-white text-[16px] font-medium w-16">
                                                        Line {lineNumber}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter engraving text"
                                                        value={inputValues[lineNumber] || ''}
                                                        onChange={(e) => handleInputChange(lineNumber, e.target.value)}
                                                        className="flex-1 min-w-0 p-2 rounded-lg bg-white border border-gray-400 text-black focus:border-blue-500 outline-none"
                                                    />
                                                    <span className="text-white text-[16px] w-10 text-right">
                                                        {inputValues[lineNumber]?.length || 0}/10
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

        </>
    );
}
export default UserEngraving;
