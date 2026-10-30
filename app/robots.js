export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://your-site.vercel.app/sitemap.xml",
  };
}