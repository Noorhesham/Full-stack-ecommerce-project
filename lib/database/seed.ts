'use server'
import connect from "./connect"
import Categorey from "./models/CategoreyModel"
import SubCategory from "./models/SubCategoreyModel";

export const seed = async () => {
    // Seed your database with dummy data here
    const subCategories = [
        { name: "Latest Games", imageSrc: "/latest.jpg",parent:'Gaming' },
        { name: "Top Picks", imageSrc: "/gaming.webp" ,parent:'Gaming'},
        { name: "PlayStation", imageSrc: "/ps5.webp" ,parent:'Devices & Consoles'},
        { name: "Xbox", imageSrc: "/xbox.jpg" ,parent:'Devices & Consoles'},
        { name: "Nintendo Switch", imageSrc: "/nintendo.jpg",parent:'Devices & Consoles'},
        { name: "Laptops", imageSrc: "/pc.webp" ,parent:'Computers'},
        { name: "PCs", imageSrc: "/laplap.jpg" ,parent:'Computers'},
        { name: "IPhone",  imageSrc: "/iphone.jpg",parent:'Mobile Phones' },
        { name: "Samsung",  imageSrc: "/eg-galaxy-s24-s928-sm-s928bztqmea-thumb-539296238.webp",parent:'Mobile Phones' },
        { name: "Huwawi",  imageSrc: "/huwawi.jpg",parent:'Mobile Phones' },
        { name: "Smartwatches", href: "#", imageSrc: "/smart.webp" ,parent:'Wearables'},
        { name: "Headphones", href: "#", imageSrc: "/headphones.jpg" ,parent:'Wearables'},
      ];
    connect()
   const categories=await Categorey.find()
   subCategories.forEach(async (subCategory) => {
       const category = categories.find((category) => category.name === subCategory.parent);
       if (category) {
           const newSubCategory =await SubCategory.create({
               name: subCategory.name,
               imageSrc: subCategory.imageSrc,
               parentCategorey: category._id
           });
       }
   })

}
    