import React from 'react'
import noProductFoundImage from '../assets/no-prpduct-found.jpg'

const NoProductFound = () => {
    return (
        <div className="w-full h-full mx-auto  rounded p-12">
            <div className="flex flex-col items-center text-center">
                <div className="w-[200px] h-[200px] flex items-center justify-center  rounded-full border-white border-5 shadow-sm">
                    <img src={noProductFoundImage} alt="Empty illustration" className="rounded-full" />
                </div>
                <div className="text-white text-2xl font-medium mt-4">
                    No records has been added yet.
                </div>

            </div>
        </div>
    )
}

export default NoProductFound