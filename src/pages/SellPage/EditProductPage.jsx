import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { AppLink, Spinner } from "../../components/ui";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import { normalizeProductForForm } from "../../helpers/productFormMapper";
import {
  fetchProductFilterOptions,
  fetchProductForEditById,
  updateProductWithImages,
  selectFilterOptionsError,
  selectFilterOptionsInitialized,
  selectFilterOptionsLoading,
  selectProductFormDataFromFilterOptions,
} from "../../features/products";

const ATTRIBUTES = {
  COLOR: "COLOR",
  SIZE: "TALLE",
};

function getVariantAttributeValue(variant, attributeCode) {
  return (
    variant.attributeValues?.find(
      (attributeValue) => attributeValue.attributeCode === attributeCode,
    ) ?? null
  );
}

function getColor(variant) {
  return getVariantAttributeValue(variant, ATTRIBUTES.COLOR);
}

function getImageKey(image) {
  return image?.path ?? image?.url ?? image?.imageUrl ?? image?.src ?? null;
}

function getImagesByColor(variants = [], selectedColorId) {
  if (!selectedColorId) return [];

  const imagesMap = new Map();

  variants.forEach((variant) => {
    const color = getColor(variant);

    if (color?.id !== selectedColorId) return;

    variant.images?.forEach((image) => {
      const imageKey = getImageKey(image);

      if (!imageKey) return;

      if (!imagesMap.has(imageKey)) {
        imagesMap.set(imageKey, {
          ...image,
          path: image.path ?? image.url ?? image.imageUrl ?? image.src,
        });
      }
    });
  });

  return Array.from(imagesMap.values()).sort(
    (a, b) => (a.position ?? 0) - (b.position ?? 0),
  );
}

function attachImagesGroupedByColor(normalizedProduct, rawProduct) {
  if (!normalizedProduct?.variantGroups || !rawProduct?.variants) {
    return normalizedProduct;
  }

  return {
    ...normalizedProduct,
    variantGroups: normalizedProduct.variantGroups.map((group) => ({
      ...group,
      images: getImagesByColor(
        rawProduct.variants,
        group.colorAttributeValueId,
      ),
    })),
  };
}

function getInitialImagesByColor(variantGroups = []) {
  return Object.fromEntries(
    variantGroups.map((group) => {
      const colorId = String(group.colorAttributeValueId);

      const imagesById = new Map();

      for (const image of group.images || []) {
        if (!image.id) continue;

        imagesById.set(image.id, {
          id: image.id,
          variantId: image.variantId,
        });
      }

      return [colorId, Array.from(imagesById.values())];
    }),
  );
}

export function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formOptions = useSelector(selectProductFormDataFromFilterOptions);
  const filterOptionsLoading = useSelector(selectFilterOptionsLoading);
  const filterOptionsInitialized = useSelector(selectFilterOptionsInitialized);
  const filterOptionsError = useSelector(selectFilterOptionsError);

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const initialImagesRef = useRef({});

  useEffect(() => {
    if (!filterOptionsInitialized && !filterOptionsLoading) {
      dispatch(fetchProductFilterOptions());
    }
  }, [dispatch, filterOptionsInitialized, filterOptionsLoading]);

  useEffect(() => {
    let ignore = false;

    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        setProductError(null);

        const productData = await dispatch(
          fetchProductForEditById(productId),
        ).unwrap();

        if (!ignore) {
          setProduct(productData);
        }
      } catch (error) {
        if (!ignore) {
          setProductError(error || "Ocurrió un error al cargar el producto.");
        }
      } finally {
        if (!ignore) {
          setLoadingProduct(false);
        }
      }
    }

    if (productId) {
      fetchProduct();
    }

    return () => {
      ignore = true;
    };
  }, [dispatch, productId]);

const normalizedProduct =
  product && filterOptionsInitialized
    ? attachImagesGroupedByColor(
        normalizeProductForForm(
          product,
          formOptions._categories,
          formOptions._attributes,
        ),
        product,
      )
    : null;

  useEffect(() => {
    if (!normalizedProduct) return;

    initialImagesRef.current = getInitialImagesByColor(
      normalizedProduct.variantGroups,
    );
  }, [normalizedProduct]);

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      await dispatch(
        updateProductWithImages({
          productId,
          updatedProduct,
          initialImagesByColor: initialImagesRef.current,
        }),
      ).unwrap();

      navigate("/sell");
    } catch (error) {
      setSubmitError(error || "Ocurrió un error al actualizar el producto.");
    } finally {
      setSubmitting(false);
    }
  };

  const error = productError || filterOptionsError;

  const loading =
    loadingProduct ||
    filterOptionsLoading ||
    (!filterOptionsInitialized && !filterOptionsError) ||
    (!error && !normalizedProduct);

  if (loading) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <Spinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-64">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <h1>Acceso denegado</h1>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-32">
      <AppLink to="/sell">
        <LeftArrowIcon />
        <span>Ir al panel de venta</span>
      </AppLink>

      <div className="border-b border-secondary pb-4">
        <h2>Editar Prenda</h2>
      </div>

      {submitError && <p className="mt-4 text-red-500">{submitError}</p>}

      <ProductForm
        data={normalizedProduct}
        onSubmit={handleUpdateProduct}
        submitLabel={submitting ? "Actualizando..." : "Actualizar Prenda"}
      />
    </section>
  );
}
