import login1 from "../assets/login1.gif";
import login2 from "../assets/login2.gif";

const Home = () => {
    return (
        <>  
        <div className="h-full w-full">

            <div className="flex md:h-auto lg:h-[70%] h-full">
                <div className="md:w-[60%] lg:w-[full] xl:h-[20] flex flex-col md:p-4 lg:p-8">
                    <span className="text-white text-2xl font-bold mb-4">Welcome, Admin!</span>
                    <div className="relative w-full h-full">
                        <img
                            src={login1}
                            alt="Left content"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                </div>
                <div className="w-[40%] lg:h-[full] md:p-4 lg:p-8">
                    <div className="h-full w-full relative">
                        <img
                            src={login2}
                            alt="Right content"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                </div>
            </div>
            <div className="break-words w-full min-h-[200px] md:p-4 lg:p-8 text-white text-justify overflow-y-auto">
            You are now logged in to the admin dashboard, where you can manage jewellery products effortlessly. Add new product categories, upload images, and configure engraving settings, including font, size, color, and placement. You can also manage other admins, update inventory, and keep product details organized. Start exploring and take full control of your jewellery collection!
            </div>
        </div>
        </>
    );
};

export default Home;