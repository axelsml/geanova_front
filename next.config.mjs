/** @type {import('next').NextConfig} */
const nextConfig = {
     async headers() {
       return [
         {
           source: '/:path*', // Aplica a todas las rutas
           headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=60, stale-while-revalidate=300', // 1 minuto de caché, mientras actualiza en segundo plano durante 5 minutos
            },
           ],
         },
       ];
     },
   };
   
   export default nextConfig;