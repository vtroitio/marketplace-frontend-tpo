const GENDER_CATEGORY_CODES = ["UNISEX", "HOMBRE", "MUJER"];

export const ATTRIBUTES = {
  SIZE: "TALLE",
  COLOR: "COLOR",
};

export function isGenderCategory(category) {
  return GENDER_CATEGORY_CODES.includes(category.code);
}

export function isTypeCategory(category, genderCode) {
  if (!genderCode) return false;
  return category.code.startsWith(`${genderCode}_`);
}

export function getProductGender(product) {
  return product.categories?.find(isGenderCategory) ?? null;
}

export function getProductType(product, genderCode) {
  return (
    product.categories?.find((category) =>
      isTypeCategory(category, genderCode),
    ) ?? null
  );
}

export function getVariantAttributeValue(variant, attributeCode) {
  return (
    variant.attributeValues?.find(
      (attributeValue) => attributeValue.attributeCode === attributeCode,
    ) ?? null
  );
}

function getUniqueImages(images, coverImagePath) {
  const map = new Map();
  images.forEach((image) => {
    if (!map.has(image.id)) map.set(image.id, image);
  });

  const sorted = Array.from(map.values()).sort((a, b) => a.position - b.position);

  if (coverImagePath) {
    const coverIdx = sorted.findIndex((img) => img.path === coverImagePath);
    if (coverIdx > 0) {
      const [cover] = sorted.splice(coverIdx, 1);
      sorted.unshift(cover);
    }
  }

  return sorted;
}

export function groupVariantsByColor(variants = [], coverImagePath = null) {
  const groups = new Map();

  variants.forEach((variant) => {
    const color = getVariantAttributeValue(variant, ATTRIBUTES.COLOR);
    const size = getVariantAttributeValue(variant, ATTRIBUTES.SIZE);

    if (!color || !size) return;

    if (!groups.has(color.id)) {
      groups.set(color.id, {
        colorAttributeValueId: color.id,
        colorCode: color.code,
        colorValue: color.value,
        hexColor: color.hexColor,
        images: [],
        sizes: [],
      });
    }

    const group = groups.get(color.id);

    group.images = getUniqueImages(
      [...group.images, ...(variant.images ?? []).map((img) => ({ ...img, variantId: variant.id }))],
      coverImagePath,
    );

    group.sizes.push({
      variantId: variant.id,
      sku: variant.sku,
      sizeAttributeValueId: size.id,
      sizeCode: size.code,
      sizeValue: size.value,
      price: variant.price?.toString() ?? "",
      stock: variant.stock?.toString() ?? "",
    });
  });

  return Array.from(groups.values());
}

export function getAttributeValues(attributes, attributeCode) {
  const attribute = attributes?.find((attr) => attr.code === attributeCode);
  return attribute?.values || [];
}

export function normalizeProductForForm(product, categories, attributes) {
  const selectedGender = getProductGender(product);
  const selectedType = getProductType(product, selectedGender?.code);

  return {
    ...product,
    _categories: categories,
    _attributes: attributes,
    selectedGender,
    selectedType,
    variantGroups: groupVariantsByColor(product.variants, product.coverImagePath),
  };
}

function generateSku(colorCode, sizeCode) {
  const color = (colorCode ?? "COL").slice(0, 3).toUpperCase();
  const size = (sizeCode ?? "TAL").slice(0, 3).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${color}-${size}-${rand}`;
}

export function mapFormToProductRequest(product) {
  const categoryIds = [product.selectedGender?.id, product.selectedType?.id].filter(Boolean);

  const variants = (product.variantGroups ?? []).flatMap((group) =>
    (group.sizes ?? []).map((size) => ({
      ...(size.variantId ? { id: size.variantId } : {}),
      sku: size.sku || generateSku(group.colorCode, size.sizeCode),
      price: Number(size.price),
      stock: Number(size.stock),
      attributeValues: [
        { attributeValueId: group.colorAttributeValueId },
        { attributeValueId: size.sizeAttributeValueId },
      ],
    }))
  );

  const variantPrices = variants.map((v) => v.price).filter((p) => p > 0);
  const productPrice =
    variantPrices.length > 0 ? Math.min(...variantPrices) : (Number(product.price) || 0);

  return {
    name: product.name,
    price: productPrice,
    description: product.description,
    categoryIds,
    variants,
  };
}
