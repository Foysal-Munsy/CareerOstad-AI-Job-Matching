/** @type {import('next').NextConfig} */

const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: 'https', // or 'http' if necessary
            hostname: 'i.ibb.co', // Replace with your trusted domain
            // Optional: You can also specify port and pathname if needed
            // port: '',
            // pathname: '/path/to/images/**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com', // Add more trusted domains as needed
          },
          {
            protocol: 'https',
            hostname: 'avatars.githubusercontent.com', // Add more trusted domains as needed
          },
        ],
      },
    };
    

    // module.exports = nextConfig;

export default nextConfig;