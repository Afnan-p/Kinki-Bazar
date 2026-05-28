import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords, image }) => {
  const currentUrl = window.location.href;
  
  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Canonical URL to prevent duplicate content issues */}
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Kinki Bazar | Premium Luxury Fashion & Ceramics',
  description: 'Discover the world of Kinki Bazar. Shop exclusive, handcrafted luxury collections crafted for the modern visionary.',
  keywords: 'luxury, fashion, ceramics, premium shopping, exclusive collections',
  image: 'https://via.placeholder.com/1200x630?text=Kinki+Bazar' // Default sharing image
};

export default Meta;
