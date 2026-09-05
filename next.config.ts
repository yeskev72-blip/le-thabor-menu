import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sans cela, Turbopack remonte jusqu'au package-lock.json du dossier utilisateur.
  turbopack: { root: __dirname },
};

export default nextConfig;
