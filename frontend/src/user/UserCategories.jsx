import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputBase, styled } from '@mui/material';
import TopHeader from '../common/TopHeader';
import { BiCategoryAlt, BiSolidContact } from "react-icons/bi";
import { FaChildren } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import Card from '../components/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const CustomInput = styled(InputBase)(({ theme }) => ({
    '& .MuiInputBase-input': {
        backgroundColor: '#D9D9D94F',
        color: 'white',
        padding: '10px 26px 10px 12px',
    },
}));

const UserCategories = () => {
    const categoryTypes = Array.from({ length: 13 }, (_, i) => ({
        name: `Category ${i + 1}`,
        icon1: <FaChildren />
    }));
    const allCards = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        category: `Category ${Math.floor(Math.random() * 13) + 1}`
    }));

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        countryCode: '+1',
        message: ''
    });
    const [countries, setCountries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const cardsPerPage = 12;
    const filteredCards = selectedCategory
        ? allCards.filter(card => card.category === selectedCategory)
        : allCards;

    const startIndex = (currentPage - 1) * cardsPerPage;
    const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            ...formData,
            fullPhone: `${formData.countryCode}${formData.phone}`
        });
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://countriesnow.space/api/v0.1/countries/codes');
                const data = response.data;

                const formattedCountries = data.data
                    .map(country => ({
                        name: country.name,
                        code: country.dial_code.split(',')[0].trim()
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


    return (
        <div>
            <TopHeader />
            <div className="w-full md:h-[6vh] lg:h-[5vh] xl:h-[7vh] 2xl:h-[9vh] bg-[#1C4E6D] px-2 md:px-8">
                <nav className="flex flex-wrap items-center justify-between h-full">
                    <div className="h-full flex justify-start gap-1 md:gap-2 bg-[#062538] lg:py-4 lg:pr-19 xl:pr-22 md:py-3 px-3 md:pr-6 2xl:pr-41 2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                        <BiCategoryAlt className="text-white text-xl md:text-3xl" />
                        <span className="text-white text-sm md:text-xl font-semibold">Features</span>
                    </div>

                    <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer "
                        onClick={() => setIsOpen(true)}
                    >
                        <BiSolidContact className="text-white text-xl md:text-3xl" />
                        <span className="text-white text-sm md:text-xl font-semibold">Contact Us</span>
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
                                    <div>
                                        <h2 className="text-white text-4xl font-bold mb-4">Contact Us </h2>
                                        <div>
                                            <form
                                                onSubmit={handleSubmit}
                                                className="space-y-10 p-4 bg-[#D9D9D94F] rounded-lg mt-4 px-15.5">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Full Name"
                                                    className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />

                                                <input
                                                    type="email"
                                                    name="email"
                                                    placeholder="Email Address"
                                                    className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                                <div className="w-[60%] flex gap-2">
                                                    <div className="flex items-center justify-center relative min-w-[80px] w-[40]">
                                                        <Select
                                                            value={formData.countryCode}
                                                            onChange={handleInputChange}
                                                            name="countryCode"
                                                            input={<CustomInput />}
                                                            className="w-full"
                                                            IconComponent={() => (
                                                                <svg
                                                                    className="w-4 h-4 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            )}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    sx: {
                                                                        width: "auto",
                                                                        '& .MuiMenuItem-root': {
                                                                            bgcolor: "#1C4E6D",
                                                                            color: 'white',
                                                                        },
                                                                        maxHeight: '200px',
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {countries.map((country) => (
                                                                <MenuItem key={country.code} value={country.code}>
                                                                    {country.code}
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
                                                        onChange={handleInputChange}
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
                                                        onChange={handleInputChange}

                                                        required
                                                    />

                                                </div>

                                                <div className='flex gap-4 justify-end pt-4'>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({
                                                            name: '',
                                                            email: '',
                                                            phone: '',
                                                            countryCode: '+1',
                                                            message: ''
                                                        })}
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
            </div>

            <div className="flex gap-4 py-4 pt-4 md:h-[calc(100vh-12vh)] lg:h-[calc(100vh-10vh)] xl:h-[calc(100vh-14vh)] 2xl:h-[calc(100vh-18vh)]">

                <div className="border w-[20vw] ml-2 md:ml-8 overflow-y-auto rounded-md bg-white shadow-md p-2 2xl:block md:hidden">
                    <div
                        className={`flex items-center justify-between gap-4 px-6 py-2 hover:bg-gray-100 cursor-pointer ${!selectedCategory ? 'bg-gray-200' : ''
                            }`}
                        onClick={() => {
                            setSelectedCategory(null);
                            setCurrentPage(1);
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <FaChildren />
                            <p>All Categories</p>
                        </div>
                    </div>
                    {categoryTypes.map((category, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-between gap-4 px-6 py-2 hover:bg-gray-100 cursor-pointer ${selectedCategory === category.name ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => {
                                setSelectedCategory(category.name);
                                setCurrentPage(1);
                            }}
                        >
                            <div className="flex items-center gap-4">
                                {category.icon1}
                                <p>{category.name}</p>
                            </div>
                            <IoIosArrowForward />
                        </div>
                    ))}
                </div>

                <div className="border 2xl:w-[80vw] md:w-full overflow-y-auto rounded-md bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] shadow-md 2xl:mr-8 p-4 flex flex-col">

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {currentCards.length > 0 ? (
                            currentCards.map((card) => (
                                <Card
                                    key={card.id}
                                    id={card.id}
                                    category={card.category}
                                />
                            ))
                        ) : (
                            <div className="text-white text-lg col-span-full text-center">
                                No cards to show for this category.
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Stack spacing={2}>
                            <Pagination
                                count={Math.ceil(filteredCards.length / cardsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: 'white',
                                    },
                                    '& .MuiPaginationItem-root.Mui-selected': {
                                        backgroundColor: 'white',
                                        color: 'black',
                                    },
                                    '& .MuiPaginationItem-root.Mui-selected:hover': {
                                        backgroundColor: 'white',
                                        opacity: 0.9,
                                    }
                                }}
                            />

                        </Stack>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCategories;
