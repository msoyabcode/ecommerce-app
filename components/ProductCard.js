export default function ProductCarf ({product}){
    return(
        <div className=" bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 ">
            <img src={product.images[0]} alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-3 " />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h2>
            <p className="text-xl font-bold text-emerald-600 mb-3">{product.price}</p>
            <button className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition-colors">Add to Cart</button>
        </div>
    )
}