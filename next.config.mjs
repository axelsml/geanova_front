/** @type {import('next').NextConfig} */
const nextConfig = {
     output: 'export',
     async headers() {
       return [
         {
           source: '/:path*', // Aplica a todas las rutas
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=3600, must-revalidate', // Ajusta según tus necesidades
             },
           ],
         },
       ];
     },
   };
   
   export default nextConfig;