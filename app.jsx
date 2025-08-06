import React, { useState } from "react";

export default function App() {
  const [product, setProduct] = useState({
    naam: "",
    beschrijving: "",
    sku: "",
    gtin13: "",
    merk: "",
    afbeelding: "",
    afbeelding_hoogte: "",
    afbeelding_breedte: "",
    afbeelding_caption: "",
    beoordeling: "",
    aantal_reviews: "",
    review_rating: "",
    review_auteur: "",
    url: "",
    prijs: "",
    staat: "",
    voorraad: "",
    verkoper: "",
  });

  const [varianten, setVarianten] = useState([]);

  const addVariant = () => {
    setVarianten([
      ...varianten,
      {
        name: "",
        sku: "",
        gtin13: "",
        prijs: "",
        image: "",
        description: "",
      },
    ]);
  };

  const removeVariant = (index) => {
    const updated = [...varianten];
    updated.splice(index, 1);
    setVarianten(updated);
  };

  const updateVariant = (index, field, value) => {
    const updated = [...varianten];
    updated[index][field] = value;
    setVarianten(updated);
  };

  const updateProduct = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  const generateJSONLD = () => {
    const json = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.naam,
      description: product.beschrijving,
      sku: product.sku,
      gtin13: product.gtin13,
      brand: {
        "@type": "Brand",
        name: product.merk,
      },
      image: [
        {
          "@type": "ImageObject",
          url: product.afbeelding,
          height: product.afbeelding_hoogte,
          width: product.afbeelding_breedte,
          caption: product.afbeelding_caption,
        },
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.beoordeling,
        reviewCount: product.aantal_reviews,
      },
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.review_rating,
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: product.review_auteur,
        },
      },
      offers: {
        "@type": "Offer",
        url: product.url,
        priceCurrency: "EUR",
        price: product.prijs,
        itemCondition: `https://schema.org/${product.staat}`,
        availability: `https://schema.org/${product.voorraad}`,
        seller: {
          "@type": "Organization",
          name: product.verkoper,
          inLanguage: "nl-NL",
        },
      },
      hasVariant: varianten.map((v) => ({
        "@type": "Product",
        name: v.name,
        sku: v.sku,
        gtin13: v.gtin13,
        description: v.description,
        image: v.image,
        offers: {
          "@type": "Offer",
          price: v.prijs,
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          inLanguage: "nl-NL",
        },
      })),
    };

    return JSON.stringify(json, null, 2);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product JSON-LD Generator</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {Object.keys(product).map((field) => (
          <input
            key={field}
            className="border p-2 rounded"
            placeholder={field}
            value={product[field]}
            onChange={(e) => updateProduct(field, e.target.value)}
          />
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Varianten</h2>
      {varianten.map((variant, index) => (
        <div key={index} className="border rounded p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(variant).map((field) => (
              <input
                key={field}
                className="border p-2 rounded"
                placeholder={`Variant ${index + 1} - ${field}`}
                value={variant[field]}
                onChange={(e) => updateVariant(index, field, e.target.value)}
              />
            ))}
          </div>
          <button
            onClick={() => removeVariant(index)}
            className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
          >
            Verwijder variant
          </button>
        </div>
      ))}

      <button
        onClick={addVariant}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Voeg variant toe
      </button>

      <h2 className="text-xl font-semibold mb-2">Gegenereerde JSON-LD</h2>
      <textarea
        className="w-full h-96 border rounded p-2 font-mono"
        value={generateJSONLD()}
        readOnly
      />
    </div>
  );
}
