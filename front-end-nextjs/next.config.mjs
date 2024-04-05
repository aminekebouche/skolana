/** @type {import('next').NextConfig} */
import path from 'path';
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{hostname: 'api.dicebear.com'}],
    // Enable dangerouslyAllowSVG to allow rendering SVG images
    // Be cautious as this can pose security risks
    // Make sure the SVGs you are rendering are trusted
    dangerouslyAllowSVG: true,
  },

};

export default nextConfig;
