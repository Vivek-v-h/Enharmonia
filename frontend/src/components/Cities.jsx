import React from 'react'

const Cities = () => {
  return (
    <div>
        <section className="p-6 md:px-12 text-center">
          <h2 className="text-xl font-semibold mb-4">
            We are available in well-known cities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Luton", "Manchester", "London", "Liverpool"].map((place) => (
              <div key={place} className="rounded-lg overflow-hidden shadow">
                <img
                  src={`./assets/${place}.jpg`}
                  alt={place}
                  className="w-full h-32 object-cover"
                />
                <div className="py-2 font-medium uppercase">{place}</div>
              </div>
            ))}
          </div>
        </section>
    </div>
  )
}

export default Cities