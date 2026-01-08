import { getProducts } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/backend";

interface HomeProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { search, category } = await searchParams;
  const products: Product[] = await getProducts(category, search);

  return (
    <main className="bg-[#eaeded] min-h-screen">
      {/* Banner Area (Mock) */}
      <div className="relative w-full h-80 bg-gradient-to-b from-blue-300 to-transparent">
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 pt-10">
          <h1 className="text-3xl font-bold text-gray-800">Shop your favorite items</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-10">
        {products.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
