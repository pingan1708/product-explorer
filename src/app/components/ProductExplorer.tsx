"use client";

import { useEffect, useState } from "react";
import { defaultQuery, fetchProducts } from "@/app/lib/product";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/app/lib/product";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchKey, setSearchKey] = useState(0); 

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(
      error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ"
    );
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");

    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  function saveProduct(draft: ProductDraft) {
    if (editingProduct) {
      
      setProducts((prevProducts) =>
        prevProducts.map((item) =>
          String(item.id) === String(editingProduct.id)
            ? { ...item, ...draft }
            : item
        )
      );
      setEditingProduct(null); 
    } else {
     
      const newProduct: Product = {
        ...draft,
        id: Date.now(),
        images: ["https://dummyjson.com/image/150"], 
      };

    
      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      setSearchKey((prev) => prev + 1);
      setStatus("ready");
    }
  }

  function removeProduct(id: number | string) {
    setProducts((prev) => prev.filter((item) => String(item.id) !== String(id)));
    if (editingProduct && String(editingProduct.id) === String(id)) {
      setEditingProduct(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-bold text-sky-400">📦 คลังสินค้า</h1>
            <button
              type="button"
              onClick={() => {
                setSearchKey((prev) => prev + 1);
                loadProducts(defaultQuery);
              }}
              disabled={status === "loading"}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg transition cursor-pointer text-sm font-medium"
            >
              {status === "loading" ? "⏳ กำลังโหลด..." : "🔄 รีเฟรชข้อมูล"}
            </button>
          </div>

          <ProductSearchForm key={searchKey} onSearch={loadProducts} />
        </section>

        {status === "loading" && (
          <div className="text-center py-12 text-slate-400">⏳ กำลังโหลดข้อมูลสินค้า...</div>
        )}

        {status === "error" && (
          <div className="p-4 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl" role="alert">
            ❌ {errorMessage}
          </div>
        )}

        {status === "ready" && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden">
            {products.length === 0 ? (
              <div className="p-12 text-center text-slate-400">ไม่พบรายการสินค้า</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 px-4">รูปภาพ</th>
                      <th className="py-3 px-4">ชื่อสินค้า</th>
                      <th className="py-3 px-4">ราคา</th>
                      <th className="py-3 px-4">คงเหลือ</th>
                      <th className="py-3 px-4">หมวดหมู่</th>
                      <th className="py-3 px-4 text-center">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-md border border-slate-700 bg-slate-800"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-500">
                              ไม่มีรูป
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-200">{item.title}</td>
                        <td className="py-3 px-4 text-emerald-400 font-semibold">
                          ฿{item.price?.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{item.stock} ชิ้น</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 text-xs rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingProduct(item)}
                              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md text-xs font-medium transition cursor-pointer"
                            >
                              แก้ไข
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProduct(item.id)}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md text-xs font-medium transition cursor-pointer"
                            >
                              ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
        <ProductForm
          key={editingProduct ? editingProduct.id : "new-product"}
          editing={editingProduct}
          onSave={saveProduct}
          onCancel={() => setEditingProduct(null)}
        />
      </div>
    </main>
  );
}