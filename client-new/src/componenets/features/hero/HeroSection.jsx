import React,{useState} from "react";
import { Search } from "lucide-react";
import { Button } from "@components/common/Button";
import { Input } from "@components/common/Input";
import toast from "react-hot-toast";

export const HeroSection = ({onSearch}) => {
    const [checkIn,setCheckIn]=useState('')
    const [checkOut,setCheckOut]=useState('')

    const handleSearch = () => {
        if(!checkIn || !checkOut){
            toast.error('Please select the check-in and check-out dates')
            return
        }
        onSearch(checkIn,checkOut)
    }

    return(
        <section
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: 'url(https://i.pinimg.com/1200x/f3/40/cf/f340cff300c3cc33491f5b911455c164.jpg)',
            }}
        >
            <div className="absolute inset-0 bg-black/50" />
      
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
                Welcome to Hotel Himalayas
                </h1>
                <p className="text-xl md:text-2xl mb-12 drop-shadow-lg">
                Experience luxury and comfort in the heart of the city
                </p>

                <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                    Book Your Stay
                    </h3>
                    <div className="space-y-4">
                    <Input
                        type="date"
                        label="Check-in Date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="text-gray-900"
                    />
                    <Input
                        type="date"
                        label="Check-out Date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="text-gray-900"
                    />
                    <Button
                        onClick={handleSearch}
                        icon={Search}
                        className="w-full"
                        size="lg"
                    >
                    Search Available Rooms
                    </Button>
                </div>
            </div>
      </div>
    </section>
    )
}