import ProductCard from "@/components/ProductCard"

export default async function Home() {

  const fetchData = await fetch("http://localhost:3000/api/products")
    const data = await fetchData.json()

  return (
    <div className="grid grid-cols-4 gap-4 p-6">
      {data.products.map((item) =>(
        <div key={item._id}>
          <ProductCard product={item} />
        </div>
      ))}
    </div>
  );
}