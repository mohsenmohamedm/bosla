/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // مصادر الصور المسموح بيها مع next/image.
    // لو أضفت مصدر تاني (Cloudinary مثلاً) ضيفه هنا.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
