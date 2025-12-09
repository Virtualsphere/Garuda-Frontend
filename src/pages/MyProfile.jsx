import React from "react";
import { PanelRight } from "lucide-react";

export const MyProfile = () => {
  const cards = [
    {
      title: "IT Corridor",
      location: "Rangareddy, Telangana",
      area: "2 acres",
      pricePerAcre: "₹30,00,000",
      totalPrice: "₹60,00,000",
      town: "Hitech City (5 km)",
      points: 38,
    },
    {
      title: "Financial District",
      location: "Sangareddy, Telangana",
      area: "5 acres",
      pricePerAcre: "₹18,00,000",
      totalPrice: "₹90,00,000",
      town: "Lingampally (6 km)",
      points: 32,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <PanelRight />
          <h1 className="text-xl font-semibold">My Profile</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            + List a Property
          </button>
        </div>
      </header>
      <div className="p-8 bg-gray-100 min-h-screen text-gray-800">
        {/* My Listings */}
        <section className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-1">My Listings</h2>
          <p className="text-gray-500 mb-6">
            Properties you have listed on the platform.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((c, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border shadow-sm"
              >
                <h3 className="text-xl font-bold text-orange-600 mb-1">
                  {c.title}
                </h3>
                <p className="text-gray-600 mb-4">{c.location}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Area</span>
                    <span>{c.area}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price/Acre</span>
                    <span>{c.pricePerAcre}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Price</span>
                    <span>{c.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nearest Town</span>
                    <span>{c.town}</span>
                  </div>
                  <div className="flex justify-between text-orange-600 font-bold mt-2">
                    <span>Points</span>
                    <span>{c.points}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Wishlist */}
        <section className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-1">My Wishlist</h2>
          <p className="text-gray-500">Properties you have saved for later.</p>
        </section>
      </div>
    </div>
  );
};
