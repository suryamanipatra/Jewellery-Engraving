import React, { useState } from 'react';
import TopHeader from '../common/TopHeader';
import { BiCategoryAlt, BiSolidContact } from "react-icons/bi";
import { FaChildren } from "react-icons/fa6";
import { IoIosArrowForward } from "react-icons/io";
import Card from '../components/Card';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const UserCategories = () => {
    const categoryTypes = Array.from({ length: 13 }, (_, i) => ({
        name: `Category ${i + 1}`,
        icon1: <FaChildren />
    }));
    const allCards = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        category: `Category ${Math.floor(Math.random() * 13) + 1}`
    }));

    const [currentPage, setCurrentPage] = useState(1);
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

    return (
        <div>
            <TopHeader />
            <div className="w-full md:h-[6vh] lg:h-[5vh] xl:h-[7vh] 2xl:h-[9vh] bg-[#1C4E6D] px-2 md:px-8">
                <nav className="flex flex-wrap items-center justify-between h-full">
                    <div className="h-full flex justify-start gap-1 md:gap-2 bg-[#062538] lg:py-4 lg:pr-19 xl:pr-22 md:py-3 px-3 md:pr-6 2xl:pr-41 2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                        <BiCategoryAlt className="text-white text-xl md:text-3xl" />
                        <span className="text-white text-sm md:text-xl font-semibold">Features</span>
                    </div>

                    <div className="h-full flex justify-center items-center gap-1 md:gap-2 bg-[#062538] lg:py-4 xl:pr-22 md:py-3 px-3  2xl:pl-6 rounded-md sm:mb-0 cursor-pointer ">
                        <BiSolidContact className="text-white text-xl md:text-3xl" />
                        <span className="text-white text-sm md:text-xl font-semibold">Contact Us</span>
                    </div>
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
