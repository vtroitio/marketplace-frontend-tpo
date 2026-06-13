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

function getUniqueImages(images) {
  const map = new Map();

  images.forEach((image) => {
    if (!map.has(image.id)) {
      map.set(image.id, image);
    }
  });

  return Array.from(map.values()).sort((a, b) => a.position - b.position);
}

export function groupVariantsByColor(variants = []) {
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

    group.images = getUniqueImages([
      ...group.images,
      ...(variant.images ?? []),
    ]);

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
    variantGroups: groupVariantsByColor(product.variants),
  };
}
