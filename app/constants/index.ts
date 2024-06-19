export const PRODUCT_CATEGORIES = [
  {
    label: "Gaming",
    value: "gaming" as const,
    featured: [
      { name: "Latest Games", href: "#", imageSrc: "/latest.jpg" },
      { name: "Top Picks", href: "#", imageSrc: "/gaming.webp" },
    ],
  },
  {
    label: "Devices & Consoles",
    value: "devices_consoles" as const,
    featured: [
      {
        name: "PlayStation",
        href: "#",
        imageSrc: "/ps5.webp",
        categories: [
          { name: "devices", href: "#" },
          { name: "games", href: "#" },
        ],
      },
      { name: "Xbox", href: "#", imageSrc: "/xbox.jpg" },
      { name: "Nintendo Switch", href: "#", imageSrc: "/nintendo.jpg" },
      { name: "gaming laptops", href: "#", imageSrc: "/laptop.jpg" },
    ],
  },
  {
    label: "Computers",
    value: "computers" as const,
    featured: [
      { name: "Laptops", href: "#", imageSrc: "/pc.webp" },
      { name: "PCs", href: "#", imageSrc: "/laplap.jpg" },
    ],
  },
  {
    label: "Mobile Phones",
    value: "mobile_phones" as const,
    featured: [
      { name: "IPhone", href: "#", imageSrc: "/iphone.jpg" },
      { name: "Samsung", href: "#", imageSrc: "/eg-galaxy-s24-s928-sm-s928bztqmea-thumb-539296238.webp" },
      { name: "Huwawi", href: "#", imageSrc: "/huwawi.jpg" },
    ],
  },
  {
    label: "Wearables",
    value: "wearables" as const,
    featured: [
      { name: "Smartwatches", href: "#", imageSrc: "/smart.webp" },
      { name: "Headphones", href: "#", imageSrc: "/headphones.jpg" },
    ],
  },
];
