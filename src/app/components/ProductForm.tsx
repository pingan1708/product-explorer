"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/app/lib/product";
import type { Product, ProductDraft } from "@/app/lib/product";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({
  editing,
  onSave,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
          category: CATEGORIES[0],
        },
  });

  useEffect(() => {
    if (editing) {
      reset({
        title: editing.title,
        price: editing.price,
        stock: editing.stock,
        category: editing.category,
      });
    } else {
      reset({
        title: "",
        price: undefined,
        stock: undefined,
        category: CATEGORIES[0],
      });
    }
  }, [editing, reset]);

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <div className="max-w-xl mx-auto my-8 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100">
      <h2 className="text-xl font-bold mb-6 text-sky-400 border-b border-slate-800 pb-3 flex items-center gap-2">
        {editing ? "✏️ แก้ไขข้อมูลสินค้า" : "➕ เพิ่มสินค้าใหม่"}
      </h2>

      <form onSubmit={handleSubmit(saveProduct)} noValidate className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">
            ชื่อสินค้า
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-400">⚠️ {errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-300 mb-1">
              ราคา (บาท)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-400">⚠️ {errors.price.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-300 mb-1">
              จำนวนคงเหลือ
            </label>
            <input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-rose-400">⚠️ {errors.stock.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
            หมวดหมู่
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 outline-none cursor-pointer"
          >
            {CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-400">⚠️ {errors.category.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-lg transition cursor-pointer"
          >
            {editing ? "💾 บันทึกการแก้ไข" : "➕ เพิ่มสินค้า"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg transition cursor-pointer"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}