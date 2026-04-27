"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  FaGasPump,
  FaCogs,
  FaUsers,
  FaDoorOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaArrowRight,
  FaCalendarAlt
} from "react-icons/fa";
import ErrorCard from "../../../../components/ErrorCard";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [otherCars, setOtherCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carRes = await axios.get(`${API_BASE}/cars/get-car-details.php`, { params: { carId: id } });
        const allCarsRes = await axios.get(`${API_BASE}/cars/get-cars.php`);

        if (carRes.data?.success) {
          const carInfo = carRes.data.data.info;
          
          // Image Logic
          if (carInfo.featured_image) {
            carInfo.image = `${API_BASE}/${carInfo.featured_image.replace(/^\/+/, "")}`;
          } else if (carInfo.image_url) {
            carInfo.image = `${API_BASE}/${carInfo.image_url.replace(/^\/+/, "")}`;
          }

          // Ensure numeric types
          carInfo.min_booking_days = parseInt(carInfo.min_booking_days) || 1;
          setCar(carInfo);
        }

        const carsData = Array.isArray(allCarsRes.data) ? allCarsRes.data : allCarsRes.data?.data;
        if (carsData) {
          const filtered = carsData
            .filter(c => String(c.id) !== String(id))
            .slice(0, 4)
            .map(c => ({
              ...c,
              displayImage: c.image 
                ? `${API_BASE}/${c.image.replace(/^\/+/, "")}` 
                : '/placeholder-car.png'
            }));
          setOtherCars(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium tracking-widest animate-pulse">LOADING FLEET RECORDS...</div>;

  if (!car) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 px-4">
        <ErrorCard
          type="warning"
          title="Vehicle Not Found"
          message="The car you are looking for has been removed or does not exist."
          actions={<Link href="/cars" className="px-6 py-2 bg-green-600 text-white rounded-lg">Browse Fleet</Link>}
        />
      </main>
    );
  }

  const features = car.features || ["Air Conditioning", "Bluetooth", "GPS Navigation", "USB Port", "Reverse Camera"];

  return (
    <main className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <Link href="/cars" className="inline-flex items-center gap-2 mb-8 text-gray-500 hover:text-green-600 transition-colors group">
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium text-sm">Back to Fleet</span>
        </Link>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
              {car.image && (
                <Image src={car.image} alt={car.name} fill className="object-cover" priority />
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-black text-gray-900 leading-tight tracking-tight">{car.name}</h1>
            </div>
            
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-black text-green-600">ZMW {Number(car.price).toLocaleString()}</span>
              <span className="text-gray-400 font-medium">/ day</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{car.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <Spec icon={<FaCalendarAlt />} label="Minimum Stay" value={`${car.min_booking_days} ${car.min_booking_days > 1 ? 'Days' : 'Day'}`} highlight />
              <Spec icon={<FaGasPump />} label="Fuel" value={car.fuel} />
              <Spec icon={<FaCogs />} label="Transmission" value={car.transmission} />
              <Spec icon={<FaUsers />} label="Capacity" value={`${car.seats} Seats`} />
            </div>

            <div className="space-y-3 mb-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Premium Features</h3>
              <ul className="grid grid-cols-2 gap-y-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <FaCheckCircle className="text-green-500" size={14} /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={`/booking?carId=${car.id}`}
              className="group/btn relative block w-full text-center bg-gray-900 hover:bg-green-600 text-white py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-green-100 overflow-hidden"
            >
              <span className="relative z-10">
                {car.min_booking_days > 1 ? `Book Min. ${car.min_booking_days} Days` : 'Secure This Vehicle'}
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-24">
          <div className="flex items-end justify-between mb-10 border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Discover More</h2>
              <p className="text-gray-500 mt-1">Other premium vehicles from our professional fleet</p>
            </div>
            <Link href="/cars" className="text-green-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
              Explore All <FaArrowRight />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherCars.map((other) => (
              <Link href={`/cars/${other.id}`} key={other.id} className="group">
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-48 w-full bg-gray-100">
                    <Image 
                        src={other.displayImage} 
                        alt={other.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">{other.name}</h4>
                    <p className="text-green-600 font-black text-sm mt-1">
                        ZMW {Number(other.price_per_day || other.price).toLocaleString()} 
                        <span className="text-gray-400 font-medium text-xs ml-1">/ day</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Spec({ icon, label, value, highlight = false }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${highlight ? 'bg-blue-50/30 border-blue-100' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center gap-3">
        <span className={`text-xl w-10 h-10 flex items-center justify-center rounded-xl ${highlight ? 'text-blue-600 bg-blue-100' : 'text-green-600 bg-green-50'}`}>
          {icon}
        </span>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
          <p className={`font-bold text-sm ${highlight ? 'text-blue-700' : 'text-gray-800'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}