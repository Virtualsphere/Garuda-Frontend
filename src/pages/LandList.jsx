import React, { useState } from "react";
import { PanelRight } from "lucide-react";

export const LandList = () => {
  const [view, setView] = useState("cards");

  const lands = [
    {
      id: 1,
      district: "Rangareddy",
      town: "Shamshabad",
      sector: "Kothur Zone",
      village: "Kothur",
      area: "10 acres",
      priceAcre: "₹5,00,000",
      totalPrice: "₹50,00,000",
      nearestTown: "Shamshabad (20 km)",
      points: 18,
      landType: "Agricultural",
    },
    {
      id: 2,
      district: "Sangareddy",
      town: "Miyapur",
      sector: "N/A",
      village: "Aminpur",
      area: "5 acres",
      priceAcre: "₹10,00,000",
      totalPrice: "₹50,00,000",
      nearestTown: "Miyapur (15 km)",
      points: 27,
      landType: "Agricultural",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
        {/* HEADER */}
      <header className="flex h-14 items-center justify-between bg-white px-2 shadow-sm">
        <div className="flex items-center gap-2">
          <PanelRight />
          <h1 className="text-xl font-semibold">Website Lands</h1>
        </div>
      </header>
      <div className="p-6 w-full">
        <div className="bg-white rounded-md shadow-sm p-4">
          <h2 className="text-2xl font-bold mb-1">Listed Lands</h2>
          <p className="text-gray-500 mb-4">
            A public-facing list of available land properties.
          </p>

          <div className="flex justify-end mb-4 gap-2">
            <button
              className={`px-4 py-2 rounded-full border ${
                view === "cards" ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => setView("cards")}
            >
              Cards
            </button>
            <button
              className={`px-4 py-2 rounded-full border ${
                view === "table" ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => setView("table")}
            >
              Table
            </button>
          </div>

          {view === "cards" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {lands.map((land) => (
                <div
                  key={land.id}
                  className="p-6 rounded-2xl shadow bg-white border"
                >
                  <h3 className="text-xl font-semibold text-orange-600">
                    {land.sector}
                  </h3>
                  <p className="text-gray-500 mb-3">
                    {land.district}, Telangana
                  </p>

                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Area:</strong> {land.area}
                    </p>
                    <p>
                      <strong>Price/Acre:</strong> {land.priceAcre}
                    </p>
                    <p>
                      <strong>Total Price:</strong> {land.totalPrice}
                    </p>
                    <p>
                      <strong>Nearest Town:</strong> {land.nearestTown}
                    </p>
                    <p>
                      <strong>Points:</strong>{" "}
                      <span className="text-orange-600 font-semibold">
                        {land.points}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button className="px-4 py-2 rounded-full bg-gray-100">
                      View Details
                    </button>
                    <button className="px-4 py-2 rounded-full bg-orange-500 text-white">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full border rounded-2xl overflow-hidden bg-white shadow">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3">District</th>
                    <th className="p-3">Town</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Village</th>
                    <th className="p-3">Area</th>
                    <th className="p-3">Price/Acre</th>
                    <th className="p-3">Total Price</th>
                    <th className="p-3">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {lands.map((land) => (
                    <React.Fragment key={land.id}>
                      <tr className="border-t">
                        <td className="p-3">{land.district}</td>
                        <td className="p-3">{land.town}</td>
                        <td className="p-3">{land.sector}</td>
                        <td className="p-3">{land.village}</td>
                        <td className="p-3">{land.area}</td>
                        <td className="p-3">{land.priceAcre}</td>
                        <td className="p-3">{land.totalPrice}</td>
                        <td className="p-3">{land.points}</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td
                          colSpan="8"
                          className="p-4 text-center text-gray-600"
                        >
                          <p className="font-semibold mb-1">Land Type</p>
                          <p>{land.landType}</p>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
