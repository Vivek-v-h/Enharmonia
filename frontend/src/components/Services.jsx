import React from 'react'
import { Link } from "react-router-dom";

const servicesdata = [
  {
    title: "Property Management",
    image: "../../assets/01.png",
    link: "/services/property-management",
    features: [
      "Free Referrals",
      "Guarantee Rent",
      "Up to £300 Damage Coverage",
      "Free Tenant Sourcing",
    ],
  },
  {
    title: "Ad Posting",
    image: "../../assets/02.png",
    link: "/services/ad-posting",
    features: [
      "Unlimited Posts",
      "Boost Visibility",
      "Custom Descriptions",
      "Image Upload Support",
    ],
  },
  {
    title: "Browse Listing",
    image: "../../assets/03.png",
    link: "/browse",
    features: [
      "Verified Listings",
      "Detailed Info",
      "Interactive Map",
      "Favorites & Alerts",
    ],
  },
  {
    title: "Contact Us",
    image: "../../assets/04.png",
    link: "/contact",
    features: [
      "24/7 Support",
      "Live Chat",
      "Direct Agent Access",
      "Quick Response",
    ],
  },
];

export default function Services() {
  return (
    <section className="p-6 md:px-12">
      <h2 className="text-center text-xl font-semibold mb-4">Our Services</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {servicesdata.map((service, index) => (
          <Link
            to={service.link}
            key={index}
            className="relative rounded-xl overflow-hidden group"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-60 object-cover transition-transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4 text-white">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              {service.features.map((feature, i) => (
                <p key={i} className="text-sm">
                  {feature}
                </p>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
