import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getAttributes,
  getCategories,
  getOwnedProducts,
  deleteProduct,
  activateProduct,
  deactivateProduct,
  getProductForEdit,
  updateProduct,
  uploadVariantImages,
  createProduct,
  getProductById,
  deleteVariantImage,
  reorderVariantImages,
  setCoverImage,
} from "../../api/products";
import { mapFormToProductRequest } from "../../helpers/productFormMapper";
import { buildExploreQueryKey } from "./productHelper";

export const fetchOwnedProducts = createAsyncThunk(
  "products/fetchOwned",
  async (page = 0, { rejectWithValue }) => {
    try {
      return await getOwnedProducts(page);
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  },
);

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || "Error al eliminar producto");
    }
  },
);

export const toggleProductActive = createAsyncThunk(
  "products/toggleActive",
  async ({ productId, isActive }, { rejectWithValue }) => {
    try {
      if (isActive) {
        await deactivateProduct(productId);
      } else {
        await activateProduct(productId);
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message || "Error al cambiar estado");
    }
  },
);

export const fetchProductFilterOptions = createAsyncThunk(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const [attributesData, categoriesData] = await Promise.all([
        getAttributes(),
        getCategories(),
      ]);

      return {
        categories: categoriesData,
        attributes: attributesData,
        sizes:
          attributesData.find((attribute) => attribute.code === "TALLE")
            ?.values || [],
        colors:
          attributesData.find((attribute) => attribute.code === "COLOR")
            ?.values || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Error al cargar opciones de filtros",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const filterOptions = getState().products.filterOptions;

      return !filterOptions.initialized && !filterOptions.loading;
    },
  },
);

export const fetchExploreProducts = createAsyncThunk(
  "products/fetchExplore",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { page, size, filters } = getState().products.explore;

      return await getAllProducts({
        page,
        size,
        search: filters.search,
        categoryIds: filters.categoryIds,
        sizeIds: filters.sizeIds,
        colorIds: filters.colorIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  },
  {
    condition: (_, { getState }) => {
      const explore = getState().products.explore;
      const queryKey = buildExploreQueryKey(explore);

      if (explore.loading) {
        return false;
      }

      if (explore.initialized && explore.lastQueryKey === queryKey) {
        return false;
      }

      return true;
    },
  },
);
export const createProductWithImages = createAsyncThunk(
  "products/createWithImages",
  async (product, { rejectWithValue }) => {
    try {
      const dto = mapFormToProductRequest(product);
      const created = await createProduct(dto);

      const fullProduct = await getProductById(created.id);

      let coverImageId = null;

      for (const group of product.variantGroups || []) {
        const newImages = (group.images || []).filter((img) => img.file);

        if (newImages.length === 0) continue;

        const matchingVariant = fullProduct.variants?.find((variant) =>
          variant.attributeValues?.some(
            (attributeValue) =>
              attributeValue.id === group.colorAttributeValueId,
          ),
        );

        if (!matchingVariant) continue;

        const files = newImages.map((img) => img.file);

        const uploaded = await uploadVariantImages(
          created.id,
          matchingVariant.id,
          files,
        );

        if (coverImageId === null && uploaded.length > 0) {
          coverImageId = uploaded[0].id;
        }
      }

      if (coverImageId !== null) {
        await setCoverImage(created.id, coverImageId);
      }

      return created;
    } catch (error) {
      return rejectWithValue(
        error.message || "Ocurrió un error al crear el producto.",
      );
    }
  },
);
export const fetchProductForEditById = createAsyncThunk(
  "products/fetchForEditById",
  async (productId, { rejectWithValue }) => {
    try {
      return await getProductForEdit(productId);
    } catch (error) {
      return rejectWithValue(
        error.message || "Ocurrió un error al cargar el producto.",
      );
    }
  },
);

export const updateProductWithImages = createAsyncThunk(
  "products/updateWithImages",
  async (
    {
      productId,
      updatedProduct,
      initialImagesByColor,
    },
    { rejectWithValue },
  ) => {
    try {
      const dto = mapFormToProductRequest(updatedProduct);

      await updateProduct(productId, dto);

      let coverImageId = null;

      for (const group of updatedProduct.variantGroups || []) {
        const colorKey = String(group.colorAttributeValueId);

        const initialImages = initialImagesByColor?.[colorKey] ?? [];

        const currentImageIds = new Set(
          (group.images || [])
            .filter((img) => img.id)
            .map((img) => img.id),
        );

        for (const img of initialImages) {
          if (!currentImageIds.has(img.id)) {
            await deleteVariantImage(productId, img.variantId, img.id);
          }
        }

        const variantId = group.sizes?.[0]?.variantId;

        if (!variantId) continue;

        const newImages = (group.images || []).filter((img) => img.file);

        if (newImages.length > 0) {
          const files = newImages.map((img) => img.file);

          const uploaded = await uploadVariantImages(
            productId,
            variantId,
            files,
          );

          if (coverImageId === null && uploaded.length > 0) {
            coverImageId = uploaded[0].id;
          }
        }

        const existingImageIds = (group.images || [])
          .filter((img) => img.id)
          .map((img) => img.id);

        if (existingImageIds.length > 0) {
          await reorderVariantImages(productId, variantId, existingImageIds);
        }

        if (coverImageId === null && group.images?.[0]?.id) {
          coverImageId = group.images[0].id;
        }
      }

      if (coverImageId !== null) {
        await setCoverImage(productId, coverImageId);
      }

      return true;
    } catch (error) {
      return rejectWithValue(
        error.message || "Ocurrió un error al actualizar el producto.",
      );
    }
  },
);